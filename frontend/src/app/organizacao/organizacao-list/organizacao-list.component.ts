import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng';

import { DomSanitizer } from '@angular/platform-browser';
import { DatatableComponent, PageNotificationService, DatatableClickEvent } from '@nuvem/primeng-components';
import { Organizacao, SearchGroup } from '../organizacao.model';
import { ElasticQuery } from 'src/app/shared/elastic-query';
import { OrganizacaoService } from '../organizacao.service';


@Component({
  selector: 'jhi-organizacao',
  templateUrl: './organizacao-list.component.html',
  providers:[ConfirmationService, OrganizacaoService]
})
export class OrganizacaoListComponent implements OnInit {

  @ViewChild(DatatableComponent) datatable: DatatableComponent;

  searchUrl: string = this.organizacaoService.searchUrl;

  organizacaoSelecionada: Organizacao;

  paginationParams = { contentIndex: null };

  elasticQuery: ElasticQuery = new ElasticQuery();

  rowsPerPageOptions: number[] = [5, 10, 20];

  organizacaoFiltro : SearchGroup;

  allColumnsTable = [
    {value: 'sigla',  label: 'Sigla'},
    {value: 'nome',  label: 'Nome'},
    {value: 'cnpj',  label: 'CNPJ'},
    {value: 'numeroOcorrencia',  label: 'Número da Ocorrência'},
    {value: 'ativo',  label: 'Ativo'},
];

columnsVisible = [
        'sigla',
        'nome',
        'cnpj',
        'numeroOcorrencia',
        'ativo'];
  private lastColumn: any[] = [];

  constructor(
    public _DomSanitizer: DomSanitizer,
    private router: Router,
    private organizacaoService: OrganizacaoService,
    private confirmationService: ConfirmationService,
    private pageNotificationService: PageNotificationService,
  ) { }

  getLabel(label) {
    return label;
  }

  public ngOnInit() {
    if(this.datatable){
      this.datatable.pDatatableComponent.onRowSelect.subscribe((event) => {
        this.organizacaoSelecionada = event.data;
      });
      this.datatable.pDatatableComponent.onRowUnselect.subscribe((event) => {
        this.organizacaoSelecionada = undefined;
      });
    }
    this.organizacaoFiltro = new SearchGroup();
  }

  onClick(event: DatatableClickEvent) {
    if (!event.selection) {

      return;
    }
    switch (event.button) {
      case 'edit':
        this.router.navigate(['/organizacao', event.selection.id, 'edit']);
        break;
      case 'delete':
        this.confirmDelete(event.selection.id);
        break;
      case 'view':
        this.router.navigate(['/organizacao', event.selection.id]);
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
    this.router.navigate(['/organizacao', this.organizacaoSelecionada.id, 'edit']);
  }

  confirmDelete(id: any) {
    this.confirmationService.confirm({
      message: this.getLabel('Tem certeza que deseja excluir o registro?'),
      accept: () => {
        this.organizacaoService.delete(id).subscribe(() => {
          this.pageNotificationService.addDeleteMsg();
          this.recarregarDataTable();
        }, error => {
          if (error.status === 500) {
            this.pageNotificationService
              .addErrorMessage(this.getLabel('Cadastros.Organizacao.Mensagens.msgOrganizacaoNaoPodeSerDeletadaPoisEstaAssociadaAContratoEquipeOuAnalise'));
          }
        });
      }
    });
  }

  limparPesquisa() {
    this.elasticQuery.reset();
    this.recarregarDataTable();
  }

  recarregarDataTable() {
    //Se descrição == CNPJ remove caracteres . - / para fazer pesquisa.
    if (this.elasticQuery.value.length == 18 && this.elasticQuery.value[2] == ".") {
      this.elasticQuery.value = this.elasticQuery.value.replace(".", "");
      this.elasticQuery.value = this.elasticQuery.value.replace(".", "");
      this.elasticQuery.value = this.elasticQuery.value.replace("/", "");
      this.elasticQuery.value = this.elasticQuery.value.replace("-", "");
    }
    this.datatable.refresh(this.elasticQuery.query);
    this.organizacaoFiltro.nome = this.elasticQuery.value;
  }
  public selectOrganizacao() {
    if (this.datatable && this.datatable.selectedRow) {
        if (this.datatable.selectedRow && this.datatable.selectedRow) {
            this.organizacaoSelecionada = this.datatable.selectedRow;
          }
      }
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
