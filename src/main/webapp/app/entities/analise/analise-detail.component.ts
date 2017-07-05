import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { Analise } from './analise.model';
import { AnaliseService } from './analise.service';

@Component({
    selector: 'jhi-analise-detail',
    templateUrl: './analise-detail.component.html'
})
export class AnaliseDetailComponent implements OnInit, OnDestroy {

    analise: Analise;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private analiseService: AnaliseService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['analise', 'metodoContagem', 'tipoAnalise']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.analiseService.find(id).subscribe(analise => {
            this.analise = analise;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
