
import {Process, UploadedFile} from "../analise/process.model";
const enum TipoFuncaoTransacao {
    'EE',
    'SE',
    'CE'

};

const enum Complexidade {
    'SEM',
    'BAIXA',
    'MEDIA',
    'ALTA'

};
import { Analise } from '../analise';
import { Funcionalidade } from '../funcionalidade';
import { FatorAjuste } from '../fator-ajuste';
import { Alr } from '../alr';
import {Complexity, OutputTypes} from "../analise/enums";
export class FuncaoTransacao {
    constructor(
        public id?: number,
        public tipo?: TipoFuncaoTransacao,
        public complexidade?: Complexidade,
        public pf?: number,
        public grossPF?:number,
        public analise?: Analise,
        public funcionalidade?: Funcionalidade,
        public fatorAjuste?: FatorAjuste,
        public alr?: Alr,
        public detStr?: String,
        public ftrStr?: String,
        public name?:String,
        public sustantation?:String,
        public files?:UploadedFile[]
    ) {
    }

    public convertFromProcess(process:Process) {
        this.id = process.id;
        this.pf = process.pf;
        this.grossPF = process.grossPF;
        this.funcionalidade = process.func;
        this.fatorAjuste = process.factor;
        this.detStr = process.detStr;
        this.ftrStr = process.retStr;
        this.name = process.name;
        this.sustantation = process.sustantation;
        this.files = [].concat(process.files);
        if (process.classification == OutputTypes.EI) {
            this.tipo = TipoFuncaoTransacao.EE;
        } else if (process.classification == OutputTypes.EO) {
            this.tipo = TipoFuncaoTransacao.SE;
        } else {
            this.tipo = TipoFuncaoTransacao.CE;
        }

        switch (process.complexity) {
            case Complexity.NONE:this.complexidade = Complexidade.SEM;break;
            case Complexity.LOW: this.complexidade = Complexidade.BAIXA; break;
            case Complexity.MEDIUM: this.complexidade = Complexidade.MEDIA; break;
            case Complexity.HIGH: this.complexidade = Complexidade.ALTA; break;
        }

    }
}
