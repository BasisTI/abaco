import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FuncaoTransacao } from './funcao-transacao.model';
import { FuncaoTransacaoService } from './funcao-transacao.service';
@Injectable()
export class FuncaoTransacaoPopupService {
    private isOpen = false;
    constructor (
        private modalService: NgbModal,
        private router: Router,
        private funcaoTransacaoService: FuncaoTransacaoService

    ) {}

    open (component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.funcaoTransacaoService.find(id).subscribe(funcaoTransacao => {
                this.funcaoTransacaoModalRef(component, funcaoTransacao);
            });
        } else {
            return this.funcaoTransacaoModalRef(component, new FuncaoTransacao());
        }
    }

    funcaoTransacaoModalRef(component: Component, funcaoTransacao: FuncaoTransacao): NgbModalRef {
        let modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.funcaoTransacao = funcaoTransacao;
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
