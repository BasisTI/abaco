import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableClickEvent, DatatableComponent, PageNotificationService } from '@nuvem/primeng-components';
import { ElasticQuery } from 'src/app/shared/elastic-query';
import { TipoEquipe, TipoEquipeService } from 'src/app/tipo-equipe';
import { AuthService } from 'src/app/util/auth.service';
import { Sistema } from '../../sistema';
import { SistemaService } from '../../sistema/sistema.service';
import { BaselineSintetico } from '../baseline-sintetico.model';
import { BaselineService } from '../baseline.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'jhi-baseline',
    templateUrl: './baseline.component.html'
})
export class BaselineComponent implements OnInit {

    elasticQuery: ElasticQuery = new ElasticQuery();
    @ViewChild(DatatableComponent) datatable: DatatableComponent;
    rowsPerPageOptions: number[] = [5, 10, 20];
    indexList = ['BASE_LINE_ANALITICO', 'BASE_LINE_SINTETICO'];
    public urlBaseLineSintetico = this.baselineService.sinteticosUrl;
    selecionada: boolean;
    nomeSistemas: Array<Sistema>;
    nomeEquipes: Array<TipoEquipe>;
    sistema?: Sistema = new Sistema();
    sistemaUpdate?: Sistema = new Sistema();
    equipeUpdate?: TipoEquipe = new TipoEquipe();
    urlBaseline: string;
    enableTable = false ;
    lstBasilineSintetico: BaselineSintetico[];
    showUpdateBaseline: boolean = false;

    canPesquisar: boolean = false;
    canAtualizar: boolean = false;
    canConsultar: boolean = false;
    canExportar: boolean = false;

    constructor(
        private router: Router,
        private baselineService: BaselineService,
        private sistemaService: SistemaService,
        private equipeService: TipoEquipeService,
        private pageNotificationService: PageNotificationService,
        private authService: AuthService
    ) {
    }

    getLabel(label) {
        return label;
    }

    ngOnInit(): void {
        this.recuperarSistema();
        this. recuperarEquipe();
        this.verificarPermissoes();
    }

    verificarPermissoes(){
        if (this.authService.possuiRole(AuthService.PREFIX_ROLE + "BASELINE_CONSULTAR") == true) {
            this.canConsultar = true;
        }
        if (this.authService.possuiRole(AuthService.PREFIX_ROLE + "BASELINE_EXPORTAR") == true) {
            this.canExportar = true;
        }
        if (this.authService.possuiRole(AuthService.PREFIX_ROLE + "BASELINE_PESQUISAR") == true) {
            this.canPesquisar = true;
        }
        if (this.authService.possuiRole(AuthService.PREFIX_ROLE + "BASELINE_ATUALIZAR") == true) {
            this.canAtualizar = true;
        }
    }

    public carregarDataTable() {
        this.baselineService.allBaselineSintetico(this.sistema).subscribe((res) => {
            this.datatable.value = res;
            this.datatable.reset();
            this.datatable.pDatatableComponent.onRowSelect.subscribe((event) => {
                this.selecionada = false;
            });
            this.datatable.pDatatableComponent.onRowUnselect.subscribe((event) => {
                this.selecionada = true;
            });
        });
    }

    public datatableClick(event: DatatableClickEvent) {
        if  (!event.selection) {
            return;
        }
        switch (event.button) {
            case 'view':
                this.router.navigate(['/baseline', event.selection.idsistema, event.selection.equipeResponsavelId]);
                break;
            case 'geraBaselinePdfBrowser':
                this.geraBaselinePdfBrowser(event.selection.idsistema);
                break;
        }
    }

    public geraBaselinePdfBrowser(id) {
        this.baselineService.geraBaselinePdfBrowser(id);
    }
    recuperarSistema() {
        this.sistemaService.dropDown().subscribe(response => {
            this.nomeSistemas = response;
            const emptySystem = new Sistema();
            this.nomeSistemas.unshift(emptySystem);
        });
    }
    recuperarEquipe() {
        this.equipeService.dropDown().subscribe(response => {
            this.nomeEquipes = response;
            const emptySystem = new TipoEquipe();
            this.nomeEquipes.unshift(emptySystem);
        });
    }

    public changeUrl() {

        let querySearch = '?identificador=';
        querySearch = querySearch.concat((this.sistema && this.sistema.id) ?
            `sistema=${this.sistema.id}&` : '');

        querySearch = (querySearch === '?') ? '' : querySearch;

        querySearch = (querySearch.endsWith('&')) ? querySearch.slice(0, -1) : querySearch;

        return querySearch;
    }

    public performSearch() {
        this.enableTable = true ;
        this.baselineService.allBaselineSintetico(this.sistema).subscribe((res) => {
            this.lstBasilineSintetico = res;

        });
        this.recarregarDataTable();
    }


    public limparPesquisa() {
        this.sistema = undefined;
        this.enableTable = false;
    }
    public recarregarDataTable() {
        if  (this.datatable ){
            if (this.sistema && this.sistema.id) {
                this.datatable.filterParams['sistema'] = this.sistema.id;
            }
            this.datatable.reset();
        }
    }

    public atualizarBaseline() {
        this.showUpdateBaseline = true;
    }

    public updateBaseline(sistema: Sistema, equipe: TipoEquipe) {
        if  (!sistema || !sistema.id) {
            this.pageNotificationService.addErrorMessage(
                this.getLabel('Selecione um Sistema para atualizar!')
            );
            return;
        } else if  (!equipe || !equipe.id) {
            this.pageNotificationService.addErrorMessage(
                this.getLabel('Selecione uma Equipe para atualizar!')
            );
            return;
        } else {
            this.baselineService.updateBaselineSintetico(sistema, equipe).subscribe((res) => {
                    this.showUpdateBaseline = false;
                    this.sistema = sistema;
                    this.sistemaUpdate =  new Sistema();
                    this.equipeUpdate = new TipoEquipe();
                    this.performSearch();
                }, error => {
                    this.pageNotificationService.addErrorMessage('Não foi possível localizar Análise para gerar Baseline do sistema informado.');
                    console.log(error.message);
                    this.showUpdateBaseline = false;
            });
        }
    }
}
