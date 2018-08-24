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

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'jhi-baseline',
    templateUrl: './baseline.component.html'
})
export class BaselineComponent implements OnInit {

    elasticQuery: ElasticQuery = new ElasticQuery();
    @ViewChild(DatatableComponent) datatable: DatatableComponent;
    rowsPerPageOptions: number[] = [5, 10, 20];
    public baselineSinteticos: BaselineSintetico[];

    constructor (
        private router: Router,
        private sistemaService: SistemaService,
        private baselineService: BaselineService,
        private confirmationService: ConfirmationService,
    ) {
    }

    ngOnInit(): void {
        this.carregarDataTable();
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
                this.router.navigate(['/baseline', event.selection.idsistema]);
                break;
        }
    }


}
