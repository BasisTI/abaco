import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Sistema } from './sistema.model';
import { SistemaService } from './sistema.service';
@Injectable()
export class SistemaPopupService {
    private isOpen = false;
    constructor (
        private modalService: NgbModal,
        private router: Router,
        private sistemaService: SistemaService

    ) {}

    open (component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.sistemaService.find(id).subscribe(sistema => {
                this.sistemaModalRef(component, sistema);
            });
        } else {
            return this.sistemaModalRef(component, new Sistema());
        }
    }
    
    openParaEditar (component: Component, sistema: Sistema): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        this.sistemaModalRef(component, sistema);
    }

    sistemaModalRef(component: Component, sistema: Sistema): NgbModalRef {
        let modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.sistema = sistema;
        modalRef.result.then(result => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        });
        return modalRef;
    }
}
