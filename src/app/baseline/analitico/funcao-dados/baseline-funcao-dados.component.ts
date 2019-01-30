import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {ResponseWrapper} from '../../../shared/index';
import {ActivatedRoute, Router} from '@angular/router';
import {BaselineService} from '../../baseline.service';
import {Subscription} from '../../../../../node_modules/rxjs/Rx';
import {DatatableComponent} from '@basis/angular-components';


@Component({
  selector: 'jhi-baseline-funcao-dados',
  templateUrl: './baseline-funcao-dados.component.html'
})
export class BaselineFuncaoDadosComponent implements OnInit, OnDestroy {

    private routeSub: Subscription;
    public idSistema: number;
    public idEquipe: number;

    rowsPerPageOptionsFD: number[] = [5, 10, 20];
    @ViewChild(DatatableComponent) datatable: DatatableComponent;
    searchUrlFD: string = this.baselineService.analiticosFDUrl;


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
            this.idEquipe = params['equipe'];
        });
        this.searchUrlFD += this.idSistema;
        this.carregarDataTable();
    }


    public carregarDataTable() {
        this.baselineService.baselineAnaliticoFDEquipe(this.idSistema, this.idEquipe).subscribe((res: ResponseWrapper) => {
            this.datatable.value = res.json;
        });
    }

}
