import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DatatableComponent } from '@basis/angular-components';
import { ActivatedRoute } from '@angular/router';
import { BaselineService } from '../..';


@Component({
    selector: 'jhi-baseline-funcao-dados',
    templateUrl: './baseline-funcao-dados.component.html'
})
export class BaselineFuncaoDadosComponent implements OnInit {

    rowsPerPageOptionsFD: number[] = [5, 10, 20];
    @ViewChild(DatatableComponent) datatableFD: DatatableComponent;

    public idSistema: number;
    public idEquipe: number;
    public urlFd: string;

    constructor(
        private route: ActivatedRoute,
        private baselineService: BaselineService,
        private translate: TranslateService
    ) {
    }

    getLabel(label) {
        let str: any;
        this.translate.get(label).subscribe((res: string) => {
            str = res;
        }).unsubscribe();
        return str;
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.idSistema = params['id'];
            this.idEquipe = params['equipe'];
        });
        this.urlFd = `${this.baselineService.analiticosFDUrl}${this.idSistema}/equipe/${this.idEquipe}`;
    }

}
