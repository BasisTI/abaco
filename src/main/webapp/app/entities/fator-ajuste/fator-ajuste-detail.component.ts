import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { FatorAjuste } from './fator-ajuste.model';
import { FatorAjusteService } from './fator-ajuste.service';

@Component({
    selector: 'jhi-fator-ajuste-detail',
    templateUrl: './fator-ajuste-detail.component.html'
})
export class FatorAjusteDetailComponent implements OnInit, OnDestroy {

    fatorAjuste: FatorAjuste;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private fatorAjusteService: FatorAjusteService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['fatorAjuste', 'tipoFatorAjuste', 'impactoFatorAjuste']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.fatorAjusteService.find(id).subscribe(fatorAjuste => {
            this.fatorAjuste = fatorAjuste;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
