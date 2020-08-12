import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng';
import { DatatableComponent, PageNotificationService, DatatableClickEvent } from '@nuvem/primeng-components';
import { Organizacao, OrganizacaoService } from 'src/app/organizacao';
import { Authority } from '../authority.model';
import { TipoEquipe, TipoEquipeService } from 'src/app/tipo-equipe';
import { UserService } from '../user.service';
import { User } from '../user.model';

@Component({
    selector: 'app-user',
    templateUrl: './user-list.component.html',
    providers: [ConfirmationService]
})
export class UserListComponent implements OnInit {

    @ViewChild(DatatableComponent) datatable: DatatableComponent;

    searchUrl: string = this.userService.searchUrl;

    usuarioSelecionado: User;

    rowsPerPageOptions: number[] = [5, 10, 20];

    customOptions: Object = {};

    searchParams: any = {
        fullName: undefined,
        login: undefined,
        email: undefined,
        organization: undefined,
        profile: undefined,
        team: undefined,
    };
    query: string;
    organizations: Array<Organizacao>;
    authorities: Array<Authority>;
    teams: TipoEquipe[];

    constructor(
        private router: Router,
        private userService: UserService,
        private confirmationService: ConfirmationService,
        private organizacaoService: OrganizacaoService,
        private tipoEquipeService: TipoEquipeService,
        private pageNotificationService: PageNotificationService,
    ) {
    }

    getLabel(label) {
        return label;
    }

    ngOnInit() {
        this.recuperarOrganizacoes();
        this.recuperarAutorizacoes();
        this.recuperarEquipe();
        this.query = this.changeUrl();
        if (this.datatable) {

            this.datatable.pDatatableComponent.onRowSelect.subscribe((event) => {
                this.usuarioSelecionado = event.data;
            });
            this.datatable.pDatatableComponent.onRowUnselect.subscribe((event) => {
                this.usuarioSelecionado = undefined;
            });
        }
    }

    recuperarOrganizacoes() {
        this.organizacaoService.dropDown().subscribe(response => {
            this.organizations = response;
            this.customOptions['organizacao.nome'] = response.map((item) => {
                return {label: item.nome, value: item.id};
              });
        });
    }

    recuperarAutorizacoes() {
        this.userService.authorities().subscribe(response => {
            this.authorities = response;
            this.popularNomesAuthorities();
            this.customOptions['perfil'] = this.authorities.map((item) => {
                return {label: item.description, value: item.name};
              });
        });
    }

    recuperarEquipe() {
        this.tipoEquipeService.dropDown().subscribe(response => {
            this.teams = response;
            const emptyTeam = new TipoEquipe();
            this.customOptions['equipe'] = response.map((item) => {
                return {label: item.nome, value: item.id};
              });
        });
    }

    popularNomesAuthorities() {
        if (this.authorities) {
            this.authorities.forEach((authority) => {
                switch (authority.name) {
                    case 'ROLE_ADMIN': {
                        authority.description = this.getLabel('Administrador');
                        break;
                    }
                    case 'ROLE_USER': {
                        authority.description = this.getLabel('Usuário');
                        break;
                    }
                    case 'ROLE_VIEW': {
                        authority.description = this.getLabel('Observador');
                        break;
                    }
                    case 'ROLE_ANALISTA': {
                        authority.description = this.getLabel('Analista');
                        break;
                    }
                    case 'ROLE_GESTOR': {
                        authority.description = this.getLabel('Gestor');
                        break;
                    }
                }
            });
        }
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
            message: this.getLabel('Tem certeza que deseja excluir o registro?'),
            accept: () => {
                this.userService.delete(user).subscribe(() => {
                    this.datatable.refresh(this.query);
                    this.pageNotificationService.addDeleteMsg();
                }, (error: Response) => {
                    if (error.status === 400) {
                        const errorType: string = error.headers['x-abacoapp-error'][0];
                        switch (errorType) {
                            case 'error.userexists': {
                                this.pageNotificationService.addErrorMessage(this.getLabel('Cadastros.Usuarios.Mensagens.msgVoceNaoPodeExcluirAdministrador'));
                                break;
                            }
                            case 'error.analiseexists': {
                                this.pageNotificationService.addErrorMessage(this.getLabel('Cadastros.Usuarios.Mensagens.msgVoceNaoPodeExcluirUsuarioEleDonoAnalise'));
                                break;
                            }
                        }
                    }
                });
            }
        });
    }
    performSearch() {
        this.query = this.changeUrl();
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
        this.recarregarDataTable();
    }

    recarregarDataTable() {
        this.datatable.url = this.changeUrl();
        this.datatable.reset();
    }

    public changeUrl() {

        let querySearch = '?nome=';
        querySearch = querySearch.concat((this.searchParams.fullName) ? `*${this.searchParams.fullName}*` : '');

        querySearch = querySearch.concat((this.searchParams.login) ? `&login=*${this.searchParams.login}*` : '');

        querySearch = querySearch.concat((this.searchParams.email) ? `&email=*${this.searchParams.email}*` : '');

        querySearch = querySearch.concat((this.searchParams.organizacao && this.searchParams.organizacao.id) ?
            `&organizacao=${this.searchParams.organizacao.id}` : '');

        querySearch = querySearch.concat((this.searchParams.profile && this.searchParams.profile.name) ?
            `&perfil=${this.searchParams.profile.name}` : '');

        querySearch = querySearch.concat((this.searchParams.team && this.searchParams.team.id) ?
            `&equipe=${this.searchParams.team.id}` : '');

        querySearch = (querySearch === '?') ? '' : querySearch;

        querySearch = (querySearch.endsWith('&')) ? querySearch.slice(0, -1) : querySearch;

        return this.userService.searchUrl + querySearch;
    }

}
