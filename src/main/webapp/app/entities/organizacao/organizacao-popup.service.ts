import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Organizacao } from './organizacao.model';
import { OrganizacaoService } from './organizacao.service';
@Injectable()
export class OrganizacaoPopupService {
    private isOpen = false;
    constructor (
        private modalService: NgbModal,
        private router: Router,
        private organizacaoService: OrganizacaoService

    ) {}

    open (component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.organizacaoService.find(id).subscribe(organizacao => {
                this.organizacaoModalRef(component, organizacao);
            });
        } else {
            return this.organizacaoModalRef(component, new Organizacao());
        }
    }

    organizacaoModalRef(component: Component, organizacao: Organizacao): NgbModalRef {
        let modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.organizacao = organizacao;
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
