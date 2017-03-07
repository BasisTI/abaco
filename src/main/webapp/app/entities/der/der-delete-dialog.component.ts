import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import { Der } from './der.model';
import { DerPopupService } from './der-popup.service';
import { DerService } from './der.service';

@Component({
    selector: 'jhi-der-delete-dialog',
    templateUrl: './der-delete-dialog.component.html'
})
export class DerDeleteDialogComponent {

    der: Der;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private derService: DerService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['der']);
    }

    clear () {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete (id: number) {
        this.derService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'derListModification',
                content: 'Deleted an der'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-der-delete-popup',
    template: ''
})
export class DerDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private derPopupService: DerPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.derPopupService
                .open(DerDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
