import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import { FuncaoDados } from './funcao-dados.model';
import { FuncaoDadosPopupService } from './funcao-dados-popup.service';
import { FuncaoDadosService } from './funcao-dados.service';

@Component({
    selector: 'jhi-funcao-dados-delete-dialog',
    templateUrl: './funcao-dados-delete-dialog.component.html'
})
export class FuncaoDadosDeleteDialogComponent {

    funcaoDados: FuncaoDados;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private funcaoDadosService: FuncaoDadosService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['funcaoDados', 'tipoFuncaoDados', 'complexidade']);
    }

    clear () {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete (id: number) {
        this.funcaoDadosService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'funcaoDadosListModification',
                content: 'Deleted an funcaoDados'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-funcao-dados-delete-popup',
    template: ''
})
export class FuncaoDadosDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private funcaoDadosPopupService: FuncaoDadosPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.funcaoDadosPopupService
                .open(FuncaoDadosDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
