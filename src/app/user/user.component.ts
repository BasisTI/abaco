import { TranslateService } from '@ngx-translate/core';
import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { DatatableComponent, DatatableClickEvent } from '@basis/angular-components';
import { Response } from '@angular/http';

import { User } from './user.model';
import { UserService } from './user.service';
import {  PageNotificationService } from '../shared';
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
export class UserComponent implements OnInit {

    @ViewChild(DatatableComponent) datatable: DatatableComponent;

    searchUrl: string = this.userService.searchUrl;

    usuarioSelecionado: User;

    rowsPerPageOptions: number[] = [5, 10, 20];

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
    teams: Array<TipoEquipe>;

    constructor(
        private router: Router,
        private userService: UserService,
        private confirmationService: ConfirmationService,
        private organizacaoService: OrganizacaoService,
        private tipoEquipeService: TipoEquipeService,
        private stringConcatService: StringConcatService,
        private pageNotificationService: PageNotificationService,
        private translate: TranslateService
    ) {
    }

    getLabel(label) {
        let str: any;
        this.translate.get(label).subscribe((res: string) => {
            str = res;
        }).unsubscribe();
        return str;
    }

    ngOnInit() {
        this.recuperarOrganizacoes();
        this.recuperarAutorizacoes();
        this.recuperarEquipe();
        this.query = this.changeUrl();
        this.datatable.pDatatableComponent.onRowSelect.subscribe((event) => {
            this.usuarioSelecionado = event.data;
        });
        this.datatable.pDatatableComponent.onRowUnselect.subscribe((event) => {
            this.usuarioSelecionado = undefined;
        });
    }

    recuperarOrganizacoes() {
        this.organizacaoService.dropDown().subscribe(response => {
            this.organizations = response.json;
            const emptyOrg = new Organizacao();
            this.organizations.unshift(emptyOrg);
        });
    }

    recuperarAutorizacoes() {
        this.userService.authorities().subscribe(response => {
            this.authorities = response;
            const emptyProfile = new Authority();
            this.authorities.unshift(emptyProfile);
            this.popularNomesAuthorities();
        });
    }

    recuperarEquipe() {
        this.tipoEquipeService.dropDown().subscribe(response => {
            this.teams = response.json;
            const emptyTeam = new TipoEquipe();
            this.teams.unshift(emptyTeam);
        });
    }

    popularNomesAuthorities() {
        if (this.authorities) {
            this.authorities.forEach((authority) => {
                switch (authority.name) {
                    case 'ROLE_ADMIN': {
                        authority.description = this.getLabel('Cadastros.Usuarios.Administrador');
                        break;
                    }
                    case 'ROLE_USER': {
                        authority.description = this.getLabel('Cadastros.Usuarios.Usuario');
                        break;
                    }
                    case 'ROLE_VIEW': {
                        authority.description = this.getLabel('Cadastros.Usuarios.Observador');
                        break;
                    }
                    case 'ROLE_ANALISTA': {
                        authority.description = this.getLabel('Cadastros.Usuarios.Analista');
                        break;
                    }
                    case 'ROLE_GESTOR': {
                        authority.description = this.getLabel('Cadastros.Usuarios.Gestor');
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
            message: this.getLabel('Global.Mensagens.CertezaExcluirRegistro'),
            accept: () => {
                this.userService.delete(user).subscribe(() => {
                    this.datatable.refresh(this.query);
                    this.pageNotificationService.addDeleteMsg();
                }, (error: Response) => {
                    if (error.status === 400) {
                        const errorType: string = error.headers.toJSON()['x-abacoapp-error'][0];
                        switch (errorType) {
                            case 'error.userexists': {
                                this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Usuarios.Mensagens.msgVoceNaoPodeExcluirAdministrador'));
                                break;
                            }
                            case 'error.analiseexists': {
                                this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Usuarios.Mensagens.msgVoceNaoPodeExcluirUsuarioEleDonoAnalise'));
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
