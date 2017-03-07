import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Contrato } from './contrato.model';
import { ContratoService } from './contrato.service';
@Injectable()
export class ContratoPopupService {
    private isOpen = false;
    constructor (
        private modalService: NgbModal,
        private router: Router,
        private contratoService: ContratoService

    ) {}

    open (component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.contratoService.find(id).subscribe(contrato => {
                if (contrato.dataInicioVigencia) {
                    contrato.dataInicioVigencia = {
                        year: contrato.dataInicioVigencia.getFullYear(),
                        month: contrato.dataInicioVigencia.getMonth() + 1,
                        day: contrato.dataInicioVigencia.getDate()
                    };
                }
                if (contrato.dataFimVigencia) {
                    contrato.dataFimVigencia = {
                        year: contrato.dataFimVigencia.getFullYear(),
                        month: contrato.dataFimVigencia.getMonth() + 1,
                        day: contrato.dataFimVigencia.getDate()
                    };
                }
                this.contratoModalRef(component, contrato);
            });
        } else {
            return this.contratoModalRef(component, new Contrato());
        }
    }

    contratoModalRef(component: Component, contrato: Contrato): NgbModalRef {
        let modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.contrato = contrato;
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
