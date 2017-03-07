
const enum TipoFuncaoTransacao {
    'EE',
    'SE',
    'CE'

};

const enum Complexidade {
    'BAIXA',
    'MEDIA',
    'ALTA'

};
import { Analise } from '../analise';
import { Funcionalidade } from '../funcionalidade';
import { FatorAjuste } from '../fator-ajuste';
import { Alr } from '../alr';
export class FuncaoTransacao {
    constructor(
        public id?: number,
        public tipo?: TipoFuncaoTransacao,
        public complexidade?: Complexidade,
        public pf?: number,
        public analise?: Analise,
        public funcionalidade?: Funcionalidade,
        public fatorAjuste?: FatorAjuste,
        public alr?: Alr,
    ) {
    }
}
