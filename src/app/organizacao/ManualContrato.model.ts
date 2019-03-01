import { JSONable, BaseEntity, MappableEntities } from './../shared';
import { Contrato } from './../contrato/contrato.model';
import { Manual } from './../manual/manual.model';

/**
 * Classe que mapeia a ligação de Contratos com Manual
 */
export class ManualContrato implements BaseEntity, JSONable<ManualContrato> {

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
        const newManualContrato = new ManualContrato(json.id, null, json.manual, json.contratos
            , json.dataInicioVigencia, json.dataFimVigencia, json.ativo);
        return newManualContrato;
    }

}
