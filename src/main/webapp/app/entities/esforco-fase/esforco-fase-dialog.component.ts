import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { EsforcoFase } from './esforco-fase.model';
import { EsforcoFasePopupService } from './esforco-fase-popup.service';
import { EsforcoFaseService } from './esforco-fase.service';
import { Manual, ManualService } from '../manual';
import { Fase, FaseService } from '../fase';
@Component({
    selector: 'jhi-esforco-fase-dialog',
    templateUrl: './esforco-fase-dialog.component.html'
})
export class EsforcoFaseDialogComponent implements OnInit {

    esforcoFase: EsforcoFase;
    authorities: any[];
    isSaving: boolean;

    manuals: Manual[];

    fases: Fase[];
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private esforcoFaseService: EsforcoFaseService,
        private manualService: ManualService,
        private faseService: FaseService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['esforcoFase']);
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.manualService.query().subscribe(
            (res: Response) => { this.manuals = res.json(); }, (res: Response) => this.onError(res.json()));
        this.faseService.query().subscribe(
            (res: Response) => { this.fases = res.json(); }, (res: Response) => this.onError(res.json()));
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.esforcoFase.id !== undefined) {
            this.esforcoFaseService.update(this.esforcoFase)
                .subscribe((res: EsforcoFase) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.esforcoFaseService.create(this.esforcoFase)
                .subscribe((res: EsforcoFase) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: EsforcoFase) {
        this.eventManager.broadcast({ name: 'esforcoFaseListModification', content: 'OK'});
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

    trackManualById(index: number, item: Manual) {
        return item.id;
    }

    trackFaseById(index: number, item: Fase) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-esforco-fase-popup',
    template: ''
})
export class EsforcoFasePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private esforcoFasePopupService: EsforcoFasePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.esforcoFasePopupService
                    .open(EsforcoFaseDialogComponent, params['id']);
            } else {
                this.modalRef = this.esforcoFasePopupService
                    .open(EsforcoFaseDialogComponent);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
