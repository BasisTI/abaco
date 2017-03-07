import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import { Organizacao } from './organizacao.model';
import { OrganizacaoPopupService } from './organizacao-popup.service';
import { OrganizacaoService } from './organizacao.service';

@Component({
    selector: 'jhi-organizacao-delete-dialog',
    templateUrl: './organizacao-delete-dialog.component.html'
})
export class OrganizacaoDeleteDialogComponent {

    organizacao: Organizacao;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private organizacaoService: OrganizacaoService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['organizacao']);
    }

    clear () {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete (id: number) {
        this.organizacaoService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'organizacaoListModification',
                content: 'Deleted an organizacao'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-organizacao-delete-popup',
    template: ''
})
export class OrganizacaoDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private organizacaoPopupService: OrganizacaoPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.organizacaoPopupService
                .open(OrganizacaoDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
