import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import { FuncaoTransacao } from './funcao-transacao.model';
import { FuncaoTransacaoPopupService } from './funcao-transacao-popup.service';
import { FuncaoTransacaoService } from './funcao-transacao.service';

@Component({
    selector: 'jhi-funcao-transacao-delete-dialog',
    templateUrl: './funcao-transacao-delete-dialog.component.html'
})
export class FuncaoTransacaoDeleteDialogComponent {

    funcaoTransacao: FuncaoTransacao;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private funcaoTransacaoService: FuncaoTransacaoService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['funcaoTransacao', 'tipoFuncaoTransacao', 'complexidade']);
    }

    clear () {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete (id: number) {
        this.funcaoTransacaoService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'funcaoTransacaoListModification',
                content: 'Deleted an funcaoTransacao'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-funcao-transacao-delete-popup',
    template: ''
})
export class FuncaoTransacaoDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private funcaoTransacaoPopupService: FuncaoTransacaoPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.funcaoTransacaoPopupService
                .open(FuncaoTransacaoDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
