import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AnaliseSharedDataService, PageNotificationService, ResponseWrapper } from '../shared';
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

import { FatorAjusteLabelGenerator } from '../shared/fator-ajuste-label-generator';
import { DerChipItem } from '../analise-shared/der-chips/der-chip-item';
import { DerChipConverter } from '../analise-shared/der-chips/der-chip-converter';
import { AnaliseReferenciavel } from '../analise-shared/analise-referenciavel';
import { FuncaoDadosService } from './funcao-dados.service';

@Component({
  selector: 'app-analise-funcao-dados',
  templateUrl: './funcao-dados-form.component.html'
})
export class FuncaoDadosFormComponent implements OnInit, OnDestroy {

  isEdit: boolean;

  dersChips: DerChipItem[];

  rlrsChips: DerChipItem[];

  resumo: ResumoFuncoes;

  fatoresAjuste: FatorAjuste[] = [];

  colunasOptions: SelectItem[];

  colunasAMostrar = [];

  showDialogNovo = false;

  private nomeDasFuncoesDoSistema: string[] = [];

  sugestoesAutoComplete: string[] = [];

  // FIXME considerar o enum
  classificacoes: SelectItem[] = [
    { label: 'ALI', value: 'ALI' },
    { label: 'AIE', value: 'AIE' }
  ];

  private analiseCarregadaSubscription: Subscription;
  private subscriptionSistemaSelecionado: Subscription;

  constructor(
    private analiseSharedDataService: AnaliseSharedDataService,
    private confirmationService: ConfirmationService,
    private pageNotificationService: PageNotificationService,
    private changeDetectorRef: ChangeDetectorRef,
    private funcaoDadosService: FuncaoDadosService
  ) {
    const colunas = [
      { header: 'Deflator' },
      { header: 'Módulo' },
      { header: 'Funcionalidade' },
      { header: 'Nome', field: 'name' },
      { header: 'Classificação', field: 'tipo' },
      { header: 'DER (TD)' },
      { header: 'RLR (TR)' },
      { header: 'Complexidade', field: 'complexidade' },
      { header: 'PF Bruto' },
      { header: 'PF Líquido' }
    ];

    this.colunasOptions = colunas.map((col, index) => {
      col['index'] = index;
      return {
        label: col.header,
        value: col,
      };
    });
  }

  ngOnInit() {
    this.isEdit = false;
    this.currentFuncaoDados = new FuncaoDados();
    this.subscribeToAnaliseCarregada();
    this.colunasOptions.map(selectItem => this.colunasAMostrar.push(selectItem.value));
    this.subscribeToSistemaSelecionado();
  }

  private subscribeToAnaliseCarregada() {
    this.analiseCarregadaSubscription = this.analiseSharedDataService.getLoadSubject().subscribe(() => {
      this.atualizaResumo();
      this.carregarNomeDasFuncoesDeDados();
    });
  }

  private atualizaResumo() {
    this.resumo = this.analise.resumoFuncaoDados;
    this.changeDetectorRef.detectChanges();
  }

  private subscribeToSistemaSelecionado() {
    this.subscriptionSistemaSelecionado = this.analiseSharedDataService.getSistemaSelecionadoSubject()
      .subscribe(() => {
        this.carregarNomeDasFuncoesDeDados();
      });
  }

  private carregarNomeDasFuncoesDeDados() {
    const sistemaId: number = this.analiseSharedDataService.analise.sistema.id;
    this.funcaoDadosService.findAllNamesBySistemaId(sistemaId).subscribe(
      nomes => {
        this.nomeDasFuncoesDoSistema = nomes;
        this.sugestoesAutoComplete = nomes.slice();
      });
  }

  autoCompleteNomes(event) {
    const query = event.query;
    // TODO qual melhor método? inclues? startsWith ignore case?
    this.sugestoesAutoComplete = this.nomeDasFuncoesDoSistema
      .filter(nomeFuncao => nomeFuncao.includes(query));
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
      return 'Selecione um Deflator';
    } else {
      return `Selecione um Contrato na aba 'Geral' para carregar os Deflatores`;
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
    return this.isFuncionalidadeSelected() && !_.isUndefined(this.analise.metodoContagem);
  }

  get labelBotaoAdicionar() {
    return !this.isEdit ? 'Adicionar' : 'Alterar';
  }

  adicionar() {
    this.adicionarOuSalvar();
    // this.analise
  }

  private adicionarOuSalvar() {
    this.desconverterChips();
    this.doAdicionarOuSalvar();
    this.isEdit = false;
  }

  private desconverterChips() {
    this.currentFuncaoDados.ders = DerChipConverter.desconverterEmDers(this.dersChips);
    this.currentFuncaoDados.rlrs = DerChipConverter.desconverterEmRlrs(this.rlrsChips);
  }

  private doAdicionarOuSalvar() {
    if (this.isEdit) {
      this.doEditar();
    } else {
      this.doAdicionar();
    }
  }

  private doEditar() {
    const funcaoDadosCalculada = Calculadora.calcular(this.analise.metodoContagem, this.currentFuncaoDados);
    // TODO temporal coupling
    this.analise.updateFuncaoDados(funcaoDadosCalculada);
    this.atualizaResumo();
    this.pageNotificationService.addSuccessMsg(`Função de dados '${funcaoDadosCalculada.name}' alterada com sucesso`);
    this.resetarEstadoPosSalvar();
  }

