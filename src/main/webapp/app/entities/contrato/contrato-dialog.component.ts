import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { Contrato } from './contrato.model';
import { ContratoPopupService } from './contrato-popup.service';
import { ContratoService } from './contrato.service';
import { Manual, ManualService } from '../manual';
import { Organizacao, OrganizacaoService } from '../organizacao';
@Component({
    selector: 'jhi-contrato-dialog',
    templateUrl: './contrato-dialog.component.html'
})
export class ContratoDialogComponent implements OnInit {

    contrato: Contrato;
    authorities: any[];
    isSaving: boolean;

    manuals: Manual[];
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private contratoService: ContratoService,
        private manualService: ManualService,
        private organizacaoService: OrganizacaoService,
        private eventManager: EventManager,
        private route: ActivatedRoute,
        private contratoPopupService: ContratoPopupService
    ) {
        //this.jhiLanguageService.setLocations(['contrato']);
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.manualService.query().subscribe(
            (res: Response) => { this.manuals = res.json(); }, (res: Response) => this.onError(res.json()));
    }
    clear () {
        this.activeModal.dismiss('cancel');
        this.eventManager.broadcast({ name: 'organizacaoChangeInContrato', content: 'OK'});
    }

    save () {
        this.isSaving = true;
        if (this.contrato.id !== undefined) {
            this.contratoService.update(this.contrato)
                .subscribe((res: Contrato) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.contratoService.create(this.contrato)
                .subscribe((res: Contrato) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: Contrato) {
        this.eventManager.broadcast({ name: 'contratoListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
        this.invocarModalEdicaoDeOrganizacao(result);
    }

    private invocarModalEdicaoDeOrganizacao(contrato: Contrato) {
      this.organizacaoService.contrato = contrato;
      this.eventManager.broadcast({ name: 'organizacaoChangeInContrato', content: 'OK'});
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
    selector: 'jhi-contrato-popup',
    template: ''
})
export class ContratoPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private contratoPopupService: ContratoPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.contratoPopupService
                    .open(ContratoDialogComponent, params['id']);
            } else {
                this.modalRef = this.contratoPopupService
                    .open(ContratoDialogComponent);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
