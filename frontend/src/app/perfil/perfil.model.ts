import { BaseEntity } from '../shared';
import { MappableEntities } from '../shared/mappable-entities';
import { Permissao } from './permissao.model';

export class Perfil implements BaseEntity {

    constructor(public id?: number,
        public nome?: string,
        public descricao?: string,
        public permissaos?: Permissao[],
        public flgAtivo?: boolean) {
    }
}
