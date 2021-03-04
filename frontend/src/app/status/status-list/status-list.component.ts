import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent, PageNotificationService, DatatableClickEvent } from '@nuvem/primeng-components';
import { SearchGroup, Status } from '../status.model';
import { ElasticQuery } from 'src/app/shared/elastic-query';
import { Router } from '@angular/router';
import { StatusService } from '../status.service';
import { ConfirmationService } from 'primeng';
import { AuthService } from 'src/app/util/auth.service';

@Component({
  selector: 'app-status-list',
  templateUrl: './status-list.component.html',
  styleUrls: ['./status-list.component.css']
})
export class StatusListComponent implements OnInit {

  @ViewChild(DatatableComponent) datatable: DatatableComponent;

  searchUrl: string = this.statusService.searchUrl;

  paginationParams = { contentIndex: null };

  statusSelecionada: Status;

  elasticQuery: ElasticQuery = new ElasticQuery();

  rowsPerPageOptions: number[] = [5, 10, 20];

  valueFiltroCampo;

  statusFiltro : SearchGroup;

  constructor(
    private router: Router,
    private statusService: StatusService,
    private confirmationService: ConfirmationService,
    private pageNotificationService: PageNotificationService,
    private authService: AuthService
  ) { }

  getLabel(label) {
    return label;
  }

  valueFiltro() {
    this.datatable.refresh(this.elasticQuery.query);
  }

  public ngOnInit() {
    if (this.datatable) {
      this.datatable.pDatatableComponent.onRowSelect.subscribe((event) => {
        this.statusSelecionada = event.data;
      });
      this.datatable.pDatatableComponent.onRowUnselect.subscribe((event) => {
        this.statusSelecionada = undefined;
      });
    }
    this.statusFiltro = new SearchGroup();
  }

  public datatableClick(event: DatatableClickEvent) {
    if (!event.selection) {
      return;
    }
    switch (event.button) {
      case 'edit':
        if (this.authService.possuiRole(AuthService.PREFIX_ROLE + "STATUS_EDITAR") == false) {
            break;
        }
        this.router.navigate(['/status', event.selection.id, 'edit']);
        break;
      case 'delete':
        this.confirmDelete(event.selection.id);
        break;
      case 'view':
        if (this.authService.possuiRole(AuthService.PREFIX_ROLE + "STATUS_CONSULTAR") == false) {
            break;
        }
        this.router.navigate(['/status', event.selection.id, 'view']);
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
    if (this.authService.possuiRole(AuthService.PREFIX_ROLE + "STATUS_EDITAR") == false) {
        return false;
    }
    this.router.navigate(['/status', this.statusSelecionada.id, 'edit']);
  }

  public confirmDelete(id: any) {
    if (this.authService.possuiRole(AuthService.PREFIX_ROLE + "STATUS_EXCLUIR") == false) {
        return false;
    }
    this.confirmationService.confirm({
      message: this.getLabel('Tem certeza que deseja excluir o registro?'),
      accept: () => {
        this.statusService.delete(id).subscribe(() => {
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
    if (this.authService.possuiRole(AuthService.PREFIX_ROLE + "STATUS_PESQUISAR") == false) {
        return false;
    }
    this.datatable.refresh(this.elasticQuery.query);
    this.statusFiltro.nome = this.elasticQuery.query;
  }

  public selectStatus() {
    if (this.datatable && this.datatable.selectedRow) {
        if (this.datatable.selectedRow && this.datatable.selectedRow) {
            this.statusSelecionada = this.datatable.selectedRow;
          }
      }
  }

  criarStatus(){
    if (this.authService.possuiRole(AuthService.PREFIX_ROLE + "STATUS_CADASTRAR") == false) {
        return false;
    }
    this.router.navigate(["/status/new"]);
  }

}
