import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import { Funcionalidade } from './funcionalidade.model';
import { FuncionalidadePopupService } from './funcionalidade-popup.service';
import { FuncionalidadeService } from './funcionalidade.service';

@Component({
    selector: 'jhi-funcionalidade-delete-dialog',
    templateUrl: './funcionalidade-delete-dialog.component.html'
})
export class FuncionalidadeDeleteDialogComponent {

    funcionalidade: Funcionalidade;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private funcionalidadeService: FuncionalidadeService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['funcionalidade']);
    }

    clear () {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete (id: number) {
        this.funcionalidadeService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'funcionalidadeListModification',
                content: 'Deleted an funcionalidade'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-funcionalidade-delete-popup',
    template: ''
})
export class FuncionalidadeDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private funcionalidadePopupService: FuncionalidadePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.funcionalidadePopupService
                .open(FuncionalidadeDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
