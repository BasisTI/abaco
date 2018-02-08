import {
  Component, OnInit, Input, Output,
  EventEmitter, ChangeDetectorRef, OnDestroy
} from '@angular/core';
import { AnaliseSharedDataService } from '../shared';
import { Analise } from '../analise';
import { Manual } from '../manual';
import { FatorAjuste } from '../fator-ajuste';
import { Sistema, SistemaService } from '../sistema/index';
import { Modulo, ModuloService } from '../modulo';
import { Funcionalidade, FuncionalidadeService } from '../funcionalidade';
import { Subscription } from 'rxjs/Subscription';

import * as _ from 'lodash';

@Component({
  selector: 'app-analise-modulo-funcionalidade',
  templateUrl: './modulo-funcionalidade.component.html'
})
export class ModuloFuncionalidadeComponent implements OnInit, OnDestroy {

  @Input()
  isFuncaoDados: boolean;

  @Output()
  moduloSelectedEvent = new EventEmitter<Modulo>();

  @Output()
  funcionalidadeSelectedEvent = new EventEmitter<Funcionalidade>();

  private subscriptionSistemaSelecionado: Subscription;
  private subscriptionAnaliseSalva: Subscription;
  private subscriptionAnaliseCarregada: Subscription;
  private subscriptionFuncaoAnaliseCarregada: Subscription;

  modulos: Modulo[];
  mostrarDialogModulo = false;
  novoModulo: Modulo = new Modulo();
  moduloSelecionado: Modulo;

  funcionalidades: Funcionalidade[];
  mostrarDialogFuncionalidade = false;
  novaFuncionalidade: Funcionalidade = new Funcionalidade();
  funcionalidadeSelecionada: Funcionalidade;

  constructor(
    private analiseSharedDataService: AnaliseSharedDataService,
    private moduloService: ModuloService,
    private sistemaService: SistemaService,
    private funcionalidadeService: FuncionalidadeService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    if (_.isUndefined(this.isFuncaoDados)) {
      throw new Error('input isFuncaoDados é obrigatório.');
    }

    this.subscribeSistemaSelecionado();
    this.subscribeAnaliseCarregada();
    this.subscribeAnaliseSalva();
    this.subscribeFuncaoAnaliseCarregada();
  }

  private subscribeSistemaSelecionado() {
    this.subscriptionSistemaSelecionado =
      this.analiseSharedDataService.getSistemaSelecionadoSubject().subscribe(() => {
        this.carregarModulosQuandoTiverSistemaDisponivel();
      });
  }

  private carregarModulosQuandoTiverSistemaDisponivel() {
    this.modulos = this.sistema.modulos;
    this.changeDetectorRef.detectChanges();
  }

  private get sistema(): Sistema {
    return this.analiseSharedDataService.analise.sistema;
  }

  private subscribeAnaliseCarregada() {
    this.subscriptionAnaliseCarregada = this.analiseSharedDataService.getLoadSubject().subscribe(() => {
      if (this.sistema) {
        this.carregarModulosQuandoTiverSistemaDisponivel();
      }
    });
  }

  private subscribeAnaliseSalva() {
    this.subscriptionAnaliseSalva = this.analiseSharedDataService.getSaveSubject().subscribe(() => {
      this.modulos = this.sistema.modulos.slice();
      this.selectModuloOnAnaliseSalva();
      this.changeDetectorRef.detectChanges();
    });
  }

  private selectModuloOnAnaliseSalva() {
    const moduloASelecionar = this.getModuloASelecionarDeAcordoComTipoFuncaoDoComponente();
    if (moduloASelecionar) {
      this.selecionarModulo(moduloASelecionar.id);
    }
  }

  private getModuloASelecionarDeAcordoComTipoFuncaoDoComponente(): Modulo {
    if (this.currentFuncaoAnalise.funcionalidade) {
      return this.currentFuncaoAnalise.funcionalidade.modulo;
    }
  }

  // TODO pode retornar interface FuncaoAnalise. mas precisa ser complementada
  private get currentFuncaoAnalise() {
    if (this.isFuncaoDados) {
      return this.analiseSharedDataService.currentFuncaoDados;
    } else {
      return this.analiseSharedDataService.currentFuncaoTransacao;
    }
  }

  // Para selecionar no dropdown, o objeto selecionado tem que ser o mesmo da lista de opções
  private selecionarModulo(moduloId: number) {
    this.moduloSelecionado = _.find(this.modulos, { 'id': moduloId });
    this.moduloSelected(this.moduloSelecionado);
  }

  private subscribeFuncaoAnaliseCarregada() {
    this.subscriptionFuncaoAnaliseCarregada =
      this.analiseSharedDataService.getFuncaoAnaliseCarregadaSubject().subscribe(() => {
        this.carregarTudoOnFuncaoAnaliseCarregada();
      });
  }

