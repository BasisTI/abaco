import { TranslateService } from '@ngx-translate/core';
import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { DatatableComponent, DatatableClickEvent } from '@basis/angular-components';
import { Manual } from './manual.model';
import { ManualService } from './manual.service';
import { ElasticQuery, PageNotificationService } from '../shared';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MessageUtil } from '../util/message.util';
import { Response, Headers } from '@angular/http';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'jhi-manual',
    templateUrl: './manual.component.html'
})
export class ManualComponent implements OnInit {

    @BlockUI() blockUI: NgBlockUI;
    @ViewChild(DatatableComponent) datatable: DatatableComponent;

    searchUrl: string = this.manualService.searchUrl;
    elasticQuery: ElasticQuery = new ElasticQuery();
    manualSelecionado: Manual = new Manual();
    nomeDoManualClonado: string;
    mostrarDialogClonar: boolean;
    rowsPerPageOptions: number[] = [5, 10, 20];
    myform: FormGroup;
    nomeValido: boolean = false;

    constructor(
        private router: Router,
        private manualService: ManualService,
        private confirmationService: ConfirmationService,
        private pageNotificationService: PageNotificationService,
        private translate: TranslateService
    ) {
    }

    getLabel(label) {
        let str: any;
        this.translate.get(label).subscribe((res: string) => {
          str = res;
        }).unsubscribe();
        return str;
      }

    public ngOnInit() {
        this.mostrarDialogClonar = false;
        this.datatable.pDatatableComponent.onRowSelect.subscribe((event) => {
            this.manualSelecionado = new Manual().copyFromJSON(event.data);
        });
        this.datatable.pDatatableComponent.onRowUnselect.subscribe((event) => {
            this.manualSelecionado = undefined;
        });
    }

    public datatableClick(event: DatatableClickEvent) {
        if (!event.selection) {
            return;
        }
        switch (event.button) {
            case 'edit':
                this.router.navigate(['/manual', event.selection.id, 'edit']);
                break;
            case 'delete':
                this.confirmDelete(event.selection.id);
                break;
            case 'view':
                this.router.navigate(['/manual', event.selection.id]);
                break;
            case 'clone':
                this.manualSelecionado.id = event.selection.id;
                this.mostrarDialogClonar = true;
        }
    }

    public onRowDblclick(event) {
        if (event.target.nodeName === 'TD') {
            this.abrirEditar();
        } else if (event.target.parentNode.nodeName === 'TD') {
            this.abrirEditar();
        }
    }

    clonarTooltip() {
        if (!this.manualSelecionado.id) {
            return `${this.getLabel('Cadastros.Manual.Mensagens.msgRegistroClonar')}`;
        }
        return this.getLabel('Global.Botoes.Clonar');
    }

    abrirEditar() {
        this.router.navigate(['/manual', this.manualSelecionado.id, 'edit']);
    }

    public fecharDialogClonar() {
        this.mostrarDialogClonar = false;
        this.nomeDoManualClonado = '';
    }

    public clonar() {
        if (this.nomeDoManualClonado !== undefined) {
            this.nomeValido = false;
            const manualClonado: Manual = this.manualSelecionado.clone();
            manualClonado.id = undefined;
            manualClonado.nome = this.nomeDoManualClonado;
            if (manualClonado.esforcoFases) {
                manualClonado.esforcoFases.forEach(ef => ef.id = undefined);
            }
            if (manualClonado.fatoresAjuste) {
                manualClonado.fatoresAjuste.forEach(fa => fa.id = undefined);
            }

            this.manualService.create(manualClonado).subscribe((manualSalvo: Manual) => {
                this.pageNotificationService
                .addSuccessMsg(`${this.getLabel('Cadastros.Manual.Mensagens.msgManual')} ${manualSalvo.nome} ${this.getLabel('Cadastros.Manual.Mensagens.msgClonadoPartirDoManual')} ${this.manualSelecionado.nome} ${this.getLabel('Cadastros.Manual.Mensagens.msgComSucesso')}`);
                this.fecharDialogClonar();
                this.recarregarDataTable();
            });
        } else {
            this.nomeValido = true;
        }
    }

    public limparPesquisa() {
        this.elasticQuery.reset();
        this.recarregarDataTable();
    }

    public confirmDelete(id: any) {
        this.confirmationService.confirm({
            message: this.getLabel('Global.Mensagens.CertezaExcluirRegistro'),
            accept: () => {                
                this.blockUI.start(this.getLabel('Global.Mensagens.EXCLUINDO_REGISTRO'));
                this.manualService.delete(id).subscribe(() => {
                    this.recarregarDataTable();
                    this.blockUI.stop();
                    this.pageNotificationService
                    .addSuccessMsg(this.getLabel('Global.Mensagens.RegistroExcluidoComSucesso'));
                }, error=> {
                    if (error.status === 500){
                       this.blockUI.stop();
                    }
                }
                );
            }
        });
    }

    public recarregarDataTable() {
        this.datatable.refresh(this.elasticQuery.query);
    }
}
