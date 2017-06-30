import { Analise } from '../analise';
import { Funcionalidade } from '../funcionalidade';
import { FatorAjuste } from '../fator-ajuste';
import { Rlr } from '../rlr';
import { Alr } from '../alr';
import {Complexity, LogicalFile} from "../analise/enums";
import {Process} from "../analise/process.model";

export const enum TipoFuncaoDados {
    'ALI',
    'AIE'

};

export const enum Complexidade {
    'SEM',
    'BAIXA',
    'MEDIA',
    'ALTA'

};

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
        public detStr?: String,
        public retStr?: String,
        public name?:String
    ) {
    }




    public convertFromProcess(process:Process) {
        this.id = process.id;
        this.pf = process.pf;
        this.funcionalidade = process.func;
        this.fatorAjuste = process.factor;
        this.detStr = process.detStr;
        this.retStr = process.retStr;
        this.name = process.name;

        if (process.classification == LogicalFile.ILF) {
            this.tipo = TipoFuncaoDados.ALI;
        } else {
            this.tipo = TipoFuncaoDados.AIE;
        }

        switch (process.complexity) {
            case Complexity.NONE: this.complexidade = Complexidade.SEM;break;
            case Complexity.LOW: this.complexidade = Complexidade.BAIXA; break;
            case Complexity.MEDIUM: this.complexidade = Complexidade.MEDIA; break;
            case Complexity.HIGH: this.complexidade = Complexidade.ALTA; break;
        }

    }

}
