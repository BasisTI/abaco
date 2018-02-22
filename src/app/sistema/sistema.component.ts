import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { DatatableComponent, DatatableClickEvent } from '@basis/angular-components';

import { environment } from '../../environments/environment';
import { Sistema } from './sistema.model';
import { SistemaService } from './sistema.service';
import { ElasticQuery } from '../shared';
import { Organizacao } from '../organizacao/organizacao.model';
import { OrganizacaoService } from '../organizacao/organizacao.service';
import { StringConcatService } from '../shared/string-concat.service';

@Component({
  selector: 'jhi-sistema',
  templateUrl: './sistema.component.html'
})
export class SistemaComponent implements AfterViewInit {

  @ViewChild(DatatableComponent) datatable: DatatableComponent;

  searchUrl: string = this.sistemaService.searchUrl;

  paginationParams = { contentIndex: null };
  elasticQuery: ElasticQuery = new ElasticQuery();
  organizations: Array<Organizacao>;
  searchParams: any = {
    sigla: undefined,
    nomeSistema: undefined,
    organizacao: {
      nome: undefined
    }
  };

  constructor(
    private router: Router,
    private sistemaService: SistemaService,
    private confirmationService: ConfirmationService,
    private organizacaoService: OrganizacaoService,
    private stringConcatService: StringConcatService
  ) {
    let emptyOrganization = new Organizacao();

    emptyOrganization.nome = '';
    this.organizacaoService.query().subscribe(response => {
      this.organizations = response.json;
      this.organizations.unshift(emptyOrganization);
    });
  }

  ngAfterViewInit() {
    this.datatable.refresh(this.elasticQuery.query);
  }

  datatableClick(event: DatatableClickEvent) {
    if (!event.selection) {
      return;
    }
    switch (event.button) {
      case 'edit':
        this.router.navigate(['/sistema', event.selection.id, 'edit']);
        break;
      case 'delete':
        this.confirmDelete(event.selection.id);
        break;
      case 'view':
        this.router.navigate(['/sistema', event.selection.id]);
        break;
    }
  }

  confirmDelete(id: any) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir o registro?',
      accept: () => {
        this.sistemaService.delete(id).subscribe(() => {
          this.datatable.refresh(this.elasticQuery.query);
        });
      }
    });
  }

  private checkUndefinedParams() {
    (this.searchParams.sigla === '') ? (this.searchParams.sigla = undefined) : (this);
    (this.searchParams.nomeSistema === '') ? (this.searchParams.nomeSistema = undefined) : (this);
    (this.searchParams.organizacao.nome === '') ? (this.searchParams.organizacao.nome = undefined) : (this);
  }

  performSearch() {
    this.checkUndefinedParams();
    this.elasticQuery.value = this.stringConcatService.concatResults(this.createStringParamsArray());
    this.datatable.refresh(this.elasticQuery.query)
  }

  private createStringParamsArray(): Array<string> {
    let stringParamsArray: Array<string> = [];

    (this.searchParams.sigla !== undefined) ? (stringParamsArray.push(this.searchParams.sigla)) : (this);
    (this.searchParams.nomeSistema !== undefined) ? (stringParamsArray.push(this.searchParams.nomeSistema)) : (this);
    (this.searchParams.organizacao.nome !== undefined) ? (stringParamsArray.push(this.searchParams.organizacao.nome)) : (this);

    return stringParamsArray;
  }

}
