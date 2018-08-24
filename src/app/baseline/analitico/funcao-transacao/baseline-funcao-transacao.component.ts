import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {ResponseWrapper} from '../../../shared/index';
import {ActivatedRoute, Router} from '@angular/router';
import {BaselineService} from '../../baseline.service';
import {Subscription} from '../../../../../node_modules/rxjs/Rx';
import {DatatableComponent} from '@basis/angular-components';


@Component({
  selector: 'jhi-baseline-funcao-transacao',
  templateUrl: './baseline-funcao-transacao.component.html'
})
export class BaselineFuncaoTransacaoComponent implements OnInit, OnDestroy {

    private routeSub: Subscription;
    public idSistema: number;
    rowsPerPageOptionsFT: number[] = [5, 10, 20];
    @ViewChild(DatatableComponent) datatable: DatatableComponent;

    constructor (
        private route: ActivatedRoute,
        private router: Router,
        private baselineService: BaselineService,
    ) {
    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.routeSub = this.route.params.subscribe(params => {
            this.idSistema = params['id'];
        });
        this.carregarDataTable();
    }

    public carregarDataTable() {
        this.baselineService.baselineAnaliticoFT(this.idSistema).subscribe((res: ResponseWrapper) => {
            this.datatable.value = res.json;
        });
    }

}
