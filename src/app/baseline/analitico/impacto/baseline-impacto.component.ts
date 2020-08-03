import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BaselineService} from '../../baseline.service';
import { Subscription } from 'rxjs';


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
