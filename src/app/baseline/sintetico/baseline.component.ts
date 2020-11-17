import { IndexadorService } from './../../indexador/indexador.service';
import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SistemaService } from '../../sistema/sistema.service';
import { BaselineService } from '../baseline.service';
import { Sistema } from '../../sistema';
import { ElasticQuery } from 'src/app/shared/elastic-query';
import { DatatableComponent, DatatableClickEvent, PageNotificationService } from '@nuvem/primeng-components';
import { ResponseWrapper } from 'src/app/shared';
import { ConfirmationService } from 'primeng';
import { BaselineSintetico } from '../baseline-sintetico.model';

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
    sistema?: Sistema = new Sistema();
    sistemaUpdate?: Sistema = new Sistema();
    urlBaseline: string;
    enableTable = false ;
    lstBasilineSintetico: BaselineSintetico[];
    showUpdateBaseline: boolean = false;

    constructor(
        private router: Router,
        private baselineService: BaselineService,
        private sistemaService: SistemaService,
        private pageNotificationService: PageNotificationService,
    ) {
    }

    getLabel(label) {
        return label;
    }

    ngOnInit(): void {
        this.recuperarSistema();
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
        if (!event.selection) {
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
        if (this.datatable) {
            this.datatable.filterParams['sistema'] = this.sistema.id;
            this.datatable.reset();
        }
    }
    public atualizarBaseline() {
        this.showUpdateBaseline = true;
    }
    public updateBaseline(sistema: Sistema) {
        if (!sistema) {
            this.pageNotificationService.addErrorMessage(
                this.getLabel('Somente administradores podem bloquear/desbloquear análises!')
            );
            return;
        }
        this.baselineService.updateBaselineSintetico(sistema).subscribe((res) => {
            this.showUpdateBaseline = false;
            this.sistema = sistema;
            this.sistemaUpdate =  new Sistema();
            this.performSearch();
        });
    }
}
