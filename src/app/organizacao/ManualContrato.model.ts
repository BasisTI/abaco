import { Contrato } from './../contrato/contrato.model';
import { Manual } from './../manual/manual.model';
import { BaseEntity } from './../shared';

/**
 * Classe que mapeia a ligação de Contratos com Manual
 */
export class ManualContrato implements BaseEntity {

    constructor(
        public id?: any,
        public artificialId?: number,
        public manual?: Manual,
        public contratos?: Contrato,
        public dataInicioVigencia?: Date,
        public dataFimVigencia?: Date,
        public ativo?: boolean,
    ) {}

    toJSONState(): ManualContrato {
        const copy: ManualContrato = Object.assign({}, this);
        return copy;
    }

    copyFromJSON(json: any) {
        const manualContrato = new ManualContrato(json.id, null, json.manual, json.contratos
            , new Date(json.dataInicioVigencia), new Date(json.dataFimVigencia), json.ativo);
        return manualContrato;
    }

    clone(): ManualContrato {
        return new ManualContrato(this.id, this.artificialId, this.manual,
            this.contratos, this.dataInicioVigencia, this.dataFimVigencia, this.ativo);
    }

}
