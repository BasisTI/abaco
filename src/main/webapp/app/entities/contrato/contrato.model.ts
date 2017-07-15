import { Manual } from '../manual';
import {Organizacao} from "../organizacao/organizacao.model";
export class Contrato {
    constructor(
        public id?: number,
        public numeroContrato?: string,
        public dataInicioVigencia?: any,
        public dataFimVigencia?: any,
        public manual?: Manual,
        public organization?:Organizacao
    ) {
    }
}
