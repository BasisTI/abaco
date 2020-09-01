import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {IndexadorService} from './indexador.service';
import { BlockUiService } from '@nuvem/angular-base';


@Component({
    selector: 'app-indexador',
    templateUrl: './indexador.component.html',
    providers: [IndexadorService]
})
export class IndexadorComponent {

    public indexToReindexar: string[];
    indexList = [
        {value: 'ALR', label: 'Alr'},
        {value: 'ANALISE', label: 'Analise'},
        {value: 'CONTRATO', label: 'Contrato'},
        {value: 'DER', label: 'Der'},
        {value: 'ESFORCO_FASE', label: 'Esforço de Fase'},
        {value: 'FATOR_AJUSTE', label: 'Fator de Ajuste'},
        {value: 'FUNCIONALIDADE', label: 'Funcionalidade'},
        {value: 'FUNCAO_DADOS', label: 'Funcao de Dados'},
        {value: 'FUNCAO_TRANSACAO', label: 'Função de Transação'},
        {value: 'MANUAL', label: 'Manual'},
        {value: 'MANUAL_CONTRATO', label: 'Manual Contrato'},
        {value: 'MODULO', label: 'Modulo'},
        {value: 'ORGANIZACAO', label: 'Organização'},
        {value: 'TIPO_EQUIPE', label: 'Tipo Equipe'},
        {value: 'RLR', label: 'Rlr'},
        {value: 'SISTEMA', label: 'Sistema'},
        {value: 'STATUS', label: 'Status'},
        {value: 'USER', label: 'Usuário'}];

    constructor(
        private indexadorSearchService: IndexadorService,
        private router: Router,
        private blockUiService: BlockUiService,
    ) { }


    submitIndexador() {
        this.blockUiService.show();
        this.indexadorSearchService.reindexar(this.indexToReindexar).subscribe(
            err => console.log('HTTP Error', err),
            () => {
                this.blockUiService.hide();
                console.log('HTTP request completed.');
            });
    }

    public return() {
        this.router.navigate(['/dashboard']);
    }
}
