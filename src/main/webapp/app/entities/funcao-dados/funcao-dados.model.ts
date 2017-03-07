
const enum TipoFuncaoDados {
    'ALI',
    'AIE'

};

const enum Complexidade {
    'BAIXA',
    'MEDIA',
    'ALTA'

};
import { Analise } from '../analise';
import { Funcionalidade } from '../funcionalidade';
import { FatorAjuste } from '../fator-ajuste';
import { Rlr } from '../rlr';
import { Alr } from '../alr';
export class FuncaoDados {
    constructor(
        public id?: number,
        public tipo?: TipoFuncaoDados,
        public complexidade?: Complexidade,
        public pf?: number,
        public analise?: Analise,
        public funcionalidade?: Funcionalidade,
        public fatorAjuste?: FatorAjuste,
        public rlr?: Rlr,
        public alr?: Alr,
    ) {
    }
}
