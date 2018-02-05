import { Sistema } from '../sistema';
import { Modulo } from '../modulo';
import { Funcionalidade } from '../funcionalidade';
import * as _ from 'lodash';

export class ModuloDaFuncionalidadeFinder {

  // XXX esse metodo por ter performance muito ruim
  // se um sistema tiver muitos modulos, funcionalidades
  // se a analise tiver muitas funcoes de dados e/ou funcoes de transacao
  // metodo implementado rápido, pode ser mais eficiente
  static find(sistema: Sistema, funcionalidadeId: number): Modulo {
    let moduloEncontrado: Modulo;
    sistema.modulos.forEach(mod => {
      const funcionalidadeEncontrada: Funcionalidade = _.find(mod.funcionalidades, { 'id': funcionalidadeId });
      if (funcionalidadeEncontrada) {
        moduloEncontrado = Modulo.fromJSON(funcionalidadeEncontrada.modulo);
      }
    });
    return moduloEncontrado;
  }

}
