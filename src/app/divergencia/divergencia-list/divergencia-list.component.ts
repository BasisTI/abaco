import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableClickEvent, DatatableComponent, PageNotificationService } from '@nuvem/primeng-components';
import { ConfirmationService, BlockUIModule, LazyLoadEvent } from 'primeng';
import { Subscription } from 'rxjs';
import { Organizacao, OrganizacaoService } from 'src/app/organizacao';
import { Sistema, SistemaService } from 'src/app/sistema';
import { TipoEquipe, TipoEquipeService } from 'src/app/tipo-equipe';
import { User, UserService } from 'src/app/user';
import { Divergencia } from '../divergencia.model';
import { DivergenciaService } from '../divergencia.service';
import { BlockUiService } from '@nuvem/angular-base';
import { StatusService } from 'src/app/status';
import { Status } from 'src/app/status/status.model';
import {  SearchGroup, Analise } from 'src/app/analise';
import { Table as DataTable } from 'primeng/table';
import { verify } from 'crypto';

@Component({
    selector: 'app-divergencia-list',
    templateUrl: './divergencia-list.component.html',
    providers: [ ConfirmationService]
})
export class DivergenciaListComponent implements OnInit {


    @ViewChild(DataTable, { static: true }) datatable: DataTable;

    rowsPerPageOptions: number[] = [5, 10, 20, 50, 100];

    datasource: Analise[];
    event: LazyLoadEvent;
    cars;

    totalRecords;

    cols: any[];

    loading: boolean;


    allColumnsTable = [
        {field: 'organizacao.nome',  header: 'Organização'},
        {field: 'identificadorAnalise',  header: 'Identificador da Divergência'},
        {field: 'sistema.nome',  header: 'Sistema'},
        {field: 'metodoContagem',  header: 'Metodo Contagem'},
        {field: 'pfTotal',  header: 'PF total'},
        {field: 'adjustPFTotal',  header: 'PF Ajustado'},
        {field: 'dataCriacaoOrdemServico',  header: 'Data de criação'},
    ];

    customOptions: Object = {};

    userAnaliseUrl: string = this.analiseService.resourceUrl;

    analiseSelecionada: any = new Divergencia();
    analiseTableSelecionada: Divergencia = new Divergencia();
    searchDivergence: SearchGroup = new SearchGroup();
    nomeSistemas: Array<Sistema>;
    usuariosOptions: User[] = [];
    organizations: Array<Organizacao>;
    teams: TipoEquipe[];
    equipeShare;
    analiseTemp: Divergencia = new Divergencia();
    tipoEquipesLoggedUser: TipoEquipe[] = [];
    tipoEquipesToClone: TipoEquipe[] = [];
    query: String;
    usuarios: String[] = [];
    lstStatus: Status[] = [];
    idAnaliseCloneToEquipe: number;
    public equipeToClone?: TipoEquipe;

    translateSusbscriptions: Subscription[] = [];

    metsContagens = [
        {label: 'Detalhada', value: 'DETALHADA'},
        {label: 'Indicativa', value: 'INDICATIVA'},
        {label: 'Estimada', value: 'ESTIMADA'}
    ];
    blocked;
    inicial: boolean;
    showDialogAnaliseCloneTipoEquipe = false;
    showDialogAnaliseBlock = false;
    mostrarDialog = false;
    enableTable: Boolean = false;
    notLoadFilterTable = false;
    analisesList: any[] = [];
    isLoadFilter = true;
    constructor(
        private router: Router,
        private sistemaService: SistemaService,
        private analiseService: DivergenciaService,
        private tipoEquipeService: TipoEquipeService,
        private organizacaoService: OrganizacaoService,
        private pageNotificationService: PageNotificationService,
        private equipeService: TipoEquipeService,
        private blockUiService: BlockUiService,
        private statusService: StatusService,
    ) {
    }

    public ngOnInit() {
        this.estadoInicial();
        this.datatable.onLazyLoad.subscribe((event: LazyLoadEvent) => this.loadDirvenceLazy(event));
    }

    getLabel(label) {
        return label;
    }

    estadoInicial() {
        this.recuperarOrganizacoes();
        this.recuperarEquipe();
        this.recuperarSistema();
        this.inicial = false;
    }

    getEquipesFromActiveLoggedUser() {
        this.equipeService.getEquipesActiveLoggedUser().subscribe(res => {
            this.tipoEquipesLoggedUser = res;
        });
    }


    recuperarOrganizacoes() {
        this.organizacaoService.dropDown().subscribe(response => {
            this.organizations = response;
            this.customOptions['organizacao.nome'] = response.map((item) => {
                return {label: item.nome, value: item.id};
              });
        });
    }

    recuperarSistema() {
        this.sistemaService.dropDown().subscribe(response => {
            this.nomeSistemas = response;
            this.customOptions['sistema.nome'] = response.map((item) => {
                return {label: item.nome, value: item.id};
              });
        });
    }


    recuperarEquipe() {
        this.tipoEquipeService.dropDown().subscribe(response => {
            this.teams = response;
            this.tipoEquipesToClone = response;
            const emptyTeam = new TipoEquipe();
            this.tipoEquipesToClone.unshift(emptyTeam);
        });
    }

    recuperarStatus() {
        this.statusService.list().subscribe(response => {
            this.lstStatus = response;
            const emptyStatus = new Status();
            this.lstStatus.unshift(emptyStatus);
        });
    }


    public datatableClick(event: DatatableClickEvent) {
        if (!event.selection) {
            return;
        }
        switch (event.button) {
            case 'edit':
                if (event.selection.bloqueiaAnalise) {
                    this.pageNotificationService.addErrorMessage('Você não pode editar uma análise bloqueada!');
                    return;
                }
                this.router.navigate(['/divergencia', event.selection.id, 'edit']);
                break;
            case 'view':
                this.router.navigate(['/divergencia', event.selection.id, 'view']);
                break;
        }
    }

    public changeUrl() {
        let querySearch = '&isDivergence=true';
        querySearch = querySearch.concat((this.searchDivergence.identificadorAnalise) ?
            `&identificador=*${this.searchDivergence.identificadorAnalise}*` : '');
        querySearch = querySearch.concat((this.searchDivergence.sistema && this.searchDivergence.sistema.id) ?
            `&sistema=${this.searchDivergence.sistema.id}` : '');
        querySearch = querySearch.concat((this.searchDivergence.organizacao && this.searchDivergence.organizacao.id) ?
            `&organizacao=${this.searchDivergence.organizacao.id}` : '');
        return querySearch;
    }
    public limparPesquisa() {
        this.searchDivergence = new SearchGroup();
        sessionStorage.setItem('searchDivergence', JSON.stringify(this.searchDivergence));
        this.event.first = 0;
        this.loadDirvenceLazy(this.event);
    }


    public performSearch() {
        this.enableTable = true ;
        sessionStorage.setItem('searchDivergence', JSON.stringify(this.searchDivergence));
        this.event.first = 0;
        this.loadDirvenceLazy(this.event);
    }

    public desabilitarBotaoRelatorio(): boolean {
        return !this.datatable;
    }

    loadDirvenceLazy(event: LazyLoadEvent) {
        this.blockUiService.show();
        this.event = event;
        event.rows = !event.rows ? 5 : event.rows;
        this.analiseService.search(event, event.rows, false, this.changeUrl()).subscribe(data => {
            this.datatable.totalRecords = parseFloat(data.headers.get('X-Total-Count'));
            this.cars = data.body;
        });
    }

}