  // TODO avaliar duplicacoes e refatorar
  private carregarTudoOnFuncaoAnaliseCarregada() {
    const currentFuncionalidade: Funcionalidade = this.currentFuncaoAnalise.funcionalidade;
    const currentModulo: Modulo = currentFuncionalidade.modulo;

    this.modulos = this.sistema.modulos;
    this.selecionarModulo(currentModulo.id);

    this.funcionalidades = currentModulo.funcionalidades;
    this.funcionalidadeSelecionada = _.find(this.funcionalidades, { 'id': currentFuncionalidade.id });
    this.funcionalidadeSelected(this.funcionalidadeSelecionada);
  }

  moduloName() {
    if (this.isModuloSelected()) {
      return this.moduloSelecionado.nome;
    }
  }

  isSistemaSelected(): boolean {
    return !_.isUndefined(this.sistema);
  }

  moduloDropdownPlaceholder(): string {
    if (this.isSistemaSelected()) {
      return this.moduloDropdownPlaceholderComSistemaSelecionado();
    } else {
      return `Selecione um Sistema na aba 'Geral' para carregar os Módulos`;
    }
  }

  private moduloDropdownPlaceholderComSistemaSelecionado(): string {
    if (this.sistemaTemModulos()) {
      return 'Selecione um Módulo';
    } else {
      return 'Nenhum Módulo cadastrado';
    }
  }

  private sistemaTemModulos(): boolean {
    return this.sistema.modulos && this.sistema.modulos.length > 0;
  }

  abrirDialogModulo() {
    if (this.isSistemaSelected()) {
      this.mostrarDialogModulo = true;
      // XXX problema em dar new toda hora?
      this.novoModulo = new Modulo();
    }
  }

  fecharDialogModulo() {
    this.mostrarDialogModulo = false;
  }

  isModuloSelected(): boolean {
    return !_.isUndefined(this.moduloSelecionado);
  }

  moduloSelected(modulo: Modulo) {
    this.funcionalidades = modulo.funcionalidades;
    this.moduloSelectedEvent.emit(modulo);
  }

  adicionarModulo() {
    const sistemaId = this.sistema.id;
    // TODO inserir um spinner, talvez bloquear a UI
    this.moduloService.create(this.novoModulo, sistemaId).subscribe((moduloCriado: Modulo) => {
      this.sistemaService.find(sistemaId).subscribe((sistemaRecarregado: Sistema) => {
        this.recarregarSistema(sistemaRecarregado);
        this.selecionarModulo(moduloCriado.id);
      });
    });

    this.fecharDialogModulo();
  }

  private recarregarSistema(sistemaRecarregado: Sistema) {
    this.analiseSharedDataService.analise.sistema = sistemaRecarregado;
  }

  funcionalidadeDropdownPlaceholder() {
    if (this.isModuloSelected()) {
      return this.funcionalidadeDropdownPlaceHolderComModuloSelecionado();
    } else {
      return 'Selecione um Módulo para carregar as Funcionalidades';
    }
  }

  private funcionalidadeDropdownPlaceHolderComModuloSelecionado(): string {
    if (this.moduloSelecionadoTemFuncionalidade()) {
      return 'Selecione uma Funcionalidade';
    } else {
      return 'Nenhuma Funcionalidade cadastrada';
    }
  }

  private moduloSelecionadoTemFuncionalidade(): boolean {
    return this.moduloSelecionado.funcionalidades && this.moduloSelecionado.funcionalidades.length > 0;
  }

  abrirDialogFuncionalidade() {
    if (this.isModuloSelected()) {
      this.mostrarDialogFuncionalidade = true;
      this.novaFuncionalidade = new Funcionalidade();
    }
  }

  fecharDialogFuncionalidade() {
    this.mostrarDialogFuncionalidade = false;
  }

  adicionarFuncionalidade() {
    const moduloId = this.moduloSelecionado.id;
    const sistemaId = this.sistema.id;
    // TODO inserir um spinner
    this.funcionalidadeService.create(this.novaFuncionalidade, moduloId)
      .subscribe((funcionalidadeCriada: Funcionalidade) => {
        this.sistemaService.find(sistemaId).subscribe((sistemaRecarregado: Sistema) => {
          this.recarregarSistema(sistemaRecarregado);
          this.selecionarModulo(moduloId);
          this.selecionarFuncionalidadeRecemCriada(funcionalidadeCriada);
        });
      });

    this.fecharDialogFuncionalidade();
  }

  funcionalidadeSelected(funcionalidade: Funcionalidade) {
    this.funcionalidadeSelectedEvent.emit(funcionalidade);
  }

  private selecionarFuncionalidadeRecemCriada(funcionalidadeCriada: Funcionalidade) {
    this.funcionalidadeSelecionada = _.find(this.moduloSelecionado.funcionalidades,
      { 'id': funcionalidadeCriada.id });
    this.funcionalidadeSelected(this.funcionalidadeSelecionada);
  }

  ngOnDestroy() {
    this.subscriptionSistemaSelecionado.unsubscribe();
    this.subscriptionAnaliseCarregada.unsubscribe();
    this.subscriptionAnaliseSalva.unsubscribe();
    this.subscriptionFuncaoAnaliseCarregada.unsubscribe();
    this.changeDetectorRef.detach();
  }

}
