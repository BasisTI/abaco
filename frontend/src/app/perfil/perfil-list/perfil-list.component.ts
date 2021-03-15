import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableClickEvent, DatatableComponent, PageNotificationService } from '@nuvem/primeng-components';
import { ConfirmationService } from 'primeng';
import { ElasticQuery } from 'src/app/shared/elastic-query';
import { AuthService } from 'src/app/util/auth.service';
import { Perfil } from '../perfil.model';
import { PerfilService } from '../perfil.service';

@Component({
    selector: 'app-perfil',
    templateUrl: './perfil-list.component.html',
})
export class PerfilListComponent implements OnInit {

    @ViewChild(DatatableComponent) datatable: DatatableComponent;

    elasticQuery: ElasticQuery = new ElasticQuery();
    searchUrl: string = this.perfilService.searchUrl;

    perfilSelecionado: Perfil;
    perfil: Perfil;

    rowsPerPageOptions: number[] = [5, 10, 20];

    canPesquisar: boolean = false;
    canCadastrar: boolean = false;
    canEditar: boolean = false;
    canConsultar: boolean = false;
    canDeletar: boolean = false;

    constructor(
        private perfilService: PerfilService,
        private router: Router,
        private confirmationService: ConfirmationService,
        private pageNotificationService: PageNotificationService,
        public authService: AuthService
    ) {
    }

    public ngOnInit() {
        this.verificarPermissoes();
    }

    verificarPermissoes(){
        if (this.authService.possuiRole(AuthService.PREFIX_ROLE + "PERFIL_PESQUISAR") == true) {
            this.canPesquisar = true;
        }
        if (this.authService.possuiRole(AuthService.PREFIX_ROLE + "PERFIL_EDITAR") == true) {
            this.canEditar = true;
        }
        if (this.authService.possuiRole(AuthService.PREFIX_ROLE + "PERFIL_CONSULTAR") == true) {
            this.canConsultar = true;
        }
        if (this.authService.possuiRole(AuthService.PREFIX_ROLE + "PERFIL_EXCLUIR") == true) {
            this.canDeletar = true;
        }
        if (this.authService.possuiRole(AuthService.PREFIX_ROLE + "PERFIL_CADASTRAR") == true) {
            this.canCadastrar = true;
        }
    }

    public recarregarDataTable() {
        this.datatable.refresh(this.elasticQuery.query);
    }

    public limparPesquisa() {
        this.elasticQuery.reset();
        this.recarregarDataTable();
    }

    public onRowDblclick(event) {
        if (this.authService.possuiRole(AuthService.PREFIX_ROLE + "PERFIL_EDITAR") == false) {
            return false;
        }
        if (event.target.nodeName === 'TD') {
            this.abrirEditar(this.perfilSelecionado);
        } else if (event.target.parentNode.nodeName === 'TD') {
            this.abrirEditar(this.perfilSelecionado);
        }
    }

    abrirEditar(perfil: Perfil) {
        this.router.navigate(['/perfil', perfil.id, 'edit']);
    }

    abrirVisualizar(perfil: Perfil) {
        this.router.navigate(['/perfil', perfil.id, 'view']);
    }

    public selectPerfil() {
        if (this.datatable && this.datatable.selectedRow) {
            if (this.datatable.selectedRow && this.datatable.selectedRow) {
                this.perfilSelecionado = this.datatable.selectedRow;
            }
        }
    }

    onClick(event: DatatableClickEvent) {
        if (!event.selection) {
            return;
        }
        switch (event.button) {
            case 'edit': {
                this.abrirEditar(event.selection);
                break;
            }
            case 'view': {
                this.abrirVisualizar(event.selection);
                break;
            }
            case 'delete': {
                this.confirmDelete(event.selection);
                break;
            }
            default: {
                break;
            }
        }
    }

    public criarPerfil() {
        this.router.navigate(["/perfil/new"])
    }

    public confirmDelete(perfil: Perfil) {
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja excluir o registro?',
            accept: () => {
                this.perfilService.delete(perfil.id).subscribe((response) => {
                    this.recarregarDataTable();
                    this.pageNotificationService.addSuccessMessage('Registro excluído com sucesso!');

                });
            }
        });
    }
}
