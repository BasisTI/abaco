import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FuncaoDados } from './funcao-dados.model';
import { FuncaoDadosService } from './funcao-dados.service';
@Injectable()
export class FuncaoDadosPopupService {
    private isOpen = false;
    constructor (
        private modalService: NgbModal,
        private router: Router,
        private funcaoDadosService: FuncaoDadosService

    ) {}

    open (component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.funcaoDadosService.find(id).subscribe(funcaoDados => {
                this.funcaoDadosModalRef(component, funcaoDados);
            });
        } else {
            return this.funcaoDadosModalRef(component, new FuncaoDados());
        }
    }

    funcaoDadosModalRef(component: Component, funcaoDados: FuncaoDados): NgbModalRef {
        let modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.funcaoDados = funcaoDados;
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
