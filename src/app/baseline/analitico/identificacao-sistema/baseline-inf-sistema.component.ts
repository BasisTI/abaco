import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {ResponseWrapper} from '../../../shared/index';
import {ActivatedRoute, Router} from '@angular/router';
import {BaselineService} from '../../baseline.service';
import {Subscription} from '../../../../../node_modules/rxjs/Rx';
import {DatatableComponent} from '@basis/angular-components';
import {BaselineSintetico} from '../../baseline-sintetico.model';
import {Sistema} from '../../../sistema';


@Component({
    selector: 'jhi-baseline-inf-sistema',
    templateUrl: './baseline-inf-sistema.component.html'
})
export class BaselineInfSistemaComponent implements OnInit, OnDestroy {

    public idSistema: number;
    public idEquipe: number;

    public sistema: BaselineSintetico = new BaselineSintetico();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private baselineService: BaselineService,
    ) {
    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.idSistema = params['id'];
            this.idEquipe = params['equipe'];
            this.carregarDataTable();
        });
    }

    public carregarDataTable() {

        this.baselineService.getSistemaSinteticoEquipe(this.idSistema, this.idEquipe).subscribe((res: BaselineSintetico) => {
            this.sistema = res;
        });
    }

}
