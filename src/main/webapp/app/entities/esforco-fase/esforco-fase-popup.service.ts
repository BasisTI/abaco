import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EsforcoFase } from './esforco-fase.model';
import { EsforcoFaseService } from './esforco-fase.service';
@Injectable()
export class EsforcoFasePopupService {
    private isOpen = false;
    constructor (
        private modalService: NgbModal,
        private router: Router,
        private esforcoFaseService: EsforcoFaseService

    ) {}

    open (component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.esforcoFaseService.find(id).subscribe(esforcoFase => {
                this.esforcoFaseModalRef(component, esforcoFase);
            });
        } else {
            return this.esforcoFaseModalRef(component, new EsforcoFase());
        }
    }

    esforcoFaseModalRef(component: Component, esforcoFase: EsforcoFase): NgbModalRef {
        let modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.esforcoFase = esforcoFase;
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
