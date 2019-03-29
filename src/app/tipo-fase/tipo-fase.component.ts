import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { DatatableComponent, DatatableClickEvent } from '@basis/angular-components';

import { TipoFase } from './tipo-fase.model';
import { TipoFaseService } from './tipo-fase.service';
import { ElasticQuery } from '../shared';
import { PageNotificationService } from '../shared';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'jhi-tipo-fase',
    templateUrl: './tipo-fase.component.html'
})
export class TipoFaseComponent {

    @ViewChild(DatatableComponent) datatable: DatatableComponent;
    searchUrl: string = this.tipoFaseService.searchUrl;
    tipoFaseSelecionada: TipoFase;
    elasticQuery: ElasticQuery = new ElasticQuery();
    rowsPerPageOptions: number[] = [5, 10, 20];

    constructor(
        private router: Router,
        private tipoFaseService: TipoFaseService,
        private confirmationService: ConfirmationService,
        private pageNotificationService: PageNotificationService,
        private translate: TranslateService
    ) {
    }

    public ngOnInit() {
        this.datatable.pDatatableComponent.onRowSelect.subscribe((event) => {
            this.tipoFaseSelecionada = event.data;
        });
        this.datatable.pDatatableComponent.onRowUnselect.subscribe((event) => {
            this.tipoFaseSelecionada = undefined;
        });
    }

    getLabel(label) {
        let str: any;
        this.translate.get(label).subscribe((res: string) => {
            str = res;
        }).unsubscribe();
        return str;
    }

    datatableClick(event: DatatableClickEvent) {
        if (!event.selection) {
            return;
        }
        switch (event.button) {
            case 'edit':
                this.router.navigate(['/tipoFase', event.selection.id, 'edit']);
                break;
            case 'delete':
                this.confirmDelete(event.selection.id);
                break;
            case 'view':
                this.router.navigate(['/tipoFase', event.selection.id]);
                break;
        }
    }

    public onRowDblclick(event) {
        if (event.target.nodeName === 'TD') {
            this.abrirEditar();
        } else if (event.target.parentNode.nodeName === 'TD') {
            this.abrirEditar();
        }
    }

    abrirEditar() {
        this.router.navigate(['/tipoFase', this.tipoFaseSelecionada.id, 'edit']);
    }

    confirmDelete(id: any) {
        this.confirmationService.confirm({
            message: this.getLabel('Global.Mensagens.CertezaExcluirRegistro'),
            accept: () => {
                this.tipoFaseService.delete(id).subscribe(() => {
                    this.recarregarDataTable();
                    this.pageNotificationService.addDeleteMsg();
                });
            }
        });
    }

    limparPesquisa() {
        this.elasticQuery.reset();
        this.recarregarDataTable();
    }

    recarregarDataTable() {
        this.datatable.refresh(this.elasticQuery.query);
    }
}
