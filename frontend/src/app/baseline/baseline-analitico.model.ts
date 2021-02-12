export class BaselineAnalitico {
    constructor(
        public idsistema?: number,
        public analiseid?: number,
        public equipeResponsavelId?: number,
        public idfuncaodados?: number,
        public tipo?: string,
        public classificacao?: string,
        public impacto?: string,
        public nome?: string,
        public sigla?: string,
        public name?: string,
        public nomeEquipe?: string,
        public pf?: number,
        public dataHomologacao?: string,
        public complexidade?: string,
        public der?: number,
        public rlralr?: number,
        public idfuncionalidade?: number,
        public nomeFuncionalidade?: string,
        public nomeModulo?: string, 
    ){}

    static convertJsonToObject(json: any): BaselineAnalitico {
        const sintetico = Object.create(BaselineAnalitico.prototype);
        return Object.assign(sintetico, json, {
            created: new Date(json.created)
        });
    }
}
