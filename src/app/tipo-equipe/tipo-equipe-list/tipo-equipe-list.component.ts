import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableClickEvent, DatatableComponent, PageNotificationService } from '@nuvem/primeng-components';
import { ConfirmationService } from 'primeng';
import { ElasticQuery } from 'src/app/shared/elastic-query';
import { AdminGuard } from 'src/app/util/admin.guard';
import { TipoEquipe } from '../tipo-equipe.model';
import { TipoEquipeService } from '../tipo-equipe.service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'jhi-tipo-equipe',
  templateUrl: './tipo-equipe-list.component.html',
  providers:[AdminGuard, ConfirmationService]
})
export class TipoEquipeListComponent {


  @ViewChild(DatatableComponent) datatable: DatatableComponent;

  searchUrl: string = this.tipoEquipeService.searchUrl;

  paginationParams = { contentIndex: null };

  equipeSelecionada: TipoEquipe;

  elasticQuery: ElasticQuery = new ElasticQuery();

  rowsPerPageOptions: number[] = [5, 10, 20];

  valueFiltroCampo: string;

  constructor(
    private router: Router,
    private tipoEquipeService: TipoEquipeService,
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
    if(this.datatable){
      this.datatable.pDatatableComponent.onRowSelect.subscribe((event) => {
        this.equipeSelecionada = event.data;
      });
      this.datatable.pDatatableComponent.onRowUnselect.subscribe((event) => {
        this.equipeSelecionada = undefined;
      });
    }
  }

  public datatableClick(event: DatatableClickEvent) {
    if (!event.selection) {
      return;
    }
    switch (event.button) {
      case 'edit':
        this.router.navigate(['/admin/tipoEquipe', event.selection.id, 'edit']);
        break;
      case 'delete':
        this.confirmDelete(event.selection.id);
        break;
      case 'view':
        this.router.navigate(['/admin/tipoEquipe', event.selection.id]);
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
    this.router.navigate(['/admin/tipoEquipe', this.equipeSelecionada.id, 'edit']);
  }

  public confirmDelete(id: any) {
    this.confirmationService.confirm({
      message: this.getLabel('Tem certeza que deseja excluir o registro?'),
      accept: () => {
        this.tipoEquipeService.delete(id).subscribe(() => {
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
  }

}
