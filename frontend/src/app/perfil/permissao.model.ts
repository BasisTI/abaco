import { BaseEntity } from '../shared';

export class Permissao implements BaseEntity {

    id: number;
    acao: Acao = new Acao();
    funcionalidadeAbaco: FuncionalidadeAbaco = new FuncionalidadeAbaco();
}


export class Acao implements BaseEntity {

    id: number;
    descricao: string;
    sigla: string;
}

export class FuncionalidadeAbaco implements BaseEntity {

    id: number;
    nome: string;
    sigla: string;
}
