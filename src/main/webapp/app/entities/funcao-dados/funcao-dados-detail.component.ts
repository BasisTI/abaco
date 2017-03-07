import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { FuncaoDados } from './funcao-dados.model';
import { FuncaoDadosService } from './funcao-dados.service';

@Component({
    selector: 'jhi-funcao-dados-detail',
    templateUrl: './funcao-dados-detail.component.html'
})
export class FuncaoDadosDetailComponent implements OnInit, OnDestroy {

    funcaoDados: FuncaoDados;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private funcaoDadosService: FuncaoDadosService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['funcaoDados', 'tipoFuncaoDados', 'complexidade']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.funcaoDadosService.find(id).subscribe(funcaoDados => {
            this.funcaoDados = funcaoDados;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
