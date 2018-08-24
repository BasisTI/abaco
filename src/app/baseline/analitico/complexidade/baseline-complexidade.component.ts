import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BaselineService} from '../../baseline.service';
import {Subscription} from '../../../../../node_modules/rxjs/Rx';


@Component({
  selector: 'app-baseline-complexidade',
  templateUrl: './baseline-complexidade.component.html'
})
export class BaselineComplexidadeComponent implements OnInit, OnDestroy {

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
