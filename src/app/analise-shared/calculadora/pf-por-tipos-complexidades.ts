import { Complexidade } from '../complexidade-enum';
import { TipoFuncaoDados } from '../../funcao-dados/funcao-dados.model';
import { TipoFuncaoTransacao } from '../../funcao-transacao/funcao-transacao.model';

class PFPorComplexidade {

  private _complexidadeToPF: Map<string, number> = new Map<string, number>();

  constructor() { }

  setValorDaComplexidade(complexidade: Complexidade, valor: number): PFPorComplexidade {
    this._complexidadeToPF.set(complexidade, valor);
    return this;
  }

  getValorDaComplexidade(complexidade: Complexidade): number {
    return this._complexidadeToPF.get(complexidade);
  }

}

export class PFPorTiposComplexidades {

  private static _tipoToPfPorComplexidade: Map<string, PFPorComplexidade>;

  static initialize() {
    this._tipoToPfPorComplexidade = new Map<string, PFPorComplexidade>();

    // TODO Complexidade.SEM, quais devem ser os valores brutos?
    this.add(TipoFuncaoDados.ALI, 7, 7, 10, 15);
    this.add(TipoFuncaoDados.AIE, 5, 5, 7, 10);

    this.add(TipoFuncaoTransacao.CE, 0, 3, 4, 6);
    this.add(TipoFuncaoTransacao.EE, 0, 3, 4, 6);
    this.add(TipoFuncaoTransacao.SE, 0, 4, 5, 7);
  }

  private static add(tipo: string, s: number, b: number, m: number, a: number) {
    this._tipoToPfPorComplexidade.set(tipo,
      new PFPorComplexidade()
        .setValorDaComplexidade(Complexidade.SEM, s)
        .setValorDaComplexidade(Complexidade.BAIXA, b)
        .setValorDaComplexidade(Complexidade.MEDIA, m)
        .setValorDaComplexidade(Complexidade.ALTA, a)
    );
  }

  static getPorTipoEComplexidade(tipo: string, complexidade: Complexidade): number {
     const pfPorComplexidade = this._tipoToPfPorComplexidade.get(tipo);
     return pfPorComplexidade.getValorDaComplexidade(complexidade);
  }

}

PFPorTiposComplexidades.initialize();
