import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { FuncaoTransacao } from './funcao-transacao.model';
import { FuncaoTransacaoService } from './funcao-transacao.service';

@Component({
    selector: 'jhi-funcao-transacao-detail',
    templateUrl: './funcao-transacao-detail.component.html'
})
export class FuncaoTransacaoDetailComponent implements OnInit, OnDestroy {

    funcaoTransacao: FuncaoTransacao;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private funcaoTransacaoService: FuncaoTransacaoService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['funcaoTransacao', 'tipoFuncaoTransacao', 'complexidade']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.funcaoTransacaoService.find(id).subscribe(funcaoTransacao => {
            this.funcaoTransacao = funcaoTransacao;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
