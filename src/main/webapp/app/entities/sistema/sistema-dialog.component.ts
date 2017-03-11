import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { Sistema } from './sistema.model';
import { SistemaPopupService } from './sistema-popup.service';
import { ModuloPopupService } from '../modulo/modulo-popup.service';
import { SistemaService } from './sistema.service';
import { Organizacao, OrganizacaoService } from '../organizacao';
import { Modulo, ModuloService, ModuloDialogComponent } from '../modulo';
@Component({
    selector: 'jhi-sistema-dialog',
    templateUrl: './sistema-dialog.component.html'
})
export class SistemaDialogComponent implements OnInit {

    sistema: Sistema;
    authorities: any[];
    isSaving: boolean;

    organizacaos: Organizacao[];

    modulos: Modulo[];
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private sistemaService: SistemaService,
        private organizacaoService: OrganizacaoService,
        private moduloService: ModuloService,
        private eventManager: EventManager,
        private moduloPopupService: ModuloPopupService
    ) {
        this.jhiLanguageService.setLocations(['sistema']);
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.organizacaoService.query().subscribe(
            (res: Response) => { this.organizacaos = res.json(); }, (res: Response) => this.onError(res.json()));
        this.moduloService.query().subscribe(
            (res: Response) => { this.modulos = res.json(); }, (res: Response) => this.onError(res.json()));
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }
    
    chamarModuloPopup () {
    	this.moduloService.sistemaSendoCadastrado = this.sistema;
    	this.activeModal.dismiss(this.sistema);
        this.moduloPopupService.open(ModuloDialogComponent);
    	
    }

    save () {
        this.isSaving = true;
        if (this.sistema.id !== undefined) {
            this.sistemaService.update(this.sistema)
                .subscribe((res: Sistema) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.sistemaService.create(this.sistema)
                .subscribe((res: Sistema) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: Sistema) {
        this.eventManager.broadcast({ name: 'sistemaListModification', content: 'OK'});
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

    trackOrganizacaoById(index: number, item: Organizacao) {
        return item.id;
    }

    trackModuloById(index: number, item: Modulo) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-sistema-popup',
    template: ''
})
export class SistemaPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private sistemaPopupService: SistemaPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.sistemaPopupService
                    .open(SistemaDialogComponent, params['id']);
            } else {
                this.modalRef = this.sistemaPopupService
                    .open(SistemaDialogComponent);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
