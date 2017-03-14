import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import { Modulo } from './modulo.model';
import { ModuloPopupService } from './modulo-popup.service';
import { ModuloService } from './modulo.service';

@Component({
    selector: 'jhi-modulo-delete-dialog',
    templateUrl: './modulo-delete-dialog.component.html'
})
export class ModuloDeleteDialogComponent {

    modulo: Modulo;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private moduloService: ModuloService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        //this.jhiLanguageService.setLocations(['modulo']);
    }

    clear () {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete (id: number) {

        this.moduloService.sistemaSendoCadastrado.modulos.splice(
            this.moduloService.sistemaSendoCadastrado.modulos.indexOf(this.modulo),
            1);
        this.activeModal.dismiss(true);

        this.eventManager.broadcast({
            name: 'changeInModulosDeSistema',
            content: 'OK'});

        // this.moduloService.delete(id).subscribe(response => {
        //     // this.eventManager.broadcast({
        //     //     name: 'moduloListModification',
        //     //     content: 'Deleted an modulo'
        //     // });
        //     this.eventManager.broadcast({
        //         name: 'changeDeleteInModulosDeSistema',
        //         content: 'OK'});
        //     this.activeModal.dismiss(true);
        // });
    }
}

@Component({
    selector: 'jhi-modulo-delete-popup',
    template: ''
})
export class ModuloDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private moduloPopupService: ModuloPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.moduloPopupService
                .open(ModuloDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
