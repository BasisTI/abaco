import { User } from '../user';
import { FuncaoDados } from './funcao-dados.model';

export class CommentFuncaoDados {
    constructor(
            public commet?: string,
            public user?: User,
            public funcaoDados?: FuncaoDados,
    ) {
    }
}