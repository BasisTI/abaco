import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent, PageNotificationService, DatatableClickEvent } from '@nuvem/primeng-components';
import { ElasticQuery } from 'src/app/shared/elastic-query';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng';
import { NomenclaturaService } from '../nomenclatura.service';
import { Nomenclatura, SearchGroup } from '../nomenclatura.model';

@Component({
  selector: 'app-nomenclatura-list',
  templateUrl: './nomenclatura-list.component.html'
})
export class NomenclaturaListComponent implements OnInit {


  @ViewChild(DatatableComponent) datatable: DatatableComponent;

  searchUrl: string = this.nomenclaturaService.searchUrl;

  paginationParams = { contentIndex: null };

  elasticQuery: ElasticQuery = new ElasticQuery();

  rowsPerPageOptions: number[] = [5, 10, 20];

  valueFiltroCampo: string;

  nomenclaturaSelecionada: Nomenclatura;

  nomenclaturaFiltro:SearchGroup;

  constructor(
    private router: Router,
    private nomenclaturaService: NomenclaturaService,
    private confirmationService: ConfirmationService,
    private pageNotificationService: PageNotificationService,
  ) { }

  getLabel(label) {
    return label;
  }

  valueFiltro(valuefiltro: string) {
    this.valueFiltroCampo = valuefiltro;
    this.datatable.refresh(valuefiltro);
  }

  public ngOnInit() {
    if (this.datatable) {
      this.datatable.pDatatableComponent.onRowSelect.subscribe((event) => {
        this.nomenclaturaSelecionada = event.data;
      });
      this.datatable.pDatatableComponent.onRowUnselect.subscribe((event) => {
        this.nomenclaturaSelecionada = undefined;
      });
    }
    this.nomenclaturaFiltro = new SearchGroup();
  }

  public datatableClick(event: DatatableClickEvent) {
    if (!event.selection) {
      return;
    }
    switch (event.button) {
      case 'edit':
        this.router.navigate(['/nomenclatura', event.selection.id, 'edit']);
        break;
      case 'delete':
        this.confirmDelete(event.selection.id);
        break;
      case 'view':
        this.router.navigate(['/nomenclatura', event.selection.id, 'view']);
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
    this.router.navigate(['/nomenclatura', this.nomenclaturaSelecionada.id, 'edit']);
  }

  public confirmDelete(id: any) {
    this.confirmationService.confirm({
      message: this.getLabel('Tem certeza que deseja excluir o registro?'),
      accept: () => {
        this.nomenclaturaService.delete(id).subscribe(() => {
          this.recarregarDataTable();
          this.pageNotificationService.addDeleteMsg();
        }, error => {
          if (error.status === 403) {
            this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
          }
          if (error.status === 500) {
            this.pageNotificationService.addErrorMessage(this.getLabel('Falha ao excluir registro, verifique se a equipe não está vinculada a algum usuário!'));
          }
        });
      }
    });
  }

  public limparPesquisa() {
    this.elasticQuery.reset();
    this.recarregarDataTable();
  }

  public recarregarDataTable() {
    this.datatable.refresh(this.elasticQuery.query);
    this.nomenclaturaFiltro.nome = this.elasticQuery.query;
  }

  public selectNomenclatura() {
    if (this.datatable && this.datatable.selectedRow) {
        if (this.datatable.selectedRow && this.datatable.selectedRow) {
            this.nomenclaturaSelecionada = this.datatable.selectedRow;
          }
      }
  }
}
