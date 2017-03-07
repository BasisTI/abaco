import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { Der } from './der.model';
import { DerPopupService } from './der-popup.service';
import { DerService } from './der.service';
import { Rlr, RlrService } from '../rlr';
@Component({
    selector: 'jhi-der-dialog',
    templateUrl: './der-dialog.component.html'
})
export class DerDialogComponent implements OnInit {

    der: Der;
    authorities: any[];
    isSaving: boolean;

    rlrs: Rlr[];
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private derService: DerService,
        private rlrService: RlrService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['der']);
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.rlrService.query().subscribe(
            (res: Response) => { this.rlrs = res.json(); }, (res: Response) => this.onError(res.json()));
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.der.id !== undefined) {
            this.derService.update(this.der)
                .subscribe((res: Der) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.derService.create(this.der)
                .subscribe((res: Der) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: Der) {
        this.eventManager.broadcast({ name: 'derListModification', content: 'OK'});
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

    trackRlrById(index: number, item: Rlr) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-der-popup',
    template: ''
})
export class DerPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private derPopupService: DerPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.derPopupService
                    .open(DerDialogComponent, params['id']);
            } else {
                this.modalRef = this.derPopupService
                    .open(DerDialogComponent);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
