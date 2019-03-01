import {Component, ViewChild, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ConfirmationService} from 'primeng/primeng';
import {DatatableComponent, DatatableClickEvent} from '@basis/angular-components';
import {Response} from '@angular/http';

import {environment} from '../../environments/environment';
import {User} from './user.model';
import {UserService} from './user.service';
import {ElasticQuery, PageNotificationService} from '../shared';
import {AfterViewInit} from '@angular/core/src/metadata/lifecycle_hooks';
import {Organizacao} from '../organizacao/organizacao.model';
import {OrganizacaoService} from '../organizacao/organizacao.service';
import {Authority} from './authority.model';
import {TipoEquipe} from '../tipo-equipe/tipo-equipe.model';
import {TipoEquipeService} from '../tipo-equipe/tipo-equipe.service';
import {StringConcatService} from '../shared/string-concat.service';

@Component({
    selector: 'jhi-user',
    templateUrl: './user.component.html'
})
export class UserComponent implements AfterViewInit, OnInit {

    @ViewChild(DatatableComponent) datatable: DatatableComponent;

    searchUrl: string = this.userService.searchUrl;

    usuarioSelecionado: User;

    paginationParams = {contentIndex: null};

    query: String = "*";

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
    ) {
    }

    ngOnInit() {
        this.recuperarOrganizacoes();
        this.recuperarAutorizacoes();
        this.recuperarEquipe();
        this.datatable.pDatatableComponent.onRowSelect.subscribe((event) => {
            this.usuarioSelecionado = event.data;
        });
        this.datatable.pDatatableComponent.onRowUnselect.subscribe((event) => {
            this.usuarioSelecionado = undefined;
        });
    }

    /**
     * Método responsável por recuperar as organizações.
     */
    recuperarOrganizacoes() {
        this.organizacaoService.query().subscribe(response => {
            this.organizations = response.json;
            const emptyOrg = new Organizacao();
            this.organizations.unshift(emptyOrg);
        });
    }

    /**
     * Método responsável por recuperar as autorizações.
     */
    recuperarAutorizacoes() {
        this.userService.authorities().subscribe(response => {
            this.authorities = response;
            const emptyProfile = new Authority();
            this.authorities.unshift(emptyProfile);
            this.popularNomesAuthorities();
        });
    }

    /**
     * Método responsável por recuperar as equipes.
     */
    recuperarEquipe() {
        this.tipoEquipeService.query().subscribe(response => {
            this.teams = response.json;
            const emptyTeam = new TipoEquipe();
            this.teams.unshift(emptyTeam);
        });
    }

    popularNomesAuthorities() {
        this.authorities.forEach((authority) => {
            switch (authority.name) {
                case 'ROLE_ADMIN': {
                    authority.description = 'Administrador';
                    break;
                }
                case 'ROLE_USER': {
                    authority.description = 'Usuário';
                    break;
                }
                case 'ROLE_VIEW': {
                    authority.description = 'Observador';
                    break;
                }
                case 'ROLE_ANALISTA': {
                    authority.description = 'Analista';
                    break;
                }
                case 'ROLE_GESTOR': {
                    authority.description = 'Gestor';
                    break;
                }
            }
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

    public onRowDblclick(event) {
        if (event.target.nodeName === 'TD') {
            this.abrirEditar();
        } else if (event.target.parentNode.nodeName === 'TD') {
            this.abrirEditar();
        }
    }

    abrirEditar() {
        this.router.navigate(['/admin/user', this.usuarioSelecionado.id, 'edit']);
    }

    confirmDelete(user: User) {
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja excluir o registro?',
            accept: () => {
                this.userService.delete(user).subscribe(() => {
                    this.datatable.refresh(this.query);
                    this.pageNotificationService.addDeleteMsg();
                }, (error: Response) => {
                    if (error.status === 400) {
                        const errorType: string = error.headers.toJSON()['x-abacoapp-error'][0];
                        switch (errorType) {
                            case 'error.userexists' : {
                                this.pageNotificationService.addErrorMsg('Você não pode excluir o Administrador!');
                                break;
                            }
                            case 'error.analiseexists' : {
                                this.pageNotificationService.addErrorMsg('Você não pode excluir o usuário porque ele é dono de alguma Análise!');
                                break;
                            }
                        }
                    }
                });
            }
        });
    }

    private checkUndefinedParams() {
        (this.searchParams.fullName === '') ? (this.searchParams.fullName = undefined) : (this);
        (this.searchParams.login === '') ? (this.searchParams.login = undefined) : (this);
        (this.searchParams.email === '') ? (this.searchParams.email = undefined) : (this);
        (this.searchParams.organization !== undefined) ? ((this.searchParams.organization.nome === '') ? (this.searchParams.organization.nome = undefined) : (null)) : (this);
        (this.searchParams.profile !== undefined) ? ((this.searchParams.profile.name === '') ? (this.searchParams.profile.nome = undefined) : (this)) : (this);
        (this.searchParams.team !== undefined) ? ((this.searchParams.team.nome === '') ? (this.searchParams.team.nome = undefined) : (this)) : (this);
    }

   private createStringParamsArray(): Array<string> {
        const arrayParams: Array<string> = [];

        (this.searchParams.fullName !== undefined) ? (arrayParams.push('+firstName:' + this.searchParams.fullName)) : (this);
        (this.searchParams.login !== undefined) ? (arrayParams.push('+login:' + this.searchParams.login)) : (this);
        (this.searchParams.email !== undefined) ? (arrayParams.push('+email:' + this.searchParams.email)) : (this);
        (this.searchParams.organization !== undefined) ? ((this.searchParams.organization.nome !== undefined) ? (arrayParams.push('+organizacoes.nome:' + this.searchParams.organization.nome)) : (this)) : (this);
        (this.searchParams.profile !== undefined) ? ((this.searchParams.profile.name !== undefined) ? (arrayParams.push('+authorities.name:' + this.searchParams.profile.name)) : (this)) : (this);
        (this.searchParams.team !== undefined) ? ((this.searchParams.team.nome !== undefined) ? (arrayParams.push('+tipoEquipes.nome:' + this.searchParams.team.nome)) : (this)) : (this);

        return arrayParams;
    }


    performSearch() {
        this.checkUndefinedParams();
        this.query = this.stringConcatService.concatResults(this.createStringParamsArray()).slice(1);
        this.recarregarDataTable();
    }
    
    limparPesquisa() {
        this.searchParams = {
            fullName: undefined,
            login: undefined,
            email: undefined,
            organization: undefined,
            profile: undefined,
            team: undefined,
        };
        this.query = "*";
        this.recarregarDataTable();
    }

    recarregarDataTable() {
        console.log(this.datatable.value);
        console.log(this.query.valueOf);
        
        this.datatable.refresh(this.query.toLocaleLowerCase ? this.query : "*");
    }

}