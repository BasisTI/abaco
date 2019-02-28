import { JSONable, BaseEntity, MappableEntities } from './../shared';
import { Contrato } from './../contrato/contrato.model';
import { Manual } from './../manual/manual.model';


export class ManualContrato implements BaseEntity, JSONable<ManualContrato> {

    private mappablemanual: MappableEntities<Manual>;

    constructor(
        public id?: any,
        public artificialId?: number,
        public manuais?: Manual[],
        public contratos?: Contrato,
        public dataInicioVigencia?: Date,
        public dataFimVigencia?: Date,
        public ativo?: boolean,
        public garantia?: number
    ) {
        if (manuais) {
            this.mappablemanual = new MappableEntities<Manual>(manuais);
        } else {
            this.manuais = [];
            this.mappablemanual = new MappableEntities<Manual>();
        }
     }

    addManual(manual: Manual) {
        this.mappablemanual.push(manual);
        this.manuais = this.mappablemanual.values();
    }

    toJSONState(): ManualContrato {
        const copy: ManualContrato = Object.assign({}, this);
        return copy;
    }

    copyFromJSON(json: any) {
        const manuais: Manual[] = json.manual.map(m => new Manual().copyFromJSON(m));
        const newManualContrato = new ManualContrato(json.id, null, manuais, json.contratos
            , json.dataInicioVigencia, json.dataFimVigencia, json.ativo, json.garantia);
        return newManualContrato;
    }

}
