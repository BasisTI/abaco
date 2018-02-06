import { Component, OnInit, Input } from '@angular/core';
import { AnaliseSharedDataService, PageNotificationService } from '../shared';
import { FuncaoTransacao, TipoFuncaoTransacao } from './funcao-transacao.model';
import { Analise } from '../analise';
import { FatorAjuste } from '../fator-ajuste';

import * as _ from 'lodash';
import { Modulo } from '../modulo/index';
import { Funcionalidade } from '../funcionalidade/index';
import { CalculadoraTransacao } from '../analise-shared/calculadora-transacao';
import { SelectItem } from 'primeng/primeng';
import { DatatableClickEvent } from '@basis/angular-components';
import { ConfirmationService } from 'primeng/primeng';
import { ResumoFuncoes } from '../analise-shared/resumo-funcoes';

@Component({
  selector: 'app-analise-funcao-transacao',
  templateUrl: './funcao-transacao-form.component.html'
})
export class FuncaoTransacaoFormComponent implements OnInit {

  funcaoTransacaoEmEdicao: FuncaoTransacao;
  resumo: ResumoFuncoes;

  fatoresAjuste: FatorAjuste[] = [];

  classificacoes: SelectItem[] = [];

  constructor(
    private analiseSharedDataService: AnaliseSharedDataService,
    private confirmationService: ConfirmationService,
    private pageNotificationService: PageNotificationService
  ) { }

  ngOnInit() {
    this.currentFuncaoTransacao = new FuncaoTransacao();
    const classificacoes = Object.keys(TipoFuncaoTransacao).map(k => TipoFuncaoTransacao[k as any]);
    // TODO pipe generico?
    classificacoes.forEach(c => {
      this.classificacoes.push({ label: c, value: c});
    });
  }

  get currentFuncaoTransacao(): FuncaoTransacao {
    return this.analiseSharedDataService.currentFuncaoTransacao;
  }

  set currentFuncaoTransacao(currentFuncaoTransacao: FuncaoTransacao) {
    this.analiseSharedDataService.currentFuncaoTransacao = currentFuncaoTransacao;
  }

  get funcoesTransacoes(): FuncaoTransacao[] {
    if (!this.analise.funcaoTransacaos) {
      return [];
    }
    return this.analise.funcaoTransacaos;
  }

  private get analise(): Analise {
    return this.analiseSharedDataService.analise;
  }

  private set analise(analise: Analise) {
    this.analiseSharedDataService.analise = analise;
  }

  private get manual() {
    if (this.analiseSharedDataService.analise.contrato) {
      return this.analiseSharedDataService.analise.contrato.manual;
    }
    return undefined;
  }

  isContratoSelected(): boolean {
    // FIXME p-dropdown requer 2 clicks quando o [options] chama um método get()
    const isContratoSelected = this.analiseSharedDataService.isContratoSelected();
    if (isContratoSelected && this.fatoresAjuste.length === 0) {
      this.fatoresAjuste = this.manual.fatoresAjuste;
    }

    return isContratoSelected;
  }

  fatoresAjusteDropdownPlaceholder() {
    if (this.isContratoSelected()) {
      return 'Valor de Ajuste';
    } else {
      return `Valor de Ajuste - Selecione um Contrato na aba 'Geral' para carregar os Valores de Ajuste`;
    }
  }

  moduloSelected(modulo: Modulo) {
  }

  funcionalidadeSelected(funcionalidade: Funcionalidade) {
    this.currentFuncaoTransacao.funcionalidade = funcionalidade;
  }

  isFuncionalidadeSelected(): boolean {
    return !_.isUndefined(this.currentFuncaoTransacao.funcionalidade);
  }

  deveHabilitarBotaoAdicionar(): boolean {
    // TODO complementar com outras validacoes
    // TODO verificar se tem tipoContagem selecionado
    return this.isFuncionalidadeSelected();
  }

  adicionar() {
    if (this.deveHabilitarBotaoAdicionar()) {
      this.doAdicionar();
    }
  }

  private doAdicionar() {
    const funcaoTransacaoCalculada = CalculadoraTransacao.calcular(this.analise.tipoContagem, this.currentFuncaoTransacao);
    this.analise.addFuncaoTransacao(funcaoTransacaoCalculada);
    this.resumo = this.analise.resumoFuncaoTransacoes;
    this.pageNotificationService.addCreateMsgWithName(funcaoTransacaoCalculada.name);

    this.currentFuncaoTransacao = this.currentFuncaoTransacao.clone();
    this.currentFuncaoTransacao.artificialId = undefined;
  }

}
