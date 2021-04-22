import { SafeUrl } from '@angular/platform-browser';
import { BaseEntity } from '../shared';
// import { FuncaoDados } from '../funcao-dados';
// import { FuncaoTransacao } from '../funcao-transacao';


export class Upload implements BaseEntity {

  constructor(
    public id?: number,
    public logo?: File,
    public originalName?: string,
    public filename?: string,
    public dateOf?: Date,
    public sizeOf?: number,
    public processType?: number,
    public safeUrl?: SafeUrl
    // public funcaoDados?:FuncaoDados,
    // public funcaoTRansacao?:FuncaoTransacao,
  ) {}
}
