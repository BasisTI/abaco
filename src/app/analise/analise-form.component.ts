import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';

import { Analise } from './analise.model';
import { AnaliseService } from './analise.service';
import { ResponseWrapper, BaseEntity, AnaliseSharedDataService, PageNotificationService } from '../shared';
import { Organizacao, OrganizacaoService } from '../organizacao';
import { Contrato, ContratoService } from '../contrato';
import { Sistema, SistemaService } from '../sistema';
import { SelectItem } from 'primeng/primeng';

import * as _ from 'lodash';
import { EsforcoFase } from '../esforco-fase/index';
import { FatorAjuste } from '../fator-ajuste/index';
import { Manual } from '../manual/index';
import { FatorAjusteLabelGenerator } from '../shared/fator-ajuste-label-generator';
import { TipoEquipeService } from '../tipo-equipe';

@Component({
  selector: 'jhi-analise-form',
  templateUrl: './analise-form.component.html'
})
export class AnaliseFormComponent implements OnInit, OnDestroy {

  isEdicao: boolean;

  isSaving: boolean;
  dataAnalise: any;
  dataHomol: any;

  organizacoes: Organizacao[];

  contratos: Contrato[];

  sistemas: Sistema[];

  esforcoFases: EsforcoFase[] = [];

  metodosContagem: SelectItem[] = [];

  fatoresAjuste: SelectItem[] = [];

  equipeResponsavel: SelectItem[] = [];

  nomeManual = 'Selecione um Contrato.';

  private fatorAjusteNenhumSelectItem = { label: 'Nenhum', value: undefined };

 tiposAnalise: SelectItem[] = [
    {label: 'Projeto de Desenvolvimento', value: 'DESENVOLVIMENTO'},
    {label: 'Projeto Melhoria', value: 'MELHORIA'},
    {label: 'Contagem de Aplicação (Baseline)', value: 'APLICACAO'}
  ];

  metodoContagem: SelectItem[] = [
    {label: 'Detalhada (IFPUG)', value: 'Detalhada (IFPUG)'},
    {label: 'Indicativa (NESMA)', value: 'Indicativa (NESMA)'},
    {label: 'Estimada (NESMA)', value: 'Estimada (NESMA)'}
  ];

  private routeSub: Subscription;

