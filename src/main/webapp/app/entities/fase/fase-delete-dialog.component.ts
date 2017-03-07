import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import { Fase } from './fase.model';
import { FasePopupService } from './fase-popup.service';
import { FaseService } from './fase.service';

@Component({
    selector: 'jhi-fase-delete-dialog',
    templateUrl: './fase-delete-dialog.component.html'
})
export class FaseDeleteDialogComponent {

    fase: Fase;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private faseService: FaseService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['fase']);
    }

    clear () {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete (id: number) {
        this.faseService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'faseListModification',
                content: 'Deleted an fase'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-fase-delete-popup',
    template: ''
})
export class FaseDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private fasePopupService: FasePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.fasePopupService
                .open(FaseDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
