import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Rx';

import {TipoFase} from './tipo-fase.model';
import {TipoFaseService} from './tipo-fase.service';

@Component({
    selector: 'jhi-tipo-fase-detail',
    templateUrl: './tipo-fase-detail.component.html'
})
export class TipoFaseDetailComponent implements OnInit, OnDestroy {

    public tipoFase: TipoFase;
    private subscription: Subscription;

    constructor(
        private tipoFaseService: TipoFaseService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
    }

    load(id) {
        this.tipoFaseService.find(id).subscribe((tipoFase) => {
            this.tipoFase = tipoFase;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
