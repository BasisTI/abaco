export class BaselineSintetico {

    constructor(
        public idsistema?: number,
        public sigla?: string,
        public  nome?: string,
        public numeroocorrencia?: string,
        public sum?: number
    ){}

    static convertJsonToObject(json: any): BaselineSintetico {
        const sintetico = Object.create(BaselineSintetico.prototype);
        return Object.assign(sintetico, json, {
            created: new Date(json.created)
        });
    }
}
