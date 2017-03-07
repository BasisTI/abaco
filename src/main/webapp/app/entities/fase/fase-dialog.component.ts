import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { Fase } from './fase.model';
import { FasePopupService } from './fase-popup.service';
import { FaseService } from './fase.service';
@Component({
    selector: 'jhi-fase-dialog',
    templateUrl: './fase-dialog.component.html'
})
export class FaseDialogComponent implements OnInit {

    fase: Fase;
    authorities: any[];
    isSaving: boolean;
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private faseService: FaseService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['fase']);
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.fase.id !== undefined) {
            this.faseService.update(this.fase)
                .subscribe((res: Fase) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.faseService.create(this.fase)
                .subscribe((res: Fase) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: Fase) {
        this.eventManager.broadcast({ name: 'faseListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError (error) {
        this.isSaving = false;
        this.onError(error);
    }

    private onError (error) {
        this.alertService.error(error.message, null, null);
    }
}

@Component({
    selector: 'jhi-fase-popup',
    template: ''
})
export class FasePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private fasePopupService: FasePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.fasePopupService
                    .open(FaseDialogComponent, params['id']);
            } else {
                this.modalRef = this.fasePopupService
                    .open(FaseDialogComponent);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
