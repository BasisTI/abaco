import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { EsforcoFase } from './esforco-fase.model';
import { EsforcoFaseService } from './esforco-fase.service';

@Component({
    selector: 'jhi-esforco-fase-detail',
    templateUrl: './esforco-fase-detail.component.html'
})
export class EsforcoFaseDetailComponent implements OnInit, OnDestroy {

    esforcoFase: EsforcoFase;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private esforcoFaseService: EsforcoFaseService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['esforcoFase']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.esforcoFaseService.find(id).subscribe(esforcoFase => {
            this.esforcoFase = esforcoFase;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
