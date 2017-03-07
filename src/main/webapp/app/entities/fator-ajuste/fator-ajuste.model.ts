
const enum TipoFatorAjuste {
    'PERCENTUAL',
    'UNITARIO'

};

const enum ImpactoFatorAjuste {
    'INCLUSAO',
    'ALTERACAO',
    'EXCLUSAO',
    'CONVERSAO',
    'ITENS_NAO_MENSURAVEIS'

};
import { Manual } from '../manual';
export class FatorAjuste {
    constructor(
        public id?: number,
        public nome?: string,
        public fator?: number,
        public ativo?: boolean,
        public tipoAjuste?: TipoFatorAjuste,
        public impacto?: ImpactoFatorAjuste,
        public manual?: Manual,
    ) {
        this.ativo = false; 
    }
}
