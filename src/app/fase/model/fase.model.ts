import { BaseEntity } from '../../shared';

export class Fase implements BaseEntity {

    constructor(
        public id?: number,
        public nome?: string
    ) {
    }
}
