import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { DatatableComponent, DatatableClickEvent } from '@basis/angular-components';

import { environment } from '../../environments/environment';
import { Organizacao } from './organizacao.model';
import { OrganizacaoService } from './organizacao.service';
import { ElasticQuery } from '../shared';
import { PageNotificationService } from '../shared/page-notification.service';
import {NgxMaskModule} from 'ngx-mask';


@Component({
  selector: 'jhi-organizacao',
  templateUrl: './organizacao.component.html'
})
export class OrganizacaoComponent implements AfterViewInit {

  @ViewChild(DatatableComponent) datatable: DatatableComponent;

  searchUrl: string = this.organizacaoService.searchUrl;

  organizacaoSelecionada: Organizacao;

  paginationParams = { contentIndex: null };

  elasticQuery: ElasticQuery = new ElasticQuery();

  rowsPerPageOptions: number[] = [5, 10, 20];

  constructor(
    private router: Router,
    private organizacaoService: OrganizacaoService,
    private confirmationService: ConfirmationService,
    private pageNotificationService: PageNotificationService
  ) {}

  public ngOnInit(){
    this.datatable.pDatatableComponent.onRowSelect.subscribe((event) => {
      this.organizacaoSelecionada = event.data;
    });
  this.datatable.pDatatableComponent.onRowUnselect.subscribe((event) => {
    this.organizacaoSelecionada = undefined;
  });
  }

  ngAfterViewInit() {
    this.recarregarDataTable();
  }

  datatableClick(event: DatatableClickEvent) {
    console.log(event)
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
    }else if (event.target.parentNode.nodeName === 'TD') {
      this.abrirEditar();
    }
}

abrirEditar(){
  this.router.navigate(['/organizacao', this.organizacaoSelecionada.id, 'edit']);
}

  confirmDelete(id: any) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir o registro?',
      accept: () => {
        this.organizacaoService.delete(id).subscribe(() => {
          this.pageNotificationService.addDeleteMsg();
          this.recarregarDataTable();
        }, error => {
          if (error.status === 500) {
            this.pageNotificationService.addErrorMsg('A organização não pode ser deletada pois está associada a um contrato, equipe ou análise!');
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
    this.datatable.refresh(this.elasticQuery.query);
  }

}
