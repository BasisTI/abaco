import { TipoEquipe } from "../../tipo-equipe";
import { Organizacao } from "../../organizacao";
import { Sistema } from "../../sistema";

export class Grupo {

    constructor(
        public idAnalise?: number,
        public organizacao?: string,
        public identificadorAnalise?: string,
        public equipe?: string,
        public sistema?: string,
        public metodoContagem?: string,
        public pfTotal?: string,
        public pfAjustado?: string,
        public diasDeGarantia?: number,
        public dataCriacao?: any,
        public dataHomologacao?: any,
        public bloqueado?: boolean
    ) {
    }

    static convertJsonToObject(json: any): Grupo {
        const grupo = Object.create(Grupo.prototype);
        return Object.assign(grupo, json, {
            created: new Date(json.created)
        });
    }
}

export class SearchGroup {

    constructor(
        public organizacao?: Organizacao,
        public identificadorAnalise?: string,
        public equipe?: TipoEquipe,
        public sistema?: Sistema,
        public metodoContagem?: string,
    ) {
    }

    static convertJsonToObject(json: any): Grupo {
        const grupo = Object.create(Grupo.prototype);
        return Object.assign(grupo, json, {
            created: new Date(json.created)
        });
    }
}
