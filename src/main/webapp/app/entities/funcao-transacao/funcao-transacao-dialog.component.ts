import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { FuncaoTransacao } from './funcao-transacao.model';
import { FuncaoTransacaoPopupService } from './funcao-transacao-popup.service';
import { FuncaoTransacaoService } from './funcao-transacao.service';
import { Analise, AnaliseService } from '../analise';
import { Funcionalidade, FuncionalidadeService } from '../funcionalidade';
import { FatorAjuste, FatorAjusteService } from '../fator-ajuste';
import { Alr, AlrService } from '../alr';
@Component({
    selector: 'jhi-funcao-transacao-dialog',
    templateUrl: './funcao-transacao-dialog.component.html'
})
export class FuncaoTransacaoDialogComponent implements OnInit {

    funcaoTransacao: FuncaoTransacao;
    authorities: any[];
    isSaving: boolean;

    analises: Analise[];

    funcionalidades: Funcionalidade[];

    fatorajustes: FatorAjuste[];

    alrs: Alr[];
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private funcaoTransacaoService: FuncaoTransacaoService,
        private analiseService: AnaliseService,
        private funcionalidadeService: FuncionalidadeService,
        private fatorAjusteService: FatorAjusteService,
        private alrService: AlrService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['funcaoTransacao', 'tipoFuncaoTransacao', 'complexidade']);
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.analiseService.query().subscribe(
            (res: Response) => { this.analises = res.json(); }, (res: Response) => this.onError(res.json()));
        this.funcionalidadeService.query().subscribe(
            (res: Response) => { this.funcionalidades = res.json(); }, (res: Response) => this.onError(res.json()));
        this.fatorAjusteService.query().subscribe(
            (res: Response) => { this.fatorajustes = res.json(); }, (res: Response) => this.onError(res.json()));
        this.alrService.query().subscribe(
            (res: Response) => { this.alrs = res.json(); }, (res: Response) => this.onError(res.json()));
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.funcaoTransacao.id !== undefined) {
            this.funcaoTransacaoService.update(this.funcaoTransacao)
                .subscribe((res: FuncaoTransacao) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.funcaoTransacaoService.create(this.funcaoTransacao)
                .subscribe((res: FuncaoTransacao) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: FuncaoTransacao) {
        this.eventManager.broadcast({ name: 'funcaoTransacaoListModification', content: 'OK'});
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

    trackAnaliseById(index: number, item: Analise) {
        return item.id;
    }

    trackFuncionalidadeById(index: number, item: Funcionalidade) {
        return item.id;
    }

    trackFatorAjusteById(index: number, item: FatorAjuste) {
        return item.id;
    }

    trackAlrById(index: number, item: Alr) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-funcao-transacao-popup',
    template: ''
})
export class FuncaoTransacaoPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private funcaoTransacaoPopupService: FuncaoTransacaoPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.funcaoTransacaoPopupService
                    .open(FuncaoTransacaoDialogComponent, params['id']);
            } else {
                this.modalRef = this.funcaoTransacaoPopupService
                    .open(FuncaoTransacaoDialogComponent);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
