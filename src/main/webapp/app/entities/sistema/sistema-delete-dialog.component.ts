import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import { Sistema } from './sistema.model';
import { SistemaPopupService } from './sistema-popup.service';
import { SistemaService } from './sistema.service';

@Component({
    selector: 'jhi-sistema-delete-dialog',
    templateUrl: './sistema-delete-dialog.component.html'
})
export class SistemaDeleteDialogComponent {

    sistema: Sistema;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private sistemaService: SistemaService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['sistema']);
    }

    clear () {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete (id: number) {
        this.sistemaService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'sistemaListModification',
                content: 'Deleted an sistema'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-sistema-delete-popup',
    template: ''
})
export class SistemaDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private sistemaPopupService: SistemaPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.sistemaPopupService
                .open(SistemaDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
