import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';

import { AnaliseSharedDataService } from '../../../shared/analise-shared-data.service';
import { Analise } from '../../../analise/analise.model';
import { FuncaoDados } from '../../../funcao-dados/funcao-dados.model';
import { Der } from '../../../der/der.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-analise-referenciador-ar',
  templateUrl: './referenciador-ar.component.html'
})
export class ReferenciadorArComponent implements OnInit, OnDestroy {

  @Output()
  dersReferenciadosEvent: EventEmitter<Der[]> = new EventEmitter<Der[]>();

  @Output()
  funcaoDadosReferenciadaEvent: EventEmitter<string> = new EventEmitter<string>();

  private subscriptionAnaliseCarregada: Subscription;

  funcoesDados: FuncaoDados[] = [];

  ders: Der[] = [];

  mostrarDialog = false;

  funcaoDadosSelecionada: FuncaoDados;

  dersReferenciados: Der[] = [];

  valorVariavel: string;

  constructor(
    private analiseSharedDataService: AnaliseSharedDataService,
  ) { }

  ngOnInit() {
    // TODO quais eventos observar?
    // precisa de um evento de funcaoDados adicionada?
    this.subscribeAnaliseCarregada();
  }

  private subscribeAnaliseCarregada() {
    this.subscriptionAnaliseCarregada = this.analiseSharedDataService.getLoadSubject().subscribe(() => {
      this.funcoesDados = this.analiseSharedDataService.analise.funcaoDados;
    });
  }

  abrirDialog() {
    if (this.habilitarBotaoAbrirDialog()) {
      this.mostrarDialog = true;
    }
  }

  habilitarBotaoAbrirDialog(): boolean {
    if (!this.funcoesDados) {
      return false;
    }
    return this.funcoesDados.length > 0;
  }

  funcoesDadosDropdownPlaceholder(): string {
    return 'Selecione uma Função Dados';
  }

  funcaoDadosSelected(fd: FuncaoDados) {
    this.funcaoDadosSelecionada = fd;
    this.ders = fd.ders;
  }

  dersMultiSelectedPlaceholder(): string {
    if (!this.funcaoDadosSelecionada) {
      return 'DERs - Selecione uma Função de Dados para selecionar quais DERs referenciar';
    } else if (this.funcaoDadosSelecionada) {
      return 'Selecione quais DERs deseja referenciar';
    }
  }

  relacionar() {
    this.dersReferenciados.forEach(der => {
      der.id = undefined;
    });
    this.dersReferenciadosEvent.emit(this.dersReferenciados);
    // XXX vai precisar relacionar qual funcao de dados foi relacionada?
    this.funcaoDadosReferenciadaEvent.emit(this.funcaoDadosSelecionada.name);
    this.fecharDialog();
  }

  fecharDialog() {
    this.resetarCampos();
    this.mostrarDialog = false;
  }

  private resetarCampos() {
    this.funcaoDadosSelecionada = undefined;
    this.ders = [];
    this.dersReferenciados = [];
  }

  ngOnDestroy() {

  }

}
