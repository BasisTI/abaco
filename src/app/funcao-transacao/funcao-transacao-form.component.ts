import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
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
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-analise-funcao-transacao',
  templateUrl: './funcao-transacao-form.component.html'
})
export class FuncaoTransacaoFormComponent implements OnInit, OnDestroy {

  isEdit: boolean;

  funcaoTransacaoEmEdicao: FuncaoTransacao;
  resumo: ResumoFuncoes;

  fatoresAjuste: FatorAjuste[] = [];

  classificacoes: SelectItem[] = [];

  private analiseCarregadaSubscription: Subscription;

  constructor(
    private analiseSharedDataService: AnaliseSharedDataService,
    private confirmationService: ConfirmationService,
    private pageNotificationService: PageNotificationService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.currentFuncaoTransacao = new FuncaoTransacao();
    this.subscribeToAnaliseCarregada();
    this.initClassificacoes();
  }

  private subscribeToAnaliseCarregada() {
    this.analiseCarregadaSubscription = this.analiseSharedDataService.getLoadSubject().subscribe(() => {
      this.atualizaResumo();
    });
  }

  private atualizaResumo() {
    this.resumo = this.analise.resumoFuncaoTransacoes;
    this.changeDetectorRef.detectChanges();
  }

  private initClassificacoes() {
    const classificacoes = Object.keys(TipoFuncaoTransacao).map(k => TipoFuncaoTransacao[k as any]);
    // TODO pipe generico?
    classificacoes.forEach(c => {
      this.classificacoes.push({ label: c, value: c });
    });
  }

  get header(): string {
    return !this.isEdit ? 'Adicionar Função de Transação' : 'Alterar Função de Transação';
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
      return 'Selecione um Valor de Ajuste';
    } else {
      return `Selecione um Contrato na aba 'Geral' para carregar os Valores de Ajuste`;
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
    return this.isFuncionalidadeSelected() && !_.isUndefined(this.analise.tipoContagem);
  }

  get labelBotaoAdicionar() {
    return !this.isEdit ? 'Adicionar' : 'Alterar';
  }

  adicionar() {
    if (this.deveHabilitarBotaoAdicionar()) {
      this.adicionarOuSalvar();
    }
  }

  private adicionarOuSalvar() {
    if (this.isEdit) {
      this.doEditar();
    } else {
      this.doAdicionar();
    }
    this.isEdit = false;
  }

  private doEditar() {
    const funcaoDadosCalculada = CalculadoraTransacao.calcular(this.analise.tipoContagem, this.currentFuncaoTransacao);
    // TODO temporal coupling
    this.analise.updateFuncaoTransacao(funcaoDadosCalculada);
    this.atualizaResumo();
    this.pageNotificationService.addSuccessMsg(`Função de dados '${funcaoDadosCalculada.name}' alterada com sucesso`);
    this.resetarEstadoPosSalvar();
  }

  private resetarEstadoPosSalvar() {
    // Mantendo o mesmo conteudo a pedido do Leandro
    this.currentFuncaoTransacao = this.currentFuncaoTransacao.clone();

    // TODO inappropriate intimacy DEMAIS
    this.currentFuncaoTransacao.artificialId = undefined;
    this.currentFuncaoTransacao.id = undefined;
  }

  private doAdicionar() {
    const funcaoTransacaoCalculada = CalculadoraTransacao.calcular(this.analise.tipoContagem, this.currentFuncaoTransacao);
    // TODO temporal coupling entre 1-add() e 2-atualizaResumo(). 2 tem que ser chamado depois
    this.analise.addFuncaoTransacao(funcaoTransacaoCalculada);
    this.atualizaResumo();
    this.pageNotificationService.addCreateMsgWithName(funcaoTransacaoCalculada.name);
    this.resetarEstadoPosSalvar();
  }

  datatableClick(event: DatatableClickEvent) {
    if (!event.selection) {
      return;
    }

    const funcaoSelecionada: FuncaoTransacao = event.selection.clone();
    switch (event.button) {
      case 'edit':
        this.isEdit = true;
        this.prepararParaEdicao(funcaoSelecionada);
        break;
      case 'delete':
        this.funcaoTransacaoEmEdicao = funcaoSelecionada;
        this.confirmDelete();
    }
  }

  private prepararParaEdicao(funcaoSelecionada: FuncaoTransacao) {
    this.analiseSharedDataService.currentFuncaoTransacao = funcaoSelecionada;
    this.scrollParaInicioDaAba();
    this.carregarValoresNaPaginaParaEdicao(funcaoSelecionada);
    this.pageNotificationService.addInfoMsg(`Alterando Função de Transação '${funcaoSelecionada.name}'`);
  }

  private scrollParaInicioDaAba() {
    window.scrollTo(0, 60);
  }

  private carregarValoresNaPaginaParaEdicao(funcaoSelecionada: FuncaoTransacao) {
    this.analiseSharedDataService.funcaoAnaliseCarregada();
    this.carregarFatorDeAjusteNaEdicao(funcaoSelecionada);
    this.carregarDerRlr(funcaoSelecionada);
  }

  // TODO mudar em todas as abas para Fator De Ajuste (assim que tá no manual)
  private carregarFatorDeAjusteNaEdicao(funcaoSelecionada: FuncaoTransacao) {
    this.fatoresAjuste = this.manual.fatoresAjuste;
    funcaoSelecionada.fatorAjuste = _.find(this.fatoresAjuste, { 'id': funcaoSelecionada.fatorAjuste.id });
  }

  private carregarDerRlr(funcaoDadosSelecionada: FuncaoTransacao) {
    // TODO investigar quando der e rlr estao sendo salvos no banco
    // acho que quando a complexidade é 'SEM' os valores são zerados
  }

  cancelarEdicao() {
    this.analiseSharedDataService.funcaoAnaliseDescarregada();
    this.isEdit = false;
    this.currentFuncaoTransacao = new FuncaoTransacao();
    this.pageNotificationService.addInfoMsg('Alteração de Função de Transação cancelada');
    this.scrollParaInicioDaAba();
  }

  confirmDelete() {
    const name: string = this.funcaoTransacaoEmEdicao.name;
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir a Função de Transação '${name}'?`,
      accept: () => {
        this.analise.deleteFuncaoTransacao(this.funcaoTransacaoEmEdicao);
        this.pageNotificationService.addDeleteMsgWithName(name);
      }
    });
  }

  ngOnDestroy() {
    this.changeDetectorRef.detach();
    this.analiseCarregadaSubscription.unsubscribe();
  }

}
