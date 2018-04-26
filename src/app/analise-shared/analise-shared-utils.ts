import { Complexidade } from './complexidade-enum';
import { Impacto } from './impacto-enum';

export class AnaliseSharedUtils {

  private static _complexidades: string[];

  private static _impacto: string[];

  static initialize() {
    this._complexidades = Object.keys(Complexidade).map(k => Complexidade[k as any]);
    this._impacto = Object.keys(Impacto).map(k => Impacto[k as any]);
  }

  static get complexidades() {
    return this._complexidades;
  }

  static get impactos() {
    return this._impacto;
  }

}

AnaliseSharedUtils.initialize();
