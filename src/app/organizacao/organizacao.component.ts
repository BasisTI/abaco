import { TranslateService } from '@ngx-translate/core';
import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { DatatableComponent, DatatableClickEvent } from '@basis/angular-components';

import { environment } from '../../environments/environment';
import { Organizacao } from './organizacao.model';
import { OrganizacaoService } from './organizacao.service';
import { ElasticQuery } from '../shared';
import { PageNotificationService } from '../shared/page-notification.service';
import { NgxMaskModule } from 'ngx-mask';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'jhi-organizacao',
  templateUrl: './organizacao.component.html'
})
export class OrganizacaoComponent implements OnInit {

  @ViewChild(DatatableComponent) datatable: DatatableComponent;

  searchUrl: string = this.organizacaoService.searchUrl;

  organizacaoSelecionada: Organizacao;

  paginationParams = { contentIndex: null };

  elasticQuery: ElasticQuery = new ElasticQuery();

  rowsPerPageOptions: number[] = [5, 10, 20];

  constructor(
    public _DomSanitizer: DomSanitizer,
    private router: Router,
    private organizacaoService: OrganizacaoService,
    private confirmationService: ConfirmationService,
    private pageNotificationService: PageNotificationService,
    private translate: TranslateService
  ) { }

  getLabel(label) {
    let str: any;
    this.translate.get(label).subscribe((res: string) => {
      str = res;
    }).unsubscribe();
    return str;
  }

  public ngOnInit() {
    this.datatable.pDatatableComponent.onRowSelect.subscribe((event) => {
      this.organizacaoSelecionada = event.data;
    });
    this.datatable.pDatatableComponent.onRowUnselect.subscribe((event) => {
      this.organizacaoSelecionada = undefined;
    });
  }

  datatableClick(event: DatatableClickEvent) {
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
      message: this.getLabel('Global.Mensagens.CertezaExcluirRegistro'),
      accept: () => {
        this.organizacaoService.delete(id).subscribe(() => {
          this.pageNotificationService.addDeleteMsg();
          this.recarregarDataTable();
        }, error => {
          if (error.status === 500) {
            this.pageNotificationService
              .addErrorMsg(this.getLabel('Cadastros.Organizacao.Mensagens.msgOrganizacaoNaoPodeSerDeletadaPoisEstaAssociadaAContratoEquipeOuAnalise'));
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
  }

}
