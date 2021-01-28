import {BaseEntity} from '../shared';
import { FatorAjuste } from '../fator-ajuste';
import { EsforcoFase } from '../esforco-fase';
import { MappableEntities } from '../shared/mappable-entities';
import { Upload } from '../upload/upload.model';

export class Manual implements BaseEntity {
    private mappablePhaseEfforts: MappableEntities<EsforcoFase>;
    private mappableAdjustFactors: MappableEntities<FatorAjuste>;

    constructor(
        public id?: number,
        public nome?: string,
        public observacao?: string,
        public valorVariacaoEstimada?: number,
        public valorVariacaoIndicativa?: number,
        public arquivosManual?: any[],
        public fatoresAjuste?: FatorAjuste[],
        public esforcoFases?: EsforcoFase[],
        public artificialId?: number,
        public parametroInclusao?: number,
        public parametroAlteracao?: number,
        public parametroExclusao?: number,
        public parametroConversao?: number,
        public versaoCPM?: number,
    ) {
        if (esforcoFases) {
            this.mappablePhaseEfforts = new MappableEntities<EsforcoFase>(esforcoFases);
        } else {
            this.esforcoFases = [];
            this.mappablePhaseEfforts = new MappableEntities<EsforcoFase>();
        }

        if (fatoresAjuste) {
            this.mappableAdjustFactors = new MappableEntities<FatorAjuste>(fatoresAjuste);
        } else {
            this.mappableAdjustFactors = new MappableEntities<FatorAjuste>();
        }
    }

    static convertManualJsonToObject(json: any) {
        const sintetico = Object.create(Manual.prototype);
        return Object.assign(sintetico, json, {
            created: new Date(json.created)
        });
    }

    toJSONState(): Manual {
        const copy: Manual = Object.assign({}, this);
        return copy;
    }

    copyFromJSON(jsonObject: any) {
        if (jsonObject) {
                const fatoresAjuste: FatorAjuste[] = jsonObject.fatoresAjuste ? jsonObject.fatoresAjuste
                    .map(faJSON => new FatorAjuste().copyFromJSON(faJSON)) : [];
                const esforcoFases: EsforcoFase[] = jsonObject.esforcoFases ? jsonObject.esforcoFases
                    .map(efJSON => new EsforcoFase().copyFromJSON(efJSON)) : [];
                return new Manual(
                    jsonObject.id
                    , jsonObject.nome
                    , jsonObject.observacao
                    , jsonObject.valorVariacaoEstimada
                    , jsonObject.valorVariacaoIndicativa
                    , jsonObject.arquivosManual
                    , fatoresAjuste
                    , esforcoFases
                    , undefined
                    , jsonObject.parametroInclusao
                    , jsonObject.parametroAlteracao
                    , jsonObject.parametroExclusao
                    , jsonObject.parametroConversao
                    , jsonObject.versaoCPM
                    );
            }
        }

    get valorVariacaoIndicativaFormatado(): number {
        return this.valorVariacaoIndicativa;
    }

    set valorVariacaoIndicativaFormatado(valor: number) {
        this.valorVariacaoIndicativa = valor;
    }

    get valorVariacaoEstimadaFormatado(): number {
        return this.valorVariacaoEstimada;
    }

    set valorVariacaoEstimadaFormatado(valor: number) {
        this.valorVariacaoEstimada = valor;
    }

    get parametroInclusaoFormatado(): number {
        return this.parametroInclusao;
    }

    set parametroInclusaoFormatado(valor: number) {
        this.parametroInclusao = valor;
    }

    get parametroAlteracaoFormatado(): number {
        return this.parametroAlteracao;
    }

    set parametroAlteracaoFormatado(valor: number) {
        this.parametroAlteracao = valor;
    }

    get parametroExclusaoFormatado(): number {
        return this.parametroExclusao;
    }

    set parametroExclusaoFormatado(valor: number) {
        this.parametroExclusao = valor;
    }

    get parametroConversaoFormatado(): number {
        return this.parametroConversao;
    }

    set parametroConversaoFormatado(valor: number) {
        this.parametroConversao = valor;
    }

    addEsforcoFases(esforcoFase: EsforcoFase) {
        this.mappablePhaseEfforts.push(esforcoFase);
        this.esforcoFases = this.mappablePhaseEfforts.values();
    }

    updateEsforcoFases(esforcoFase: EsforcoFase) {
        this.mappablePhaseEfforts.update(esforcoFase);
        this.esforcoFases = this.mappablePhaseEfforts.values();
    }

    deleteEsforcoFase(esforcoFase: EsforcoFase) {
        this.mappablePhaseEfforts.delete(esforcoFase);
        this.esforcoFases = this.mappablePhaseEfforts.values();
    }

    addFatoresAjuste(fatorAjuste: FatorAjuste) {
        this.mappableAdjustFactors.push(fatorAjuste);
        this.fatoresAjuste = this.mappableAdjustFactors.values();
    }

    updateFatoresAjuste(fatorAjuste: FatorAjuste) {
        this.mappableAdjustFactors.update(fatorAjuste);
        this.fatoresAjuste = this.mappableAdjustFactors.values();
    }

    deleteFatoresAjuste(fatorAjuste: FatorAjuste) {
        this.mappableAdjustFactors.delete(fatorAjuste);
        this.fatoresAjuste = this.mappableAdjustFactors.values();
    }

    clone(): Manual {
        return new Manual(
            this.id,
            this.nome,
            this.observacao,
            this.valorVariacaoEstimada,
            this.valorVariacaoIndicativa,
            this.arquivosManual,
            this.fatoresAjuste,
            this.esforcoFases,
            this.artificialId,
            this.parametroInclusao,
            this.parametroAlteracao,
            this.parametroExclusao,
            this.parametroConversao,
            this.versaoCPM);
    }

}