  // TODO tem que resetar os ids das DERs/RLRs que foram salvas no banco?
  // antes nao precisava pois tudo era persistido no banco como uma string (nao rastreava)
  private resetarEstadoPosSalvar() {
    // Mantendo o mesmo conteudo a pedido do Leandro
    this.currentFuncaoDados = this.currentFuncaoDados.clone();

    // TODO inappropriate intimacy DEMAIS
    this.currentFuncaoDados.artificialId = undefined;
    this.currentFuncaoDados.id = undefined;

    // clonando mas forçando novos a serem persistidos
    this.dersChips.forEach(c => c.id = undefined);
    this.rlrsChips.forEach(c => c.id = undefined);
  }

  private doAdicionar() {
    const funcaoDadosCalculada = Calculadora.calcular(this.analise.metodoContagem, this.currentFuncaoDados);
    // TODO temporal coupling entre 1-add() e 2-atualizaResumo(). 2 tem que ser chamado depois
    this.analise.addFuncaoDados(funcaoDadosCalculada);
    this.atualizaResumo();
    this.pageNotificationService.addCreateMsgWithName(funcaoDadosCalculada.name);
    this.resetarEstadoPosSalvar();
  }

  /**
   * Método responsável por recuperar o nome selecionado no combo.
   * @param nome
   */
  recuperarNomeSelecionado(nome: any) {
    this.funcaoDadosService.recuperarFuncaoDadosPorIdNome(this.analise.sistema.id, nome);

    this.funcaoDadosService.recuperarFuncaoDadosPorIdNome(this.analise.sistema.id, nome).subscribe(
      fd => {
        this.prepararParaEdicao(fd);
      });

    console.log(nome);
  }

  datatableClick(event: DatatableClickEvent) {
    if (!event.selection) {
      return;
    }

    const funcaoDadosSelecionada: FuncaoDados = event.selection.clone();
    switch (event.button) {
      case 'edit':
        this.isEdit = true;
        this.showDialogNovo = true;
        this.prepararParaEdicao(funcaoDadosSelecionada);
        break;
      case 'delete':
        this.confirmDelete(funcaoDadosSelecionada);
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
    this.carregarDerERlr(funcaoDadosSelecionada);
  }

  private carregarFatorDeAjusteNaEdicao(fd: FuncaoDados) {
    this.fatoresAjuste = this.manual.fatoresAjuste;
    fd.fatorAjuste = _.find(this.fatoresAjuste, { 'id': fd.fatorAjuste.id });
  }

  private carregarDerERlr(fd: FuncaoDados) {
    this.dersChips = this.carregarReferenciavel(fd.ders, fd.derValues);
    this.rlrsChips = this.carregarReferenciavel(fd.rlrs, fd.rlrValues);
  }

  private carregarReferenciavel(referenciaveis: AnaliseReferenciavel[],
    strValues: string[]): DerChipItem[] {
    if (referenciaveis && referenciaveis.length > 0) { // situacao para analises novas e editadas
      return DerChipConverter.converterReferenciaveis(referenciaveis);
    } else { // SITUACAO para analises legadas
      return DerChipConverter.converter(strValues);
    }
  }

  cancelar() {
    this.limparDadosDaTelaNaEdicaoCancelada();
    this.showDialogNovo = false;
  }

  cancelarEdicao() {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja cancelar a alteração dessa Função de Dados`,
      accept: () => {
        this.analiseSharedDataService.funcaoAnaliseDescarregada();
        this.isEdit = false;
        this.showDialogNovo = false;
        this.pageNotificationService.addInfoMsg('Cancelada a Alteração de Função de Dados');
      }
    });
  }

  private limparDadosDaTelaNaEdicaoCancelada() {
    this.currentFuncaoDados = new FuncaoDados();
    this.dersChips = [];
    this.rlrsChips = [];
  }

  confirmDelete(funcaoDadosSelecionada: FuncaoDados) {
    const name: string = funcaoDadosSelecionada.name;
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir a Função de Dados '${name}'?`,
      accept: () => {
        this.analise.deleteFuncaoDados(funcaoDadosSelecionada);
        this.pageNotificationService.addDeleteMsgWithName(name);
      }
    });
  }

  formataFatorAjuste(fatorAjuste: FatorAjuste): string {
    return FatorAjusteLabelGenerator.generate(fatorAjuste);
  }

  ordenarColunas(colunasAMostrarModificada: SelectItem[]) {
    this.colunasAMostrar = colunasAMostrarModificada;
    this.colunasAMostrar = _.sortBy(this.colunasAMostrar, col => col.index);
  }

  ngOnDestroy() {
    this.changeDetectorRef.detach();
    this.analiseCarregadaSubscription.unsubscribe();
  }

  openDialogNovo() {
    this.limparDadosDaTelaNaEdicaoCancelada();
    this.showDialogNovo = true;
  }

  closeDialogNovo() {
    this.cancelarEdicao();
    this.limparDadosDaTelaNaEdicaoCancelada();
    this.showDialogNovo = false;
  }

}
