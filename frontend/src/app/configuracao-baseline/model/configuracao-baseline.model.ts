import { BaseEntity } from '../../shared';
import { Sistema } from '../../sistema';
import {TipoEquipe} from '../../tipo-equipe'

export class ConfiguracaoBaseline implements BaseEntity {

    constructor(
        public id?: number,
        public sistema?: Sistema,
        public tipoEquipe?:TipoEquipe
    ) {
    }
}