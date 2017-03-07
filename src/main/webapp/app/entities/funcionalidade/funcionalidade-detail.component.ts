import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { Funcionalidade } from './funcionalidade.model';
import { FuncionalidadeService } from './funcionalidade.service';

@Component({
    selector: 'jhi-funcionalidade-detail',
    templateUrl: './funcionalidade-detail.component.html'
})
export class FuncionalidadeDetailComponent implements OnInit, OnDestroy {

    funcionalidade: Funcionalidade;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private funcionalidadeService: FuncionalidadeService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['funcionalidade']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.funcionalidadeService.find(id).subscribe(funcionalidade => {
            this.funcionalidade = funcionalidade;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
