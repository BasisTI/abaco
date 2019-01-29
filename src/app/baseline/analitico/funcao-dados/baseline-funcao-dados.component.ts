import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {DatatableComponent} from '@basis/angular-components';
import { ActivatedRoute } from '@angular/router';
import { BaselineService } from '../..';


@Component({
  selector: 'jhi-baseline-funcao-dados',
  templateUrl: './baseline-funcao-dados.component.html'
})
export class BaselineFuncaoDadosComponent implements OnInit, OnDestroy {

    rowsPerPageOptionsFD: number[] = [5, 10, 20];
    @ViewChild(DatatableComponent) datatable: DatatableComponent;
    
    public idSistema: number;
    public idEquipe: number;
    public urlFd: String;

    constructor (
        private route: ActivatedRoute,
        private baselineService: BaselineService,
    ) {
    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.idSistema = params['id'];
            this.idEquipe = params['equipe'];
        });
        this.urlFd = `${this.baselineService.analiticosFDUrl}${this.idSistema}/equipe/${this.idEquipe}`;
    }

}
