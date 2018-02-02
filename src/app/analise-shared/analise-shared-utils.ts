import { Complexidade } from './complexidade-enum';

export class AnaliseSharedUtils {

  private static _complexidades: string[];

  static initialize() {
    this._complexidades = Object.keys(Complexidade)
    .map(k => Complexidade[k as any]);
  }

  static get complexidades() {
    return this._complexidades;
  }

}

AnaliseSharedUtils.initialize();
