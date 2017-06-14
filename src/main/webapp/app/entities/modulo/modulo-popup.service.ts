import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Modulo } from './modulo.model';
import { ModuloService } from './modulo.service';
@Injectable()
export class ModuloPopupService {
    private isOpen = false;
    constructor (
        private modalService: NgbModal,
        private router: Router,
        private moduloService: ModuloService

    ) {}

    open (component: Component, id?: number | any, system_id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.moduloService.find(id).subscribe(modulo => {
                this.moduloModalRef(component, modulo);
            });
        } else {
            if (system_id) {
               let module:Modulo = new Modulo();
               module.system_id=system_id;
               return this.moduloModalRef(component, module);

            } else {
                return this.moduloModalRef(component, new Modulo());
            }
        }
    }

    moduloModalRef(component: Component, modulo: Modulo): NgbModalRef {
        let modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.modulo = modulo;
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
