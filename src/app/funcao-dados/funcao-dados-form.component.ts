import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AnaliseSharedDataService, PageNotificationService } from '../shared';
import { FuncaoDados } from './funcao-dados.model';
import { Analise } from '../analise';
import { FatorAjuste } from '../fator-ajuste';

import * as _ from 'lodash';
import { Modulo } from '../modulo/index';
import { Funcionalidade } from '../funcionalidade/index';
import { SelectItem } from 'primeng/primeng';
import { Calculadora } from '../analise-shared/calculadora';
import { DatatableClickEvent } from '@basis/angular-components';
import { ConfirmationService } from 'primeng/primeng';
import { ResumoFuncoes } from '../analise-shared/resumo-funcoes';
import { AfterViewInit, AfterContentInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-analise-funcao-dados',
  templateUrl: './funcao-dados-form.component.html'
})
export class FuncaoDadosFormComponent implements OnInit, OnDestroy {

  isEdit: boolean;

  funcaoDadosEmEdicao: FuncaoDados;
  resumo: ResumoFuncoes;

  fatoresAjuste: FatorAjuste[] = [];

  // FIXME considerar o enum
  classificacoes: SelectItem[] = [
    { label: 'ALI', value: 'ALI' },
    { label: 'AIE', value: 'AIE' }
  ];

  private analiseCarregadaSubscription: Subscription;

  constructor(
    private analiseSharedDataService: AnaliseSharedDataService,
    private confirmationService: ConfirmationService,
    private pageNotificationService: PageNotificationService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.isEdit = false;
    this.currentFuncaoDados = new FuncaoDados();
    this.subscribeToAnaliseCarregada();
  }

  private subscribeToAnaliseCarregada() {
    this.analiseCarregadaSubscription = this.analiseSharedDataService.getLoadSubject().subscribe(() => {
      this.atualizaResumo();
    });
  }

  private atualizaResumo() {
    this.resumo = this.analise.resumoFuncaoDados;
    this.changeDetectorRef.detectChanges();
  }

  get header(): string {
    return !this.isEdit ? 'Adicionar Função de Dados' : 'Alterar Função de Dados';
  }

  get currentFuncaoDados(): FuncaoDados {
    return this.analiseSharedDataService.currentFuncaoDados;
  }

  set currentFuncaoDados(currentFuncaoDados: FuncaoDados) {
    this.analiseSharedDataService.currentFuncaoDados = currentFuncaoDados;
  }

  get funcoesDados(): FuncaoDados[] {
    if (!this.analise.funcaoDados) {
      return [];
    }
    return this.analise.funcaoDados;
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
    this.currentFuncaoDados.funcionalidade = funcionalidade;
  }

  isFuncionalidadeSelected(): boolean {
    return !_.isUndefined(this.currentFuncaoDados.funcionalidade);
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
    const funcaoDadosCalculada = Calculadora.calcular(this.analise.tipoContagem, this.currentFuncaoDados);
    // TODO temporal coupling
    this.analise.updateFuncaoDados(funcaoDadosCalculada);
    this.atualizaResumo();
    this.pageNotificationService.addSuccessMsg(`Função de dados '${funcaoDadosCalculada.name}' alterada com sucesso`);
    this.resetarEstadoPosSalvar();
  }

  private resetarEstadoPosSalvar() {
    // Mantendo o mesmo conteudo a pedido do Leandro
    this.currentFuncaoDados = this.currentFuncaoDados.clone();

    // TODO inappropriate intimacy DEMAIS
    this.currentFuncaoDados.artificialId = undefined;
    this.currentFuncaoDados.id = undefined;
  }

  private doAdicionar() {
    const funcaoDadosCalculada = Calculadora.calcular(this.analise.tipoContagem, this.currentFuncaoDados);
    // TODO temporal coupling entre 1-add() e 2-atualizaResumo(). 2 tem que ser chamado depois
    this.analise.addFuncaoDados(funcaoDadosCalculada);
    this.atualizaResumo();
    this.pageNotificationService.addCreateMsgWithName(funcaoDadosCalculada.name);
    this.resetarEstadoPosSalvar();
  }

  datatableClick(event: DatatableClickEvent) {
    if (!event.selection) {
      return;
    }

    const funcaoDadosSelecionada: FuncaoDados = event.selection.clone();
    switch (event.button) {
      case 'edit':
        this.isEdit = true;
        this.prepararParaEdicao(funcaoDadosSelecionada);
        break;
      case 'delete':
        this.funcaoDadosEmEdicao = funcaoDadosSelecionada;
        this.confirmDelete();
    }
  }

  private prepararParaEdicao(funcaoDadosSelecionada: FuncaoDados) {
    this.analiseSharedDataService.currentFuncaoDados = funcaoDadosSelecionada;
    this.scrollParaInicioDaAba();
    this.carregarValoresNaPaginaParaEdicao(funcaoDadosSelecionada);
    this.pageNotificationService.addInfoMsg(`Alterando Função de Dados '${funcaoDadosSelecionada.name}'`);
  }

  private scrollParaInicioDaAba() {
    window.scrollTo(0, 60);
  }

  private carregarValoresNaPaginaParaEdicao(funcaoDadosSelecionada: FuncaoDados) {
    this.analiseSharedDataService.funcaoAnaliseCarregada();
    this.carregarFatorDeAjusteNaEdicao(funcaoDadosSelecionada);
    this.carregarDerRlr(funcaoDadosSelecionada);
  }

  // TODO mudar em todas as abas para Fator De Ajuste (assim que tá no manual)
  private carregarFatorDeAjusteNaEdicao(funcaoDadosSelecionada: FuncaoDados) {
    this.fatoresAjuste = this.manual.fatoresAjuste;
    funcaoDadosSelecionada.fatorAjuste = _.find(this.fatoresAjuste, { 'id': funcaoDadosSelecionada.fatorAjuste.id });
  }

  private carregarDerRlr(funcaoDadosSelecionada: FuncaoDados) {
    // TODO investigar quando der e rlr estao sendo salvos no banco
    // acho que quando a complexidade é 'SEM' os valores são zerados
  }

  cancelarEdicao() {
    this.analiseSharedDataService.funcaoAnaliseDescarregada();
    this.isEdit = false;
    this.currentFuncaoDados = new FuncaoDados();
    this.pageNotificationService.addInfoMsg('Alteração de Função de Dados cancelada');
    this.scrollParaInicioDaAba();
  }

  confirmDelete() {
    const name: string = this.funcaoDadosEmEdicao.name;
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir a Função de Dados '${name}'?`,
      accept: () => {
        this.analise.deleteFuncaoDados(this.funcaoDadosEmEdicao);
        this.pageNotificationService.addDeleteMsgWithName(name);
      }
    });
  }

  ngOnDestroy() {
    this.changeDetectorRef.detach();
    this.analiseCarregadaSubscription.unsubscribe();
  }

}
