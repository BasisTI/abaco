import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { Funcionalidade } from './funcionalidade.model';
import { FuncionalidadePopupService } from './funcionalidade-popup.service';
import { FuncionalidadeService } from './funcionalidade.service';
import { Modulo, ModuloService } from '../modulo';
import { FuncaoDados, FuncaoDadosService } from '../funcao-dados';
import { FuncaoTransacao, FuncaoTransacaoService } from '../funcao-transacao';
@Component({
    selector: 'jhi-funcionalidade-dialog',
    templateUrl: './funcionalidade-dialog.component.html'
})
export class FuncionalidadeDialogComponent implements OnInit {

    funcionalidade: Funcionalidade;
    authorities: any[];
    isSaving: boolean;

    modulos: Modulo[];

    funcaodados: FuncaoDados[];

    funcaotransacaos: FuncaoTransacao[];
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private funcionalidadeService: FuncionalidadeService,
        private moduloService: ModuloService,
        private funcaoDadosService: FuncaoDadosService,
        private funcaoTransacaoService: FuncaoTransacaoService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['funcionalidade','analise', 'metodoContagem', 'tipoAnalise']);
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.moduloService.query().subscribe(
            (res: Response) => { this.modulos = res.json(); }, (res: Response) => this.onError(res.json()));
        this.funcaoDadosService.query().subscribe(
            (res: Response) => { this.funcaodados = res.json(); }, (res: Response) => this.onError(res.json()));
        this.funcaoTransacaoService.query().subscribe(
            (res: Response) => { this.funcaotransacaos = res.json(); }, (res: Response) => this.onError(res.json()));
        if (this.funcionalidade.module_id) {
            this.moduloService.find(this.funcionalidade.module_id).subscribe(module => {
                this.funcionalidade.modulo=module;
            });
        }
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.funcionalidade.id !== undefined) {
            this.funcionalidadeService.update(this.funcionalidade)
                .subscribe((res: Funcionalidade) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.funcionalidadeService.create(this.funcionalidade)
                .subscribe((res: Funcionalidade) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: Funcionalidade) {
        this.eventManager.broadcast({ name: 'funcionalidadeListModification', content: 'OK'});
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

    trackModuloById(index: number, item: Modulo) {
        return item.id;
    }

    trackFuncaoDadosById(index: number, item: FuncaoDados) {
        return item.id;
    }

    trackFuncaoTransacaoById(index: number, item: FuncaoTransacao) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-funcionalidade-popup',
    template: ''
})
export class FuncionalidadePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private funcionalidadePopupService: FuncionalidadePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.funcionalidadePopupService
                    .open(FuncionalidadeDialogComponent, params['id']);
            } else {
                if (params['module_id']) {
                   this.modalRef = this.funcionalidadePopupService
                        .open(FuncionalidadeDialogComponent,0,params['module_id']);
                } else {
                    this.modalRef = this.funcionalidadePopupService
                        .open(FuncionalidadeDialogComponent);
                }
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
