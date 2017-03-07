import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import { Manual } from './manual.model';
import { ManualPopupService } from './manual-popup.service';
import { ManualService } from './manual.service';

@Component({
    selector: 'jhi-manual-delete-dialog',
    templateUrl: './manual-delete-dialog.component.html'
})
export class ManualDeleteDialogComponent {

    manual: Manual;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private manualService: ManualService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['manual']);
    }

    clear () {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete (id: number) {
        this.manualService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'manualListModification',
                content: 'Deleted an manual'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-manual-delete-popup',
    template: ''
})
export class ManualDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private manualPopupService: ManualPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.manualPopupService
                .open(ManualDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