  /**
   *
  */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private analiseService: AnaliseService,
    private organizacaoService: OrganizacaoService,
    private contratoService: ContratoService,
    private sistemaService: SistemaService,
    private analiseSharedDataService: AnaliseSharedDataService,
    private equipeService: TipoEquipeService,
    private pageNotificationService: PageNotificationService,

  ) { }

  /**
   *
  */
  ngOnInit() {
    this.analiseSharedDataService.init();
    this.isEdicao = false;
    this.isSaving = false;
    this.dataHomol = new Date();
    this.habilitarCamposIniciais();
    this.popularListaOrganizacao();
    this.popularAnaliseCarregada();
  }

  /**
   * Método responsável por popular o objeto analise carregada.
  */
  popularAnaliseCarregada() {
    this.routeSub = this.route.params.subscribe(params => {
      this.analise = new Analise();
      if (params['id']) {
        this.isEdicao = true;
        this.analiseService.find(params['id']).subscribe(analise => {
          this.inicializaValoresAposCarregamento(analise);
          this.analiseSharedDataService.analiseCarregada();
          this.dataAnalise = this.analise;
          this.dataHomol.setMonth(parseInt(this.dataAnalise.dataHomologacao.substring(5,7)) - 1);
          this.dataHomol.setDate(parseInt(this.dataAnalise.dataHomologacao.substring(8,10)));
          this.dataHomol.setFullYear(parseInt(this.dataAnalise.dataHomologacao.substring(0,4)));
          this.analise.dataHomologacao = this.dataHomol;
        });
      } else {
        this.analise.esforcoFases = [];
      }
    });
  }


  /**
   * Método responsável por popular a lista de organizações.
  */
  popularListaOrganizacao() {
    this.organizacaoService.query().subscribe((res: ResponseWrapper) => {
      this.organizacoes = res.json;
    });
  }

  /**
   *
  */
  private inicializaValoresAposCarregamento(analiseCarregada: Analise) {
    if (analiseCarregada.bloqueiaAnalise){
      this.pageNotificationService.addErrorMsg('Você não pode editar uma análise bloqueada!')
      this.router.navigate(['/analise'])
    }
    this.analise = analiseCarregada;
    this.organizacaoSelected(analiseCarregada.organizacao);
    this.carregarObjetos(analiseCarregada.contrato);
    this.carregaFatorAjusteNaEdicao();
  }

  /**
   *
  */
  organizacaoSelected(org: Organizacao) {
    this.contratos = org.contracts;
    this.sistemaService.findAllByOrganizacaoId(org.id).subscribe((res: ResponseWrapper) => {
      this.sistemas = res.json;
      console.log(res.json);
    });
    this.selecionarEquipePorOrganizacao(org);
  }

  /**
   *
  */
  selecionarEquipePorOrganizacao(org: Organizacao) {
    this.contratos = org.contracts;
    this.equipeService.findAllByOrganizacaoId(org.id).subscribe((res: ResponseWrapper) => {
      this.equipeResponsavel = res.json;
    });
  }

  /**
   *
  */
  carregarObjetos(contrato: Contrato) {
    if (contrato && contrato.manual) {
      const manual: Manual = contrato.manual;
      this.definirNomeManual(manual);
      this.carregarEsforcoFases(manual);
      this.carregarMetodosContagem(manual);
      this.inicializaFatoresAjuste(manual);
    }
  }

  /**
   * Método responsável por setar o nome do manual.
   * @param manual
  */
  definirNomeManual(manual: Manual) {
    this.nomeManual = manual.nome;

  }
  /**
   *
   * @param contrato
  */
  contratoSelected(contrato: Contrato) {
    this.carregarObjetos(contrato);
    this.save();
  }

  /**
   *
  */
  private inicializaFatoresAjuste(manual: Manual) {
    const faS: FatorAjuste[] = _.cloneDeep(manual.fatoresAjuste);
    this.fatoresAjuste =
      faS.map(fa => {
        const label = FatorAjusteLabelGenerator.generate(fa);
        return { label: label, value: fa };
      });
    this.fatoresAjuste.unshift(this.fatorAjusteNenhumSelectItem);
  }

  /**
   *
  */
  sistemaSelected() {
    this.analiseSharedDataService.sistemaSelecionado();
  }

  /**
   *
  */
  private carregaFatorAjusteNaEdicao() {
    const fatorAjuste: FatorAjuste = this.analise.fatorAjuste;
    if (fatorAjuste) {
      const fatorAjusteSelectItem: SelectItem
        = _.find(this.fatoresAjuste, { value: { id: fatorAjuste.id } });
      this.analise.fatorAjuste = fatorAjusteSelectItem.value;
    }
  }

  /**
   *
  */
  get analise(): Analise {
    return this.analiseSharedDataService.analise;
  }

  /**
   *
  */
  set analise(analise: Analise) {
    this.analiseSharedDataService.analise = analise;
  }

  /**
   *
  */
  contratoDropdownPlaceholder() {
    if (this.contratos) {
      if (this.contratos.length > 0) {
        return 'Selecione um Contrato';
      } else {
        return 'Organização não possui nenhum Contrato cadastrado';
      }
    } else {
      return 'Selecione uma Organização';
    }
  }

  /**
   *
  */
  shouldEnableContratoDropdown() {
    return this.contratos && this.contratos.length > 0;
  }

  /**
   *
  */
  private carregarEsforcoFases(manual: Manual) {
    this.esforcoFases = _.cloneDeep(manual.esforcoFases);

    if (!this.isEdicao) {
      // Leandro pediu para trazer todos selecionados
      this.analise.esforcoFases = _.cloneDeep(manual.esforcoFases);

    }
  }

  /**
   *
  */
  private carregarMetodosContagem(manual: Manual) {
    this.metodosContagem = [
      { value: 'DETALHADA',
        label: 'Detalhada (IFPUG)' },
      {
        value: 'INDICATIVA',
        label: this.getLabelValorVariacao('Indicativa (NESMA)', manual.valorVariacaoIndicativaFormatado)
      },
      {
        value: 'ESTIMADA',
        label: this.getLabelValorVariacao('Estimada (NESMA)', manual.valorVariacaoEstimadaFormatado)
      }
    ];
  }

  /**
   *
  */
  private getLabelValorVariacao(label: string, valorVariacao: number): string {
    return label + ' - ' + valorVariacao + '%';
  }

  /**
   *
  */
  totalEsforcoFases() {
    const initialValue = 0;
    return this.analise.esforcoFases.reduce((val, ef) => val + ef.esforcoFormatado, initialValue);
  }

  /**
   *
  */
  sistemaDropdownPlaceholder() {
    if (this.sistemas) {
      if (this.sistemas.length > 0) {
        return 'Selecione...';
      } else {
        return 'Organização não possui nenhum Sistema cadastrado';
      }
    } else {
      return 'Selecione uma Organização';
    }
  }

  /**
   *
  */
  shouldEnableSistemaDropdown() {
    return this.sistemas && this.sistemas.length > 0;
  }

  /**
   *
  */
  needContratoDropdownPlaceholder() {
    if (this.isContratoSelected()) {
      return 'Selecione...';
    } else {
      return 'Selecione um Contrato';
    }
  }

  /**
   *
  */
  isContratoSelected(): boolean {
    return this.analiseSharedDataService.isContratoSelected();
  }

  /**
   *
  */
  fatoresAjusteDropdownPlaceholder() {
    if (this.isContratoSelected()) {
      return 'Selecione um Fator de Ajuste';
    } else {
      return 'Selecione um Contrato para carregar os Fatores de Ajuste';
    }
  }

  /**
   *
  */
  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  /**
   * Método responsável por persistir as informações das análises na edição.
  **/
  save() {
    if (this.verificarCamposObrigatorios()) {
      this.analiseService.update(this.analise);
    }
  }

  /**
   * Método responsável por validar campos obrigatórios na persistência.
  **/
  private verificarCamposObrigatorios(): boolean {
    const isValid = true;

    if (!this.analise.identificadorAnalise) {
      this.pageNotificationService.addInfoMsg('Informe o campo Identificador da Analise para continuar.');
      return isValid;
    }
    if (!this.analise.contrato) {
      this.pageNotificationService.addInfoMsg('Informe o Contrato para continuar.');
      return isValid;
    }

    if (!this.analise.metodoContagem) {
      this.pageNotificationService.addInfoMsg('Informe o Método de Contagem para continuar.');
      return isValid;
    }
    if (!this.analise.tipoAnalise) {
      this.pageNotificationService.addInfoMsg('Informe o Tipo de Contagem para continuar.');
      return isValid;
    }
    if (!this.analise.propositoContagem) {
      this.pageNotificationService.addInfoMsg('Informe o Propósito da Contagem para continuar.');
      return isValid;
    }
    if (!this.analise.propositoContagem) {
      this.pageNotificationService.addInfoMsg('Informe o Escopo da Contagem para continuar.');
      return isValid;
    }
    if (!this.analise.propositoContagem) {
      this.pageNotificationService.addInfoMsg('Informe a Documentação para continuar.');
      return isValid;
    }
    return isValid;
  }

  /**
   *
  */
  public habilitarCamposIniciais() {
    return this.isEdicao;
  }

  /**
   *
  */
  public nomeSistema(): string {
    return this.analise.sistema.sigla +
    ' - ' + this.analise.sistema.nome;
  }

  /**
   *
  */
  public tooltipIdentificadorAnalise(): string {
    if (!this.analise.identificadorAnalise) {
      return 'Informe o Identificador da Análise.';
    } else {
      return 'Identificador da Análise informado com sucesso.';
    }
  }

  /**
   *
  */
  public tooltipContrato(): string {
    if (!this.analise.contrato) {
      return 'Informe o Contrato.';
    } else {
      return 'Contrato informado com sucesso.';
    }
  }

  /**
   *
  */
  public tooltipMedodoContagem(): string {
    if (!this.analise.metodoContagem) {
      return 'Informe o Método de Contagem.';
    } else {
      return 'Método de Contagem informado com sucesso.';
    }
  }

  /**
   * Conceito tipo da contagem.
  */
  public tooltipTipoContagem(): string {
    return '- Projeto de Desenvolvimento: Desenvolve e entrega' +
    ' a primeira versão de uma aplicação de software. Seu tamanho' +
    ' funcional é medida da função fornecida aos usuários' +
    ' por ela, como medido pela respectiva contagem.' +
    '' +
    ' - Projeto de Melhoria: Desenvolve e entrega manutenção adaptativa.' +
    ' Seu tamanho funcional é a medida das funções incluídas, alteradas ou excluídas' +
    ' ao final do projeto, como medido pela respectiva contagem.' +
    '' +
    ' - Contagem de Aplicação: Consiste de um ou mais componentes,' +
    ' módulos ou subsistemas. Sua medição funcional de' +
    ' tamanho é uma medida da função que uma aplicação' +
    ' fornece ao usuário, determinada pela respectiva contagem.';
  }

  /**
   * Conceito propósito da contagem.
  */
  public tooltipPropositoContagem(): string {
    return '- Fornece uma resposta a um problema de negócio.' +
    ' - Determina o Tipo de Contagem e o Escopo da Contagem. ' +
    ' - Influencia o posicionamento da Fronteira da Aplicação.';
  }

  /**
   * Conceito Escopo da Contagem.
  */
  public tooltipEscopoContagem(): string {
    return '- É um conjunto de Requisitos Funcionais do usuário;' +
    ' - Define um subconjunto do sistema medido;' +
    ' - É determinado pelo propósito da contagem;' +
    ' - Identifica quais funções serão incluídas na medição funcional de tamanho' +
    ' e pode incluir mais de uma aplicação.';
  }

  /**
   * Conceito da fronteira.
  */
  public tooltipFronteira(): string {
    return '- Define o que é externo à aplicação.' +
    ' - Indica a fronteira entre o software sendo medido e o usuário.' +
    ' - Age como uma ‘membrana’ pela qual dados processados pelas transações' +
    ' (EE,SE,CE) passam entrando e saindo.' +
    ' - Compreende dados mantidos pela aplicação (ALI)' +
    ' - Apóia na identificação de dados referenciados, ' +
    ' mas não mantidos dentro da fronteira da aplicação (AIE).' +
    ' - É dependente da visão externa de negócio da aplicação pelo usuário.' +
    ' - É independente de considerações técnicas e/ou de implementação.';
  }

  /**
   *
  */
 public tooltipDocumentacao(): string {
  if (!this.analise.documentacao) {
    return 'Informe a Documentação.';
  } else {
    return 'Documentação informada com sucesso.';
  }
}

}
