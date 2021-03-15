import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng';
import { DatatableComponent, PageNotificationService, DatatableClickEvent } from '@nuvem/primeng-components';
import { Organizacao, OrganizacaoService } from 'src/app/organizacao';
import { TipoEquipe, TipoEquipeService } from 'src/app/tipo-equipe';
import { UserService } from '../user.service';
import { User } from '../user.model';
import { SearchGroup } from '..';
import { AuthService } from 'src/app/util/auth.service';

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

    userFiltro : SearchGroup;

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
    teams: TipoEquipe[];

    allColumnsTable = [
        {value: 'nome',  label: 'Nome'},
        {value: 'login',  label: 'Login'},
        {value: 'organizacao',  label: 'Organização'},
        {value: 'perfil',  label: 'Perfil'},
        {value: 'equipe',  label: 'Equipe'},
        {value: 'activated',  label: 'Ativo'},
    ];

    columnsVisible = [
        'nome',
        'login',
        'organizacao',
        'perfil',
        'equipe',
        'activated',];
    private lastColumn: any[] = [];

    canCadastrar: boolean = false;
    canEditar: boolean = false;
    canConsultar: boolean = false;
    canDeletar: boolean = false;
    canPesquisar: boolean = false;

    constructor(
        private router: Router,
        private userService: UserService,
        private confirmationService: ConfirmationService,
        private organizacaoService: OrganizacaoService,
        private tipoEquipeService: TipoEquipeService,
        private pageNotificationService: PageNotificationService,
        private authService: AuthService
    ) {
    }

    getLabel(label) {
        return label;
    }

    ngOnInit() {
        this.recuperarOrganizacoes();
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
        this.userFiltro = new SearchGroup();
        this.userFiltro.columnsVisible = this.columnsVisible;

        this.verificarPermissoes();
    }

    verificarPermissoes(){
        if (this.authService.possuiRole(AuthService.PREFIX_ROLE + "USUARIO_EDITAR") == true) {
            this.canEditar = true;
        }
        if (this.authService.possuiRole(AuthService.PREFIX_ROLE + "USUARIO_CONSULTAR") == true) {
            this.canConsultar = true;
        }
        if (this.authService.possuiRole(AuthService.PREFIX_ROLE + "USUARIO_EXCLUIR") == true) {
            this.canDeletar = true;
        }
        if (this.authService.possuiRole(AuthService.PREFIX_ROLE + "USUARIO_CADASTRAR") == true) {
            this.canCadastrar = true;
        }
        if (this.authService.possuiRole(AuthService.PREFIX_ROLE + "USUARIO_PESQUISAR") == true) {
            this.canPesquisar = true;
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

    recuperarEquipe() {
        this.tipoEquipeService.dropDown().subscribe(response => {
            this.teams = response;
            const emptyTeam = new TipoEquipe();
            this.customOptions['equipe'] = response.map((item) => {
                return {label: item.nome, value: item.id};
              });
        });
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
        if (!this.canEditar) {
            return false;
        }
        const id = this.usuarioSelecionado.id;
        if (id > 0 ) {
            this.router.navigate(['/admin/user', id, 'edit']);
        }
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

    public preencheFiltro(){
        if(this.datatable.filterParams.nome){
            this.userFiltro.nome = this.datatable.filterParams.nome;
        }
        if(this.datatable.filterParams.login){
            this.userFiltro.login = this.datatable.filterParams.login;
        }
        if(this.datatable.filterParams.email){
            this.userFiltro.email = this.datatable.filterParams.email;
        }
        if(this.datatable.filterParams.organizacao){
            this.userFiltro.organizacao = this.datatable.filterParams.organizacao;
        }
        if(this.datatable.filterParams.perfil){
            this.userFiltro.perfil = this.datatable.filterParams.perfil;
        }
        if(this.datatable.filterParams.equipe){
            this.userFiltro.tipoEquipe = this.datatable.filterParams.equipe;
        }
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
    setParamsLoad() {
        this.datatable.pDatatableComponent.onRowSelect.subscribe((event) => {
            this.usuarioSelecionado = event.data;
        });
        this.preencheFiltro();
    }

    mostrarColunas(event) {
        if (this.columnsVisible.length) {
            this.lastColumn = event.value;
            this.updateVisibleColumns(this.columnsVisible);
        } else {
            this.lastColumn.map((item) => this.columnsVisible.push(item));
            this.pageNotificationService.addErrorMessage('Não é possível exibir menos de uma coluna');
        }
    }

    updateVisibleColumns(columns) {
        this.allColumnsTable.forEach(col => {
            if (this.visibleColumnCheck(col.value, columns)) {
                this.datatable.visibleColumns[col.value] = 'table-cell';
            } else {
                this.datatable.visibleColumns[col.value] = 'none';
            }
        });
    }

    visibleColumnCheck(column: string, visibleColumns: any[]) {
        return visibleColumns.some((item: any) => {
            return (item) ? item === column : true;
        });
    }

    criarUsuario(){
        this.router.navigate(["/admin/user/new"])
    }
}
