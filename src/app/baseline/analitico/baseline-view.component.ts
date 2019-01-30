import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {ResponseWrapper} from '../../shared';
import {ActivatedRoute, Router} from '@angular/router';
import {BaselineService} from '../baseline.service';
import {Subscription} from '../../../../node_modules/rxjs';
import {DatatableComponent} from '@basis/angular-components';


@Component({
  selector: 'jhi-baseline-view',
  templateUrl: './baseline-view.component.html'
})
export class BaselineViewComponent implements OnInit, OnDestroy {

    private routeSub: Subscription;
    public idSistema: number;

    searchUrlFD: string = this.baselineService.analiticosFDUrl;
    searchUrlFT: string = this.baselineService.analiticosFTUrl;

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

    }

}
