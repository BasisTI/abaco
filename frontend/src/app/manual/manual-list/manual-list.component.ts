import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DatatableClickEvent, DatatableComponent, PageNotificationService } from '@nuvem/primeng-components';
import { ConfirmationService } from 'primeng';
import { Manual } from '../manual.model';
import { ManualService } from '../manual.service';
import { ElasticQuery } from 'src/app/shared/elastic-query';
import { FatorAjuste } from 'src/app/fator-ajuste';
import { EsforcoFase } from 'src/app/esforco-fase';
import { MessageUtil } from 'src/app/util/message.util';
import { SearchGroup } from '..';

@Component({
    selector: 'app-manual',
    templateUrl: './manual-list.component.html',
    providers: [ManualService, ConfirmationService]
})
export class ManualListComponent implements OnInit {

    @ViewChild(DatatableComponent) datatable: DatatableComponent;

    searchUrl: string = this.manualService.searchUrl;
    elasticQuery: ElasticQuery = new ElasticQuery();
    manualSelecionado: Manual = new Manual();
    nomeDoManualClonado: string;
    mostrarDialogClonar: boolean;
    rowsPerPageOptions: number[] = [5, 10, 20];
    myform: FormGroup;
    nomeValido = false;
    urlManualService = this.manualService.resourceUrl;
    idManual: Number;

    allColumnsTable = [
        {value: 'nome',  label: 'Nome'},
        {value: 'valorVariacaoEstimada',  label: 'Estimada'},
        {value: 'valorVariacaoIndicativa',  label: 'Indicativa'},
        {value: 'parametroInclusao',  label: 'Inclusão'},
        {value: 'parametroAlteracao',  label: 'Alteração'},
        {value: 'parametroExclusao',  label: 'Exclusão'},
        {value: 'parametroConversao',  label: 'Conversão'},
        {value: 'observacao',  label: 'Observação'},
    ];
    
    columnsVisible = [
        'nome',
        'valorVariacaoEstimada',
        'valorVariacaoIndicativa',
        'parametroInclusao',
        'parametroAlteracao',
        'parametroExclusao',
        'parametroConversao',
        'observacao'];
      private lastColumn: any[] = [];
      
      manualFiltro : SearchGroup = new SearchGroup();

    constructor(
        private router: Router,
        private manualService: ManualService,
        private confirmationService: ConfirmationService,
        private pageNotificationService: PageNotificationService,
    ) {
    }


    public ngOnInit() {
        this.mostrarDialogClonar = false;
        if (this.datatable) {
            this.datatable.pDatatableComponent.onRowSelect.subscribe((event) => {
                this.manualSelecionado = new Manual().copyFromJSON(event.data);
            });
            this.datatable.pDatatableComponent.onRowUnselect.subscribe((event) => {
                this.manualSelecionado = undefined;
            });
        }
    }

    getLabel(label) {
        return label;
    }

    public onRowDblclick(event) {
        if (event.target.nodeName === 'TD') {
            this.abrirEditar(this.manualSelecionado);
        } else if (event.target.parentNode.nodeName === 'TD') {
            this.abrirEditar(this.manualSelecionado);
        }
    }

    clonarTooltip() {
        if (!this.manualSelecionado.id) {
            return 'Selecione um registro para clonar';
        }
        return 'Clonar';
    }

    abrirEditar(manual: Manual) {
        this.router.navigate(['/manual', manual.id, 'edit']);
    }

    abrirVisualizar(manual: Manual) {
        this.router.navigate(['/manual', manual.id, 'view']);
    }

    public fecharDialogClonar() {
        this.mostrarDialogClonar = false;
        this.nomeDoManualClonado = '';
    }

    public clonar() {
        if (this.nomeDoManualClonado !== undefined) {
            this.nomeValido = false;
            const manual: Manual = Manual.convertManualJsonToObject(this.manualSelecionado);
            const manualClonado: Manual = manual.clone();
            manualClonado.nome = this.nomeDoManualClonado;

            if (manualClonado.esforcoFases) {
                manualClonado.esforcoFases.forEach(ef => ef.id = undefined);
            }
            if (manualClonado.fatoresAjuste) {
                manualClonado.fatoresAjuste.forEach(fa => fa.id = undefined);
            }

            this.manualService.clonar(manualClonado).subscribe((manualSalvo: Manual) => {
                this.pageNotificationService.addSuccessMessage(
                    'Manual' + manualSalvo.nome + ' clonado a partir do manual' + this.manualSelecionado.nome + ' com sucesso!'
                );
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

    public confirmDelete(manual: Manual) {
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja excluir o registro?',
            accept: () => {
                this.manualService.delete(manual.id).subscribe(() => {
                    this.recarregarDataTable();
                    this.pageNotificationService.addSuccessMessage('Registro excluído com sucesso!');
                }, error => {
                    if (error.status === 500) {
                    }
                }
                );
            }
        });
    }

    public recarregarDataTable() {
        this.datatable.refresh(this.elasticQuery.query);
        this.manualFiltro.nome = this.elasticQuery.query;
    }

    public search() {
        this.datatable.refresh(this.elasticQuery.query);
    }

    onClick(event: DatatableClickEvent) {
        switch (event.button) {
            case 'edit': {
                this.abrirEditar(event.selection);
                break;
            }
            case 'view': {
                this.abrirVisualizar(event.selection);
                break;
            }
            case 'delete': {
                this.confirmDelete(event.selection);
                break;
            }
            case 'clone': {
                this.manualSelecionado.id = event.selection.id;
                this.manualSelecionado = event.selection;
                this.mostrarDialogClonar = true;
                break;
            }
            case 'exportPDF': {
                this.exportarManualFatorAjuste();
                break;
            }
            default: {
                break;
            }
        }
    }
    public selectManual() {
        if (this.datatable && this.datatable.selectedRow) {
            if (this.datatable.selectedRow && this.datatable.selectedRow) {
                this.manualSelecionado = this.datatable.selectedRow;
            }
        }
    }

    public exportarManualFatorAjuste() {
        this.manualService.geraRelatorioPdfBrowserFatorAjuste(this.manualSelecionado.id);
    }

    relatorioCloneButton() {
        if (!(this.datatable && this.datatable.selectedRow)) {
            return this.getLabel('Selecione um registro para clonar');
        }
        return this.getLabel('Clonar');
    }

    relatorioFatorAjusteButton() {
        if (!(this.datatable && this.datatable.selectedRow)) {
            return this.getLabel('Selecione um registro para gerar o relatório');
        }
        return this.getLabel('Relatório Fator Ajuste');
    }

    mostrarColunas(event) {
        if (this.columnsVisible.length) {
            this.lastColumn = event.value;
            this.updateVisibleColumns(this.columnsVisible);
        } else {
            this.lastColumn.map((item) => this.columnsVisible.push(item));
            this.pageNotificationService.addErrorMessage('Não é possível exibir menos de uma coluna');
        }
    }
    
    updateVisibleColumns(columns) {
        this.allColumnsTable.forEach(col => {
            if (this.visibleColumnCheck(col.value, columns)) {
                this.datatable.visibleColumns[col.value] = 'table-cell';
            } else {
                this.datatable.visibleColumns[col.value] = 'none';
            }
        });
    }
    
    visibleColumnCheck(column: string, visibleColumns: any[]) {
        return visibleColumns.some((item: any) => {
            return (item) ? item === column : true;
        });
    }

}
