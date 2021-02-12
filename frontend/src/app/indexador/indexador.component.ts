import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IndexadorService } from './indexador.service';
import { BlockUiService } from '@nuvem/angular-base';


@Component({
    selector: 'app-indexador',
    templateUrl: './indexador.component.html',
    providers: [IndexadorService]
})
export class IndexadorComponent {

    public indexToReindexar: string[];
    indexList = [
        { value: 'ALR', label: 'Alr' },//Adicionei
        { value: 'ANALISE', label: 'Analise' },
        //{value: 'BASELINE_ANALITICO_FD', label: 'Baseline Analítico FD'},// (NPE) NullPointerException
        //{value: 'BASELINE_ANALITICO_FT', label: 'Baseline Analítico FT'},// (NPE)
        //{value: 'BASELINE_SINTETICO', label: 'Baseline Sintético'},// (NPE)
        //{value: 'COMPARTILHADA', label: 'Compartilhada'},// (NPE)
        { value: 'CONTRATO', label: 'Contrato' },
        { value: 'DER', label: 'Der' },
        //{value: 'DIVERGENCE_COMMENT_FUNCAO_DADOS', label: 'Divergence comment função de dados'},// (NPE)
        //{value: 'DIVERGENCE_COMMENT_FUNCAO_TRANSACAO', label: 'Divergence comment função de transação'},// (NPE)
        { value: 'ESFORCO_FASE', label: 'Esforço de Fase' },
        //{value: 'FASE', label: 'Fase'},// (NPE)
        { value: 'FATOR_AJUSTE', label: 'Fator de Ajuste' },
        { value: 'FUNCAO_DADOS', label: 'Função de Dados' },
        { value: 'FUNCAO_TRANSACAO', label: 'Função de Transação' },
        { value: 'FUNCIONALIDADE', label: 'Funcionalidade' },
        { value: 'MANUAL', label: 'Manual' },
        { value: 'MANUAL_CONTRATO', label: 'Manual Contrato' },
        { value: 'MODULO', label: 'Modulo' },
        { value: 'NOMENCLATURA', label: 'Nomenclatura' },
        { value: 'ORGANIZACAO', label: 'Organização' },
        //{value: 'PE_ANALITICO', label: 'PE Analítico'},// (NPE)
        { value: 'RLR', label: 'Rlr' },
        { value: 'SISTEMA', label: 'Sistema' },
        { value: 'STATUS', label: 'Status' },
        { value: 'TIPO_EQUIPE', label: 'Tipo Equipe' },
        { value: 'USER', label: 'Usuário' },
        //{value: 'VW_FUNCAO_DADOS', label: 'VW Função de Dados'},// (NPE)
        //{value: 'VW_FUNCAO_TRANSACAO', label: 'VW Função de Transação'}// (NPE)
    ];

    constructor(
        private indexadorSearchService: IndexadorService,
        private router: Router,
        private blockUiService: BlockUiService,
    ) { }


    submitIndexador() {
        if (!this.indexToReindexar) {
            return;
        }
        this.blockUiService.show();
        this.indexadorSearchService.reindexar(this.indexToReindexar)
            .subscribe(
                response => { },
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
