import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import { Analise } from './analise.model';
import { AnalisePopupService } from './analise-popup.service';
import { AnaliseService } from './analise.service';

@Component({
    selector: 'jhi-analise-delete-dialog',
    templateUrl: './analise-delete-dialog.component.html'
})
export class AnaliseDeleteDialogComponent {

    analise: Analise;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private analiseService: AnaliseService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['analise', 'metodoContagem', 'tipoAnalise']);
    }

    clear () {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete (id: number) {
        this.analiseService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'analiseListModification',
                content: 'Deleted an analise'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-analise-delete-popup',
    template: ''
})
export class AnaliseDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private analisePopupService: AnalisePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.analisePopupService
                .open(AnaliseDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
