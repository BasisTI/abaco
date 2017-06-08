import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { Modulo } from './modulo.model';
import { ModuloPopupService } from './modulo-popup.service';
import { ModuloService } from './modulo.service';
import { Sistema, SistemaService } from '../sistema';
import { Funcionalidade, FuncionalidadeService } from '../funcionalidade';
@Component({
    selector: 'jhi-modulo-dialog',
    templateUrl: './modulo-dialog.component.html'
})
export class ModuloDialogComponent implements OnInit {

    modulo: Modulo;
    authorities: any[];
    isSaving: boolean;

    sistemas: Sistema[];

    funcionalidades: Funcionalidade[];
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private moduloService: ModuloService,
        private sistemaService: SistemaService,
        private funcionalidadeService: FuncionalidadeService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['modulo','analise', 'metodoContagem', 'tipoAnalise']);
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.sistemaService.query().subscribe(
            (res: Response) => { this.sistemas = res.json(); }, (res: Response) => this.onError(res.json()));
        this.funcionalidadeService.query().subscribe(
            (res: Response) => { this.funcionalidades = res.json(); }, (res: Response) => this.onError(res.json()));
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.modulo.id !== undefined) {
            this.moduloService.update(this.modulo)
                .subscribe((res: Modulo) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.moduloService.create(this.modulo)
                .subscribe((res: Modulo) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: Modulo) {
        this.eventManager.broadcast({ name: 'moduloListModification', content: 'OK'});
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

    trackSistemaById(index: number, item: Sistema) {
        return item.id;
    }

    trackFuncionalidadeById(index: number, item: Funcionalidade) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-modulo-popup',
    template: ''
})
export class ModuloPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private moduloPopupService: ModuloPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.moduloPopupService
                    .open(ModuloDialogComponent, params['id']);
            } else {
                this.modalRef = this.moduloPopupService
                    .open(ModuloDialogComponent);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
