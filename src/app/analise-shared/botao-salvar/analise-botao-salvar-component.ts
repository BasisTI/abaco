import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';

import { Analise, AnaliseService } from '../../analise';
import { ResponseWrapper, AnaliseSharedDataService, PageNotificationService } from '../../shared';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import * as _ from 'lodash';

@Component({
  selector: 'app-analise-botao-salvar',
  templateUrl: './analise-botao-salvar-component.html'
})
export class AnaliseBotaoSalvarComponent implements OnDestroy {

  motivosBotaoDesabilitado: Set<string> = new Set<string>();

  private saveSubscription: Subscription;

  constructor(
    private analiseService: AnaliseService,
    private analiseSharedDataService: AnaliseSharedDataService,
    private pageNotificationService: PageNotificationService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  habilitarBotaoSalvar(): boolean {
    const habilitar: boolean = this.checarSeDeveHabilitarBotaoEConstruirMotivos();
    this.changeDetectorRef.markForCheck();
    return habilitar;
  }

  private checarSeDeveHabilitarBotaoEConstruirMotivos(): boolean {
    this.motivosBotaoDesabilitado.clear();
    // TODO complementar. hoje é só uma prova de conceito
    if (_.isEmpty(this.analise.numeroOs)) {
      this.motivosBotaoDesabilitado.add('- Informe um Número OS');
    }
    if (_.isEmpty(this.analise.tipoContagem)) {
      this.motivosBotaoDesabilitado.add('- Selecione um Tipo de Contagem');
    }
    if (this.nenhumaFuncaoAdicionada()) {
      this.motivosBotaoDesabilitado.add('- Cadastre ao menos uma Função de Dados ou Função Transação');
    }
    return _.isEmpty(this.motivosBotaoDesabilitado);
  }

  private nenhumaFuncaoAdicionada() {
    const analise: Analise = this.analise;
    return _.isEmpty(analise.funcaoDados) && _.isEmpty(analise.funcaoTransacaos);
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
    this.saveSubscription =  result.subscribe((res: Analise) => {
      this.analise = res;
      this.pageNotificationService.addSuccessMsg('Análise salva com sucesso');
    });
  }

  ngOnDestroy() {
    this.changeDetectorRef.detach();
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }
  }

}
