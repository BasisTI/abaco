import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import { Alr } from './alr.model';
import { AlrPopupService } from './alr-popup.service';
import { AlrService } from './alr.service';

@Component({
    selector: 'jhi-alr-delete-dialog',
    templateUrl: './alr-delete-dialog.component.html'
})
export class AlrDeleteDialogComponent {

    alr: Alr;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private alrService: AlrService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['alr']);
    }

    clear () {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete (id: number) {
        this.alrService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'alrListModification',
                content: 'Deleted an alr'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-alr-delete-popup',
    template: ''
})
export class AlrDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private alrPopupService: AlrPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.alrPopupService
                .open(AlrDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
