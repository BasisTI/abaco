import { Component, OnInit, Input } from '@angular/core';
import { AnaliseSharedDataService } from '../shared';
import { Analise } from '../analise';
import { Manual } from '../manual';
import { FatorAjuste } from '../fator-ajuste';
import { Sistema, SistemaService } from '../sistema/index';
import { Modulo, ModuloService } from '../modulo';
import { Funcionalidade, FuncionalidadeService } from '../funcionalidade';

import * as _ from 'lodash';

@Component({
  selector: 'app-analise-modulo-funcionalidade',
  templateUrl: './modulo-funcionalidade.component.html'
})
export class ModuloFuncionalidadeComponent implements OnInit {

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
    private funcionalidadeService: FuncionalidadeService
  ) { }

  ngOnInit() {

  }

  private get sistema(): Sistema {
    return this.analiseSharedDataService.analise.sistema;
  }

  get modulos() {
    if (this.sistema) {
      return this.sistema.modulos;
    }
  }

  isSistemaSelected(): boolean {
    return !_.isUndefined(this.sistema);
  }

  moduloDropdownPlaceholder(): string {
    if (this.isSistemaSelected()) {
      return 'Modulo';
    } else {
      return `Selecione um Sistema na aba 'Geral' para carregar os Módulos`;
    }
  }

  abrirDialogModulo() {
    this.mostrarDialogModulo = true;
    // XXX problema em dar new toda hora?
    this.novoModulo = new Modulo();
  }

  fecharDialogModulo() {
    this.mostrarDialogModulo = false;
  }

  isModuloSelected(): boolean {
    return !_.isUndefined(this.moduloSelecionado);
  }

  moduloSelected(modulo: Modulo) {
    this.funcionalidades = modulo.funcionalidades;
    // EMITIR EVENTO
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

  // Para selecionar no dropdown, o objeto selecionado tem que ser o mesmo da lista de opções
  private selecionarModulo(moduloId: number) {
    this.moduloSelecionado = _.find(this.sistema.modulos, { 'id': moduloId });
    this.moduloSelected(this.moduloSelecionado);
  }

  funcionalidadeDropdownPlaceholder() {
    if (this.isModuloSelected()) {
      return 'Funcionalidade';
    } else {
      return 'Selecione um Módulo para carregar as Funcionalidades';
    }
  }

  abrirDialogFuncionalidade() {
    this.mostrarDialogFuncionalidade = true;
    this.novaFuncionalidade = new Funcionalidade();
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
    // emitir evento
  }

  private selecionarFuncionalidadeRecemCriada(funcionalidadeCriada: Funcionalidade) {
    this.funcionalidadeSelecionada = _.find(this.moduloSelecionado.funcionalidades,
      { 'id': funcionalidadeCriada.id });
    this.funcionalidadeSelected(this.funcionalidadeSelecionada);
  }

}
