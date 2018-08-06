import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { DatatableComponent, DatatableClickEvent } from '@basis/angular-components';

import { environment } from '../../environments/environment';
import { User } from './user.model';
import { UserService } from './user.service';
import { ElasticQuery, PageNotificationService } from '../shared';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Organizacao } from '../organizacao/organizacao.model';
import { OrganizacaoService } from '../organizacao/organizacao.service';
import { Authority } from './authority.model';
import { TipoEquipe } from '../tipo-equipe/tipo-equipe.model';
import { TipoEquipeService } from '../tipo-equipe/tipo-equipe.service';
import { StringConcatService } from '../shared/string-concat.service';

@Component({
  selector: 'jhi-user',
  templateUrl: './user.component.html'
})
export class UserComponent implements AfterViewInit, OnInit {

  @ViewChild(DatatableComponent) datatable: DatatableComponent;

  searchUrl: string = this.userService.searchUrl;

  paginationParams = { contentIndex: null };

  elasticQuery: ElasticQuery = new ElasticQuery();

  rowsPerPageOptions: number[] = [5, 10, 20];

  searchParams: any = {
    fullName: undefined,
    login: undefined,
    email: undefined,
    organization: undefined,
    profile: undefined,
    team: undefined,
  };

  organizations: Array<Organizacao>;
  authorities: Array<Authority>;
  teams: Array<TipoEquipe>;

  constructor(
    private router: Router,
    private userService: UserService,
    private confirmationService: ConfirmationService,
    private organizacaoService: OrganizacaoService,
    private tipoEquipeService: TipoEquipeService,
    private stringConcatService: StringConcatService,
    private pageNotificationService: PageNotificationService
  ) {}

  ngOnInit() {
    this.recuperarOrganizacoes();
    this.recuperarAutorizacoes();
    this.recuperarEquipe();
  }

  /**
   * Método responsável por recuperar as organizações.
   */
  recuperarOrganizacoes() {
    this.organizacaoService.query().subscribe(response => {
      this.organizations = response.json;
      let emptyOrg = new Organizacao();
      emptyOrg.nome = '';
      this.organizations.unshift(emptyOrg);
    });
  }

    /**
   * Método responsável por recuperar as autorizações.
   */
  recuperarAutorizacoes() {
    this.userService.authorities().subscribe(response => {
      this.authorities = response;
      let emptyProfile = new Authority();
      this.authorities.unshift(emptyProfile);
    });
  }

    /**
   * Método responsável por recuperar as equipes.
   */
  recuperarEquipe() {
    this.tipoEquipeService.query().subscribe(response => {
      this.teams = response.json;
      let emptyTeam = new TipoEquipe();
      emptyTeam.nome = '';
      this.teams.unshift(emptyTeam);
    });
  }

  ngAfterViewInit() {
    this.recarregarDataTable();
  }

  datatableClick(event: DatatableClickEvent) {
    if (!event.selection) {
      return;
    }
    switch (event.button) {
      case 'edit':
        this.router.navigate(['/admin/user', event.selection.id, 'edit']);
        break;
      case 'delete':
        this.confirmDelete(event.selection);
        break;
      case 'view':
        this.router.navigate(['/admin/user', event.selection.id]);
        break;
    }
  }

  confirmDelete(user: User) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir o registro?',
      accept: () => {
        this.userService.delete(user).subscribe(() => {
          this.datatable.refresh(this.elasticQuery.query);
          this.pageNotificationService.addDeleteMsg();

        },error => {
          if(error.status === 400){
            this.pageNotificationService.addErrorMsg('Você não pode excluir o usuário Administrador!');

          }
      });
      }
    });
  }

  private checkUndefinedParams() {
    (this.searchParams.fullName === '') ? (this.searchParams.fullName = undefined) : (this);
    (this.searchParams.login === '') ? (this.searchParams.login = undefined) : (this);
    (this.searchParams.email === '') ? (this.searchParams.email = undefined) : (this);
    (this.searchParams.organization !== undefined) ? ((this.searchParams.organization.nome === '') ? (this.searchParams.organization.nome = undefined) : (console.log('Caiu no false'))) : (this);
    (this.searchParams.profile !== undefined) ? ((this.searchParams.profile.name === '') ? (this.searchParams.profile.nome = undefined) : (this)) : (this);
    (this.searchParams.team !== undefined) ? ((this.searchParams.team.nome === '') ? (this.searchParams.team.nome = undefined) : (this)) : (this);
  }

  private createStringParamsArray(): Array<string> {
    let arrayParams: Array<string> = [];

    (this.searchParams.fullName !== undefined) ? (arrayParams.push(this.searchParams.fullName)) : (this);
    (this.searchParams.login !== undefined) ? (arrayParams.push(this.searchParams.login)) : (this);
    (this.searchParams.email !== undefined) ? (arrayParams.push(this.searchParams.email)) : (this);
    (this.searchParams.organization !== undefined) ? ((this.searchParams.organization.nome !== undefined) ? (arrayParams.push(this.searchParams.organization.nome)) : (this)) : (this);
    (this.searchParams.profile !== undefined) ? ((this.searchParams.profile.name !== undefined) ? (arrayParams.push(this.searchParams.profile.name)) : (this)) : (this);
    (this.searchParams.team !== undefined) ? ((this.searchParams.team.nome !== undefined) ? (arrayParams.push(this.searchParams.team.nome)) : (this)) : (this);

    return arrayParams;
  }

  performSearch() {
    this.checkUndefinedParams();
    this.elasticQuery.value = this.stringConcatService.concatResults(this.createStringParamsArray());
    this.recarregarDataTable();
  }

  limparPesquisa() {
    this.elasticQuery.reset();
    this.recarregarDataTable();
  }

  recarregarDataTable() {
    this.datatable.refresh(this.elasticQuery.query);
  }

}
