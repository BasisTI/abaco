import { Organizacao } from '../organizacao';
import { BaseEntity } from '../shared';
import { Perfil } from './perfil.model';
import { Permissao } from './permissao.model';

export class PerfilOrganizacao implements BaseEntity {

    constructor(public id?: number,
        public perfil?: Perfil,
        public organizacoes?: Organizacao[]) {
            this.organizacoes = [];
    }
}
