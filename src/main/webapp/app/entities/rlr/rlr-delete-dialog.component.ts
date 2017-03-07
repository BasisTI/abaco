import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import { Rlr } from './rlr.model';
import { RlrPopupService } from './rlr-popup.service';
import { RlrService } from './rlr.service';

@Component({
    selector: 'jhi-rlr-delete-dialog',
    templateUrl: './rlr-delete-dialog.component.html'
})
export class RlrDeleteDialogComponent {

    rlr: Rlr;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private rlrService: RlrService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['rlr']);
    }

    clear () {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete (id: number) {
        this.rlrService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'rlrListModification',
                content: 'Deleted an rlr'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-rlr-delete-popup',
    template: ''
})
export class RlrDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private rlrPopupService: RlrPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.rlrPopupService
                .open(RlrDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
