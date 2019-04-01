import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {ResponseWrapper} from '../../../shared/index';
import {ActivatedRoute, Router} from '@angular/router';
import {BaselineService} from '../../baseline.service';
import {Subscription} from '../../../../../node_modules/rxjs/Rx';
import {DatatableComponent} from '@basis/angular-components';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'jhi-baseline-impacto',
  templateUrl: './baseline-impacto.component.html'
})
export class BaselineImpactoComponent implements OnInit, OnDestroy {

    private routeSub: Subscription;
    public idSistema: number;

    constructor (
        private route: ActivatedRoute,
        private router: Router,
        private baselineService: BaselineService,
        private translate: TranslateService
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
