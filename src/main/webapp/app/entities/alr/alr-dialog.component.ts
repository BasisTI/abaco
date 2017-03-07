import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { Alr } from './alr.model';
import { AlrPopupService } from './alr-popup.service';
import { AlrService } from './alr.service';
import { FuncaoTransacao, FuncaoTransacaoService } from '../funcao-transacao';
import { FuncaoDados, FuncaoDadosService } from '../funcao-dados';
@Component({
    selector: 'jhi-alr-dialog',
    templateUrl: './alr-dialog.component.html'
})
export class AlrDialogComponent implements OnInit {

    alr: Alr;
    authorities: any[];
    isSaving: boolean;

    funcaotransacaos: FuncaoTransacao[];

    funcaodados: FuncaoDados[];
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private alrService: AlrService,
        private funcaoTransacaoService: FuncaoTransacaoService,
        private funcaoDadosService: FuncaoDadosService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['alr']);
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.funcaoTransacaoService.query().subscribe(
            (res: Response) => { this.funcaotransacaos = res.json(); }, (res: Response) => this.onError(res.json()));
        this.funcaoDadosService.query().subscribe(
            (res: Response) => { this.funcaodados = res.json(); }, (res: Response) => this.onError(res.json()));
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.alr.id !== undefined) {
            this.alrService.update(this.alr)
                .subscribe((res: Alr) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.alrService.create(this.alr)
                .subscribe((res: Alr) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: Alr) {
        this.eventManager.broadcast({ name: 'alrListModification', content: 'OK'});
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

    trackFuncaoTransacaoById(index: number, item: FuncaoTransacao) {
        return item.id;
    }

    trackFuncaoDadosById(index: number, item: FuncaoDados) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-alr-popup',
    template: ''
})
export class AlrPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private alrPopupService: AlrPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.alrPopupService
                    .open(AlrDialogComponent, params['id']);
            } else {
                this.modalRef = this.alrPopupService
                    .open(AlrDialogComponent);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
