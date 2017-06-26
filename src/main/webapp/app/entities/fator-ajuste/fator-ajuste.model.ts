
export  enum TipoFatorAjuste {
    'PERCENTUAL',
    'UNITARIO'
};

export  enum ImpactoFatorAjuste {
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
        this.ativo = true;
    }


    public getTitleWithValue() {
        if (this.tipoAjuste.toString()=='PERCENTUAL'){
            let s:string = this.nome+"-"+(this.fator*100).toString()+"%";
            return this.nome+" - "+(this.fator*100).toString()+"%";
        } else {
            return this.nome+" - "+this.fator.toString()+" Pfs";
        }

    }
}
