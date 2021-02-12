import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BaselineService} from '../baseline.service';
import {Subscription} from '../../../../node_modules/rxjs';
import { BaselineSintetico } from '..';


@Component({
  selector: 'jhi-baseline-view',
  templateUrl: './baseline-view.component.html'
})
export class BaselineViewComponent implements OnInit, OnDestroy {

    private routeSub: Subscription;
    public idSistema: number;
    public idEquipe: number;

    public sistema: BaselineSintetico = new BaselineSintetico();

    constructor (
        private route: ActivatedRoute,
        private router: Router,
        private baselineService: BaselineService,
    ) {
    }

    getLabel(label) {
        return label;
    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.routeSub = this.route.params.subscribe(params => {
            this.idSistema = params['id'];
            this.idEquipe = params['equipe'];
            this.carregarSistema();
        });

    }

    public carregarSistema() {
        this.baselineService.getSistemaSinteticoEquipe(this.idSistema, this.idEquipe).subscribe((res: BaselineSintetico) => {
            this.sistema = res;
        });
    }

}
