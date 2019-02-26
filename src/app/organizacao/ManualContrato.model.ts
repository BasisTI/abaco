import { JSONable, BaseEntity } from './../shared';
import { Contrato } from './../contrato/contrato.model';
import { Manual } from './../manual/manual.model';


export class ManualContrato implements BaseEntity/*, JSONable<ManualContrato>*/ {

    constructor(
        public id?: any,
        public artificialId?: number,
        public manual?: Manual,
        public contratos?: Contrato,
        public dataInicioVigencia?: Date,
        public dataFimVigencia?: Date,
        public ativo?: boolean,
        public garantia?: number,
    ) { }


    /*toJSONState(): ManualContrato {
        const copy: ManualContrato = Object.assign({}, this);
        return copy;
    }

    copyFromJSON(json: any) {
        const newManualContrato = new ManualContrato(json.id, json.manual, json.contratos
            , json.dataInicioVigencia, json.dataFimVigencia, json.ativo, json.garantia);
        return newManualContrato;
    }*/

}
