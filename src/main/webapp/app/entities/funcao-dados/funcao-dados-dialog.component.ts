import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { FuncaoDados } from './funcao-dados.model';
import { FuncaoDadosPopupService } from './funcao-dados-popup.service';
import { FuncaoDadosService } from './funcao-dados.service';
import { Analise, AnaliseService } from '../analise';
import { Funcionalidade, FuncionalidadeService } from '../funcionalidade';
import { FatorAjuste, FatorAjusteService } from '../fator-ajuste';
import { Rlr, RlrService } from '../rlr';
import { Alr, AlrService } from '../alr';
@Component({
    selector: 'jhi-funcao-dados-dialog',
    templateUrl: './funcao-dados-dialog.component.html'
})
export class FuncaoDadosDialogComponent implements OnInit {

    funcaoDados: FuncaoDados;
    authorities: any[];
    isSaving: boolean;

    analises: Analise[];

    funcionalidades: Funcionalidade[];

    fatorajustes: FatorAjuste[];

    rlrs: Rlr[];

    alrs: Alr[];
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private funcaoDadosService: FuncaoDadosService,
        private analiseService: AnaliseService,
        private funcionalidadeService: FuncionalidadeService,
        private fatorAjusteService: FatorAjusteService,
        private rlrService: RlrService,
        private alrService: AlrService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['funcaoDados', 'tipoFuncaoDados', 'complexidade']);
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
        this.rlrService.query().subscribe(
            (res: Response) => { this.rlrs = res.json(); }, (res: Response) => this.onError(res.json()));
        this.alrService.query().subscribe(
            (res: Response) => { this.alrs = res.json(); }, (res: Response) => this.onError(res.json()));
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.funcaoDados.id !== undefined) {
            this.funcaoDadosService.update(this.funcaoDados)
                .subscribe((res: FuncaoDados) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.funcaoDadosService.create(this.funcaoDados)
                .subscribe((res: FuncaoDados) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: FuncaoDados) {
        this.eventManager.broadcast({ name: 'funcaoDadosListModification', content: 'OK'});
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

    trackRlrById(index: number, item: Rlr) {
        return item.id;
    }

    trackAlrById(index: number, item: Alr) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-funcao-dados-popup',
    template: ''
})
export class FuncaoDadosPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private funcaoDadosPopupService: FuncaoDadosPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.funcaoDadosPopupService
                    .open(FuncaoDadosDialogComponent, params['id']);
            } else {
                this.modalRef = this.funcaoDadosPopupService
                    .open(FuncaoDadosDialogComponent);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
