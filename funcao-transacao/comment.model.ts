import { FuncaoTransacao } from '.';
import { User } from '../user';

export class CommentFuncaoTransacao {
    constructor(
            public commet?: string,
            public user?: User,
            public funcaoDados?: FuncaoTransacao,
    ) {
    }
}