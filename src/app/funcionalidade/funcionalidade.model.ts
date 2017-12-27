import { BaseEntity } from '../shared';


export class Funcionalidade implements BaseEntity {

  constructor(
    public id?: number,
    public nome?: string,
    public modulo?: BaseEntity,
    public funcaoDados?: BaseEntity,
    public funcaoTransacao?: BaseEntity,
  ) {}
}
