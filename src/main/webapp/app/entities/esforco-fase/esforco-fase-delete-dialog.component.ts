import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import { EsforcoFase } from './esforco-fase.model';
import { EsforcoFasePopupService } from './esforco-fase-popup.service';
import { EsforcoFaseService } from './esforco-fase.service';

@Component({
    selector: 'jhi-esforco-fase-delete-dialog',
    templateUrl: './esforco-fase-delete-dialog.component.html'
})
export class EsforcoFaseDeleteDialogComponent {

    esforcoFase: EsforcoFase;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private esforcoFaseService: EsforcoFaseService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['esforcoFase']);
    }

    clear () {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete (id: number) {
        this.esforcoFaseService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'esforcoFaseListModification',
                content: 'Deleted an esforcoFase'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-esforco-fase-delete-popup',
    template: ''
})
export class EsforcoFaseDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private esforcoFasePopupService: EsforcoFasePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.esforcoFasePopupService
                .open(EsforcoFaseDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
