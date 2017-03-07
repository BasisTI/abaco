import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { Rlr } from './rlr.model';
import { RlrPopupService } from './rlr-popup.service';
import { RlrService } from './rlr.service';
import { Der, DerService } from '../der';
import { FuncaoDados, FuncaoDadosService } from '../funcao-dados';
@Component({
    selector: 'jhi-rlr-dialog',
    templateUrl: './rlr-dialog.component.html'
})
export class RlrDialogComponent implements OnInit {

    rlr: Rlr;
    authorities: any[];
    isSaving: boolean;

    ders: Der[];

    funcaodados: FuncaoDados[];
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private rlrService: RlrService,
        private derService: DerService,
        private funcaoDadosService: FuncaoDadosService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['rlr']);
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.derService.query().subscribe(
            (res: Response) => { this.ders = res.json(); }, (res: Response) => this.onError(res.json()));
        this.funcaoDadosService.query().subscribe(
            (res: Response) => { this.funcaodados = res.json(); }, (res: Response) => this.onError(res.json()));
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.rlr.id !== undefined) {
            this.rlrService.update(this.rlr)
                .subscribe((res: Rlr) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.rlrService.create(this.rlr)
                .subscribe((res: Rlr) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: Rlr) {
        this.eventManager.broadcast({ name: 'rlrListModification', content: 'OK'});
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

    trackDerById(index: number, item: Der) {
        return item.id;
    }

    trackFuncaoDadosById(index: number, item: FuncaoDados) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-rlr-popup',
    template: ''
})
export class RlrPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private rlrPopupService: RlrPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.rlrPopupService
                    .open(RlrDialogComponent, params['id']);
            } else {
                this.modalRef = this.rlrPopupService
                    .open(RlrDialogComponent);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
