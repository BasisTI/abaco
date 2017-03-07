import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { FatorAjuste } from './fator-ajuste.model';
import { FatorAjustePopupService } from './fator-ajuste-popup.service';
import { FatorAjusteService } from './fator-ajuste.service';
import { Manual, ManualService } from '../manual';
@Component({
    selector: 'jhi-fator-ajuste-dialog',
    templateUrl: './fator-ajuste-dialog.component.html'
})
export class FatorAjusteDialogComponent implements OnInit {

    fatorAjuste: FatorAjuste;
    authorities: any[];
    isSaving: boolean;

    manuals: Manual[];
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private fatorAjusteService: FatorAjusteService,
        private manualService: ManualService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['fatorAjuste', 'tipoFatorAjuste', 'impactoFatorAjuste']);
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.manualService.query().subscribe(
            (res: Response) => { this.manuals = res.json(); }, (res: Response) => this.onError(res.json()));
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.fatorAjuste.id !== undefined) {
            this.fatorAjusteService.update(this.fatorAjuste)
                .subscribe((res: FatorAjuste) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.fatorAjusteService.create(this.fatorAjuste)
                .subscribe((res: FatorAjuste) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: FatorAjuste) {
        this.eventManager.broadcast({ name: 'fatorAjusteListModification', content: 'OK'});
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

    trackManualById(index: number, item: Manual) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-fator-ajuste-popup',
    template: ''
})
export class FatorAjustePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private fatorAjustePopupService: FatorAjustePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.fatorAjustePopupService
                    .open(FatorAjusteDialogComponent, params['id']);
            } else {
                this.modalRef = this.fatorAjustePopupService
                    .open(FatorAjusteDialogComponent);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
