import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import { Organizacao } from '../organizacao.model';
import { Contrato } from 'src/app/contrato';
import { OrganizacaoService } from '../organizacao.service';
import { UploadService } from 'src/app/upload/upload.service';
import { DatatableClickEvent } from '@nuvem/primeng-components';

@Component({
    selector: 'jhi-organizacao-detail',
    templateUrl: './organizacao-detail.component.html'
})
export class OrganizacaoDetailComponent implements OnInit, OnDestroy {

    organizacao: Organizacao;
    private subscription: Subscription;
    public logo: File;
    public mostrarDetalheDoContrato = false ;
    public contratoSelecionado: Contrato;

    constructor(
        private organizacaoService: OrganizacaoService,
        private route: ActivatedRoute,
        private uploadService: UploadService,
    ) {
    }
    getLabel(label) {
        let str: any;
        return str;
    }
    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.mostrarDetalheDoContrato = false;
    }
    load(id) {
        this.organizacaoService.find(id).subscribe(organizacao => {
            this.organizacao = organizacao;
            if (this.organizacao.logoId !== undefined && this.organizacao.logoId != null) {
                this.uploadService.getLogo(organizacao.logoId).subscribe(response => {
                    // this.logo = response.logo;
                });
            }
        });
    }
    showViewDialog(event: DatatableClickEvent) {
        if (this.mostrarDetalheDoContrato === false) {
            this.contratoSelecionado = event.selection;
            this.mostrarDetalheDoContrato = true;
        }else {
            this.mostrarDetalheDoContrato = false;
        }
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
