import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { Analise, AnaliseService } from '../../analise';
import { ResponseWrapper, AnaliseSharedDataService } from '../../shared';
import { Observable } from 'rxjs/Observable';

import * as _ from 'lodash';

@Component({
  selector: 'app-analise-botao-salvar',
  templateUrl: './analise-botao-salvar-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnaliseBotaoSalvarComponent {

  motivosBotaoDesabilitado: Set<string> = new Set<string>();

  constructor(
    private analiseService: AnaliseService,
    private analiseSharedDataService: AnaliseSharedDataService,
  ) { }

  habilitarBotaoSalvar() {
    return this.checarSeDeveHabilitarBotaoEConstruirMotivos();
  }

  checarSeDeveHabilitarBotaoEConstruirMotivos(): boolean {
    let deveHabilitar = true;
    this.motivosBotaoDesabilitado.clear();
    if (this.nenhumaFuncaoAdicionada()) {
      this.motivosBotaoDesabilitado.add('Cadastre ao menos uma Função de Dados ou Função Transação');
      deveHabilitar = false;
    }
    return deveHabilitar;
  }

  private nenhumaFuncaoAdicionada() {
    const analise: Analise = this.analise;
    return this.isArrayEmpty(analise.funcaoDados) && this.isArrayEmpty(analise.funcaoTransacaos);
  }

  private isArrayEmpty(array: Array<any>) {
    return _.isUndefined(array) || array.length === 0;
  }

  motivosDesabilitar(): string {
    return _.join(Array.from(this.motivosBotaoDesabilitado), '\n');
  }

  private get analise(): Analise {
    return this.analiseSharedDataService.analise;
  }

  private set analise(analise: Analise) {
    this.analiseSharedDataService.analise = analise;
  }

  salvar() {
    this.doSalvar();
    this.analiseSharedDataService.analiseSalva();
  }

  // Sendo feito aqui, e não no AnaliseSharedDataService, para evitar problema com dependencias circulares
  private doSalvar() {
    // TODO extrair 'isEdit' boolean para sharedservice
    if (this.analise.id !== undefined) {
      this.editar();
    } else {
      this.cadastrar();
    }
  }

  private editar() {

  }

  private cadastrar() {
    this.subscribeToSaveResponse(this.analiseService.create(this.analise));
  }

  private subscribeToSaveResponse(result: Observable<any>) {
    result.subscribe((res: Analise) => {
      this.analise = res;
      // TODO mensagem de confirmação
    });
  }

}
