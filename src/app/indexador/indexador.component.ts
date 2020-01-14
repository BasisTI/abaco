import {TranslateService} from '@ngx-translate/core';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Rx';
import {IndexadorService} from './indexador.service';


@Component({
    templateUrl: './indexador.component.html'
})
export class IndexadorComponent implements OnInit, OnDestroy {

    private subscription: Subscription;
    public indexToReindexar: string[];
    indexList = [
        {value: 'ESFORCO_FASE', label: 'Esforço de Fase'},
        {value: 'MANUAL_CONTRATO', label: 'Manual Contrato'},
        {value: 'ORGANIZACAO', label: 'Organização'},
        {value: 'ALR', label: 'Alr'},
        {value: 'SISTEMA', label: 'Sistema'},
        {value: 'FUNCIONALIDADE', label: 'Funcionalidade'},
        {value: 'CONTRATO', label: 'Contrato'},
        {value: 'MANUAL', label: 'Manual'},
        {value: 'TIPO_EQUIPE', label: 'Tipo Equipe'},
        {value: 'FATOR_AJUSTE', label: 'Fator de Ajuste'},
        {value: 'DER', label: 'Der'},
        {value: 'ANALISE', label: 'Analise'},
        {value: 'RLR', label: 'Rlr'},
        {value: 'FUNCAO_DADOS', label: 'Funcao de Dados'},
        {value: 'USER', label: 'User'},
        {value: 'MODULO', label: 'Modulo'},
        {value: 'FUNCAO_TRANSACAO', label: 'Função de Transação'}];

    constructor(
        private indexadorSearchService: IndexadorService,
        private route: ActivatedRoute,
        private router: Router,
        private translate: TranslateService
    ) {
    }

    ngOnInit() {
    }

    submitIndexador() {
        this.indexadorSearchService.reindexar(this.indexToReindexar).subscribe(
            err => console.log('HTTP Error', err),
            () => console.log('HTTP request completed.'));
    }

    ngOnDestroy() {
    }

    public return() {
        this.router.navigate(['/']);
    }
}
