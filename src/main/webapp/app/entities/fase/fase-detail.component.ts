import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { Fase } from './fase.model';
import { FaseService } from './fase.service';

@Component({
    selector: 'jhi-fase-detail',
    templateUrl: './fase-detail.component.html'
})
export class FaseDetailComponent implements OnInit, OnDestroy {

    fase: Fase;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private faseService: FaseService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['fase']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.faseService.find(id).subscribe(fase => {
            this.fase = fase;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
