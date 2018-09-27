import {Component, AfterViewInit, ViewChild, OnInit} from '@angular/core';
import {ElasticQuery, PageNotificationService, ResponseWrapper} from '../../shared';
import {DatatableClickEvent, DatatableComponent} from '@basis/angular-components';
import {Router} from '@angular/router';
import {SistemaService} from '../../sistema/sistema.service';
import {ConfirmationService} from '../../../../node_modules/primeng/primeng';
import {OrganizacaoService} from '../../organizacao/organizacao.service';
import {StringConcatService} from '../../shared/string-concat.service';
import {Organizacao} from '../../organizacao/organizacao.model';
import {BaselineService} from '../baseline.service';
import {BaselineSintetico} from '../baseline-sintetico.model';
import {Sistema} from '../../sistema';
import {BaselineAnalitico} from '../baseline-analitico.model';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'jhi-baseline',
    templateUrl: './baseline.component.html'
})
export class BaselineComponent implements OnInit {

    elasticQuery: ElasticQuery = new ElasticQuery();
    @ViewChild(DatatableComponent) datatable: DatatableComponent;
    rowsPerPageOptions: number[] = [5, 10, 20];
    public urlBaseLineSintetico;
    selecionada : boolean;

    constructor (
        private router: Router,
        private baselineService: BaselineService,
    ) {
    }

    ngOnInit(): void {
        this.urlBaseLineSintetico = this.baselineService.sinteticosUrl;
        this.carregarDataTable();
        this.datatable.pDatatableComponent.onRowSelect.subscribe((event) => {
            this.selecionada = false;
        });
        this.datatable.pDatatableComponent.onRowUnselect.subscribe((event) => {
            this.selecionada = true;
        });
    }

    public carregarDataTable() {
        this.baselineService.allBaselineSintetico().subscribe((res: ResponseWrapper) => {
            this.datatable.value = res.json;
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
            case 'geraBaselinePdfBrowser' :
                this.geraBaselinePdfBrowser(event.selection.idsistema);
                break;
        }
    }

    public geraBaselinePdfBrowser(id) {
        this.baselineService.geraBaselinePdfBrowser(id);
    }


}
