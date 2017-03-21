import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { Organizacao } from './organizacao.model';
import { OrganizacaoPopupService } from './organizacao-popup.service';
import { OrganizacaoService } from './organizacao.service';
import { Contrato, ContratoService } from '../contrato';
import { Sistema, SistemaService } from '../sistema';

@Component({
    selector: 'jhi-organizacao-dialog',
    templateUrl: './organizacao-dialog.component.html'
})
export class OrganizacaoDialogComponent implements OnInit {

    public cnpjMask = [/\d/, /\d/, '.',/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/',/\d/, /\d/, /\d/,/\d/, '-', /\d/,/\d/];

    organizacao: Organizacao;
    authorities: any[];
    isSaving: boolean;

    contratoes: Contrato[];

    sistemas: Sistema[];
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private organizacaoService: OrganizacaoService,
        private contratoService: ContratoService,
        private sistemaService: SistemaService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['organizacao']);
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.contratoService.query().subscribe(
            (res: Response) => { this.contratoes = res.json(); }, (res: Response) => this.onError(res.json()));
        this.sistemaService.query().subscribe(
            (res: Response) => { this.sistemas = res.json(); }, (res: Response) => this.onError(res.json()));
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.organizacao.id !== undefined) {
            this.organizacaoService.update(this.organizacao)
                .subscribe((res: Organizacao) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.organizacaoService.create(this.organizacao)
                .subscribe((res: Organizacao) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: Organizacao) {
        this.eventManager.broadcast({ name: 'organizacaoListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
        this.organizacaoService.idOrganizacaoParaInvocarModal = result.id;
    }

    private onSaveError (error) {
        this.isSaving = false;
        this.onError(error);
    }

    private onError (error) {
        this.alertService.error(error.message, null, null);
    }

    trackContratoById(index: number, item: Contrato) {
        return item.id;
    }

    trackSistemaById(index: number, item: Sistema) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-organizacao-popup',
    template: ''
})
export class OrganizacaoPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private organizacaoPopupService: OrganizacaoPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.organizacaoPopupService
                    .open(OrganizacaoDialogComponent, params['id']);
            } else {
                this.modalRef = this.organizacaoPopupService
                    .open(OrganizacaoDialogComponent);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
