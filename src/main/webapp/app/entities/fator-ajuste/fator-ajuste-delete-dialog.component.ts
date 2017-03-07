import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import { FatorAjuste } from './fator-ajuste.model';
import { FatorAjustePopupService } from './fator-ajuste-popup.service';
import { FatorAjusteService } from './fator-ajuste.service';

@Component({
    selector: 'jhi-fator-ajuste-delete-dialog',
    templateUrl: './fator-ajuste-delete-dialog.component.html'
})
export class FatorAjusteDeleteDialogComponent {

    fatorAjuste: FatorAjuste;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private fatorAjusteService: FatorAjusteService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['fatorAjuste', 'tipoFatorAjuste', 'impactoFatorAjuste']);
    }

    clear () {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete (id: number) {
        this.fatorAjusteService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'fatorAjusteListModification',
                content: 'Deleted an fatorAjuste'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-fator-ajuste-delete-popup',
    template: ''
})
export class FatorAjusteDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private fatorAjustePopupService: FatorAjustePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.fatorAjustePopupService
                .open(FatorAjusteDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
