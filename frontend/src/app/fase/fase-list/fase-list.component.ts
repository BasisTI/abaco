import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableClickEvent, DatatablePaginationParameters, PageNotificationService, DatatableComponent } from '@nuvem/primeng-components';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from 'src/app/util/auth.service';
import { FaseService } from '../fase.service';
import { FaseFilter } from '../model/fase.filter';
import { Fase } from '../model/fase.model';


@Component({
    selector: 'app-fase-list',
    templateUrl: './fase-list.component.html',
    providers: [ConfirmationService,FaseService]
})
export class FaseListComponent implements OnInit {

    paginationParameters: DatatablePaginationParameters;
    @ViewChild(DatatableComponent) dataTable: DatatableComponent;
    tipoFaseSelecionada: Fase = new Fase();
    filtro: FaseFilter = new FaseFilter();
    urlFaseService = this.tipoFaseService.resourceUrl;

    canCadastrar: boolean = false;
    canEditar: boolean = false;
    canConsultar: boolean = false;
    canDeletar: boolean = false;

    constructor(
        private router: Router,
        private tipoFaseService: FaseService,
        private pageNotificationService: PageNotificationService,
        private confirmationService: ConfirmationService,
        private authService: AuthService
    ) {}

    public ngOnInit() {
        this.verificarPermissoes();
    }

    verificarPermissoes(){
        if (this.authService.possuiRole(AuthService.PREFIX_ROLE+"FASE_EDITAR") == true) {
            this.canEditar = true;
        }

        if (this.authService.possuiRole(AuthService.PREFIX_ROLE+"FASE_CONSULTAR") == true) {
            this.canConsultar = true;
        }

        if (this.authService.possuiRole(AuthService.PREFIX_ROLE+"FASE_EXCLUIR") == true) {
            this.canDeletar = true;
        }
        if (this.authService.possuiRole(AuthService.PREFIX_ROLE+"FASE_CADASTRAR") == true) {
            this.canCadastrar = true;
        }
    }

    susbcribeSelectRow(data): any {
        this.tipoFaseSelecionada = data;
    }

    subscribeUnselectRow() {
        this.tipoFaseSelecionada = new Fase();
    }

    editarClickEvent(tipoFaseSelecionada: Fase){
        this.router.navigate(['/fase', tipoFaseSelecionada.id, 'edit']);
    }

    abrirEditar(tipoFaseSelecionada: Fase) {
        this.router.navigate(['/fase', tipoFaseSelecionada.id, 'edit']);
    }

    abrirVisualizar(tipoFaseSelecionada: Fase) {
        this.router.navigate(['/fase', tipoFaseSelecionada.id]);
    }

    confirmDelete(tipoFaseSelecionada: Fase) {
            this.confirmationService.confirm({
                message: "Tem certeza que deseja excluir o registro?",
                accept: () => {
                        this.tipoFaseService.delete(tipoFaseSelecionada.id).subscribe(() => {
                        this.pageNotificationService.addDeleteMsg();
                        this.dataTable.refresh();
                    });
                }
            });
    }

    limparPesquisa() {
        this.filtro = new FaseFilter();
    }
    onClick(event: DatatableClickEvent) {
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

    public onRowDblclick(event) {
        if (this.authService.possuiRole(AuthService.PREFIX_ROLE + "FASE_EDITAR") == false) {
            return false;
        }
        if (event.target.nodeName === 'TD') {
            this.abrirEditar(this.tipoFaseSelecionada);
        } else if (event.target.parentNode.nodeName === 'TD') {
            this.abrirEditar(this.tipoFaseSelecionada);
        }
    }


    public selectFase() {
        if (this.dataTable && this.dataTable.selectedRow) {
            if (this.dataTable.selectedRow && this.dataTable.selectedRow) {
                this.tipoFaseSelecionada = this.dataTable.selectedRow;
            }
        }
    }

    public criarFase(){
        this.router.navigate(["/fase/new"]);
    }
}


