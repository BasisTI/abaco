import { Component, Input } from '@angular/core';

import { Analise, AnaliseService } from '../../analise';
import { ResponseWrapper, AnaliseSharedDataService } from '../../shared';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-analise-botao-salvar',
  templateUrl: './analise-botao-salvar-component.html'
})
export class AnaliseBotaoSalvarComponent {

  constructor(
    private analiseService: AnaliseService,
    private analiseSharedDataService: AnaliseSharedDataService,
  ) { }

  private get analise(): Analise {
    return this.analiseSharedDataService.analise;
  }

  private set analise(analise: Analise) {
    this.analiseSharedDataService.analise = analise;
  }

  salvar() {
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
