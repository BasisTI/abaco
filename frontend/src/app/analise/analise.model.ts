import { UserService } from './../user/user.service';
import { Manual } from './../manual/manual.model';
import { Contrato } from '../contrato';
import { EsforcoFase } from '../esforco-fase/index';
import { Sistema } from '../sistema/index';
import { ResumoTotal, ResumoFuncoes } from '../analise-shared/resumo-funcoes';
import { FatorAjuste } from '../fator-ajuste';
import { FuncaoAnalise } from '../analise-shared/funcao-analise';
import { Organizacao } from '../organizacao';
import { TipoEquipe } from '../tipo-equipe';
import { User } from '../user';
import { AnaliseShareEquipe } from './analise-share-equipe.model';
import { BaseEntity } from '../shared';
import { MappableEntities } from '../shared/mappable-entities';
import { ModuloDaFuncionalidadeFinder } from './modulo-finder';
import { FuncaoDados } from '../funcao-dados';
import { FuncaoTransacao } from '../funcao-transacao';
import { Status } from '../status/status.model';

export enum MetodoContagem {
    'DETALHADA' = 'DETALHADA',
    'INDICATIVA' = 'INDICATIVA',
    'ESTIMADA' = 'ESTIMADA'
}

export const enum TipoContagem {
    'DESENVOLVIMENTO',
    'MELHORIA',
    'APLICACAO'
}

export class Analise implements BaseEntity {

    private mappableFuncaoDados: MappableEntities<FuncaoDados>;

    private mappableFuncaoTransacaos: MappableEntities<FuncaoTransacao>;

    private _resumoFuncaoDados: ResumoFuncoes;

    private _resumoFuncaoTransacao: ResumoFuncoes;

    private _resumoTotal: ResumoTotal;

    private userService: UserService;

    constructor(
        public id?: number,
        public numeroOs?: string,
        public metodoContagem?: MetodoContagem,
        public fatorAjuste?: FatorAjuste,
        public valorAjuste?: number,
        public pfTotal?: string,
        public pfTotalEsforco?: string,
        public adjustPFTotal?: string,
        public escopo?: string,
        public fronteiras?: string,
        public documentacao?: string,
        public tipoAnalise?: TipoContagem,
        public propositoContagem?: string,
        public sistema?: Sistema,
        public enviarBaseline?: boolean,
        public funcaoDados?: FuncaoDados[],
        public funcaoTransacaos?: FuncaoTransacao[],
        public organizacao?: Organizacao,
        public contrato?: Contrato,
        public esforcoFases?: EsforcoFase[],
        public observacoes?: string,
        public baselineImediatamente?: boolean,
        public dataHomologacao?: any,
        public identificadorAnalise?: string,
        public equipeResponsavel?: TipoEquipe,
        public createdBy?: User,
        public createdOn?: Date,
        public updatedOn?: Date,
        public bloqueiaAnalise?: boolean,
        public compartilhadas?: AnaliseShareEquipe[],
        public dataCriacaoOrdemServico?: any,
        public manual?: Manual,
        public users?: User[],
        public status?: Status,
        public analisesComparadas?: Analise[],
        public analiseClonadaParaEquipe?: Analise,
        public analiseClonou?: boolean,
        public fatorCriticidade?: boolean,
        public valorCriticidade?: number,
        public scopeCreep?: number,
    ) {
        this.inicializaMappables(funcaoDados, funcaoTransacaos);
        this.inicializaResumos();

        if(!fatorCriticidade){
            this.fatorCriticidade = false;
            this.valorCriticidade = 35;
        }
        if(!scopeCreep){
            this.scopeCreep = 35;
        }

        // TODO
        if (!baselineImediatamente) {
            this.baselineImediatamente = false;
        }
    }
    private inicializaMappables(funcaoDados: FuncaoDados[], funcaoTransacaos: FuncaoTransacao[]) {
        if (funcaoDados) {
            this.mappableFuncaoDados = new MappableEntities<FuncaoDados>(funcaoDados);
        } else {
            this.mappableFuncaoDados = new MappableEntities<FuncaoDados>();
        }
        if (funcaoTransacaos) {
            this.mappableFuncaoTransacaos = new MappableEntities<FuncaoTransacao>(funcaoTransacaos);
        } else {
            this.mappableFuncaoTransacaos = new MappableEntities<FuncaoTransacao>();
        }
    }
    private inicializaResumos() {
        this._resumoFuncaoDados = new ResumoFuncoes(FuncaoDados.tipos());
        this._resumoFuncaoTransacao = new ResumoFuncoes(FuncaoTransacao.tipos());
        this.generateResumoTotal();
    }
    private generateResumoTotal() {
        this._resumoTotal = new ResumoTotal(this._resumoFuncaoDados, this._resumoFuncaoTransacao);
        this.pfTotal = this._resumoTotal.getTotalGrossPf().toString();
        this.adjustPFTotal = this.aplicaTotalEsforco(this.ajustarPfTotal()).toFixed(2).toString();
        this.pfTotalEsforco = this.aplicaTotalEsforco(this._resumoTotal.getTotalGrossPf()).toFixed(2).toString();
    }
    /**
     * VERIFICAR CÁLCULO - Cálculo modificado par arefletir a nova forma de salvar
     * Porcentagens no banco
     * Renomenando método de "calcularPfTotalAjustado()"
     * para "aplicaTotalEsforco()" por motivo de legibilidade e clareza
     */
    private aplicaTotalEsforco(pf: number): number {
        return (pf * this.totalEsforcoFases()) / 100;
    }
    /**
     * Renomenando método de "pfTotalAjustadoSomentePorFatorAjuste()"
     * para "ajustarPfTotal()" por motivo de legibilidade e clareza
     */
    private ajustarPfTotal(): number {
        const pfTotalAjustado = this._resumoTotal.getTotalPf();
        if (this.fatorAjuste) {
            return this.aplicarFator(pfTotalAjustado);
        }
        return pfTotalAjustado;
    }
    aplicarFator(pf: number): number {
        if (this.fatorAjuste.tipoAjuste === 'UNITARIO') {
            return this.fatorAjuste.fator;
        } else {
            return pf * this.fatorAjuste.fator;
        }
    }
    private totalEsforcoFases(): number {
        const initialValue = 0;
        if (this.esforcoFases) {
            return this.esforcoFases.reduce((val, ef) => val + ef.esforco, initialValue);
        }
        return 1;
    }

    // TODO extrair classe
    toJSONState(): Analise {
        // TODO clone() ?
        const copy: Analise = Object.assign({}, this);
        // TODO inicializar para evitar if?
        if (copy.funcaoDados) {
            copy.funcaoDados = copy.funcaoDados.map(fd => fd.toJSONState());
        }
        if (copy.funcaoTransacaos) {
            copy.funcaoTransacaos = copy.funcaoTransacaos.map(fd => fd.toJSONState());
        }
        if (copy.users) {
            copy.users = copy.users.map(user => Object.assign({}, user));
        }
        copy.sistema = Sistema.toNonCircularJson(copy.sistema);

        // um clone talvez resolva, mas o clone deve manter os mappables?
        copy.mappableFuncaoDados = undefined;
        copy.mappableFuncaoTransacaos = undefined;
        copy._resumoFuncaoDados = undefined;
        copy._resumoFuncaoTransacao = undefined;
        copy._resumoTotal = undefined;

        if (copy.fatorAjuste) {
            copy.valorAjuste = copy.fatorAjuste.fator;
        }
        return copy;
    }

    // como AnaliseCopyFromJSON chama new() no inicio do processo, construtor não roda como deveria
    copyFromJSON(json: any): Analise {
        const analiseCopiada: Analise = new AnaliseCopyFromJSON(json).copy();
        analiseCopiada.inicializaMappables(analiseCopiada.funcaoDados, analiseCopiada.funcaoTransacaos);
        analiseCopiada.generateAllResumos();
        return analiseCopiada;
    }

    private generateAllResumos() {
        this.generateResumoFuncoesDados();
        this.generateResumoFuncoesTransacao();
        this.generateResumoTotal();
    }

    public get resumoTotal(): ResumoTotal {
        return this._resumoTotal;
    }

    public get resumoFuncaoDados(): ResumoFuncoes {
        return this._resumoFuncaoDados;
    }

    public get resumoFuncaoTransacoes(): ResumoFuncoes {
        return this._resumoFuncaoTransacao;
    }

    public addFuncaoDados(funcaoDados: FuncaoDados) {
        this.mappableFuncaoDados.push(funcaoDados);
        this.atualizarFuncoesDados();
    }

    private atualizarFuncoesDados() {
        this.funcaoDados = this.mappableFuncaoDados.values();
        this.generateResumoFuncoesDados();
        this.generateResumoTotal();
    }

    // potencial para ficar bem eficiente
    // inserção/alteração/deleção pode ser feita por elemento
    private generateResumoFuncoesDados() {
        const resumo: ResumoFuncoes = new ResumoFuncoes(FuncaoDados.tipos());
        if (this.funcaoDados) {
            this.funcaoDados.forEach(f => {
                resumo.somaFuncao(f);
            });
        }
        this._resumoFuncaoDados = resumo;
    }

    updateFuncaoDados(funcaoDados: FuncaoDados) {
        this.mappableFuncaoDados.update(funcaoDados);
        this.atualizarFuncoesDados();
    }

    deleteFuncaoDados(funcaoDados: FuncaoDados) {
        this.mappableFuncaoDados.delete(funcaoDados);
        this.atualizarFuncoesDados();
    }

    addFuncaoTransacao(funcaoTransacao: FuncaoTransacao) {
        this.mappableFuncaoTransacaos.push(funcaoTransacao);
        this.atualizarFuncoesTransacao();
    }

    private atualizarFuncoesTransacao() {
        this.funcaoTransacaos = this.mappableFuncaoTransacaos.values();
        this.generateResumoFuncoesTransacao();
        this.generateResumoTotal();
    }

    private generateResumoFuncoesTransacao() {
        const resumo: ResumoFuncoes = new ResumoFuncoes(FuncaoTransacao.tipos());
        if (this.funcaoTransacaos) {
            this.funcaoTransacaos.forEach(f => {
                resumo.somaFuncao(f);
            });
        }
        this._resumoFuncaoTransacao = resumo;
    }

    updateFuncaoTransacao(funcaoTransacao: FuncaoTransacao) {
        this.mappableFuncaoTransacaos.update(funcaoTransacao);
        this.atualizarFuncoesTransacao();
    }

    deleteFuncaoTransacao(funcaoTransacao: FuncaoTransacao) {
        this.mappableFuncaoTransacaos.delete(funcaoTransacao);
        this.atualizarFuncoesTransacao();
    }

    clone(): Analise {
        return new Analise(
            this.id,
            this.numeroOs,
            this.metodoContagem,
            this.fatorAjuste,
            this.valorAjuste,
            this.pfTotal,
            this.pfTotalEsforco,
            this.adjustPFTotal,
            this.escopo,
            this.fronteiras,
            this.documentacao,
            this.tipoAnalise,
            this.propositoContagem,
            this.sistema,
            this.enviarBaseline,
            this.funcaoDados,
            this.funcaoTransacaos,
            this.organizacao,
            this.contrato,
            this.esforcoFases,
            this.observacoes,
            this.baselineImediatamente,
            this.dataHomologacao,
            this.identificadorAnalise,
            this.equipeResponsavel,
            this.createdBy,
            this.createdOn,
            this.updatedOn,
            this.bloqueiaAnalise,
            this.compartilhadas,
            this.dataCriacaoOrdemServico,
            this.manual,
            this.users,
            this.status,
            this.analisesComparadas,
            this.analiseClonadaParaEquipe,
            this.analiseClonou,
            this.fatorCriticidade,
            this.valorCriticidade,
            this.scopeCreep,
            );
    }

}

class AnaliseCopyFromJSON {

    private _json: any;

    private _analiseConverted: Analise;

    constructor(json: any) {
        this._json = json;
        this._analiseConverted = new Analise();
    }

    public copy(): Analise {
        this.converteValoresTriviais();
        this.converteSistema();
        this.converteFuncoes();
        this.converteOrganizacao();
        this.converteContrato();
        this.converteEsforcoFases();
        this.converteManual();
        this.converteStatus();
        return this._analiseConverted;
    }

    private converteSistema() {
        const sistema = Sistema.fromJSON(this._json.sistema);
        this._analiseConverted.sistema = sistema;
    }

    private converteValoresTriviais() {
        this._analiseConverted.id = this._json.id;
        this._analiseConverted.numeroOs = this._json.numeroOs;
        this._analiseConverted.metodoContagem = this._json.metodoContagem;
        this._analiseConverted.valorAjuste = this._json.valorAjuste;
        this._analiseConverted.pfTotal = this._json.pfTotal;
        this._analiseConverted.pfTotalEsforco = this._json.pfTotalEsforco;
        this._analiseConverted.adjustPFTotal = this._json.adjustPFTotal;
        this._analiseConverted.escopo = this._json.escopo;
        this._analiseConverted.fronteiras = this._json.fronteiras;
        this._analiseConverted.documentacao = this._json.documentacao;
        this._analiseConverted.tipoAnalise = this._json.tipoAnalise;
        this._analiseConverted.enviarBaseline = this._json.enviarBaseline;
        this._analiseConverted.propositoContagem = this._json.propositoContagem;
        this._analiseConverted.observacoes = this._json.observacoes;
        this._analiseConverted.baselineImediatamente = this._json.baselineImediatamente;
        this._analiseConverted.dataHomologacao = this._json.dataHomologacao;
        this._analiseConverted.dataCriacaoOrdemServico = this._json.dataCriacaoOrdemServico;
        this._analiseConverted.identificadorAnalise = this._json.identificadorAnalise;
        this._analiseConverted.equipeResponsavel = this._json.equipeResponsavel;
        if (this._json.audit) {
            this._analiseConverted.createdOn = this._json.audit.createdOn;
            this._analiseConverted.updatedOn = this._json.audit.updatedOn;
        }
        this._analiseConverted.bloqueiaAnalise = this._json.bloqueiaAnalise;
        this._analiseConverted.compartilhadas = this._json.compartilhadas;

        if (!this._analiseConverted.baselineImediatamente) {
            this._analiseConverted.baselineImediatamente = false;
        }
        this._analiseConverted.users = this._json.users;
        this._analiseConverted.fatorCriticidade = this._json.fatorCriticidade;
        this._analiseConverted.valorCriticidade = this._json.valorCriticidade;
        if(!this._analiseConverted.fatorCriticidade){
            this._analiseConverted.fatorCriticidade = false;
            this._analiseConverted.valorCriticidade = 35;
        }
        this._analiseConverted.scopeCreep = this._json.scopeCreep;
        if(!this._analiseConverted.scopeCreep){
            this._analiseConverted.scopeCreep = 35;
        }
    }

    private converteFuncoes() {
        const sistema = this._analiseConverted.sistema;
        this.inicializaFuncoesFromJSON();
        this.iniciarFatorAjusteFromJSON();
        this.populaModuloDasFuncionalidadesDasFuncoes(this._analiseConverted.funcaoDados, sistema);
        this.populaModuloDasFuncionalidadesDasFuncoes(this._analiseConverted.funcaoTransacaos, sistema);
    }

    private inicializaFuncoesFromJSON() {
        if (this._json.funcaoDados) {
            this._analiseConverted.funcaoDados = this._json.funcaoDados
                .map(fJSON => new FuncaoDados().copyFromJSON(fJSON));
        }
        if (this._json.funcaoTransacaos) {
            this._analiseConverted.funcaoTransacaos = this._json.funcaoTransacaos
                .map(fJSON => new FuncaoTransacao().copyFromJSON(fJSON));
        }
    }

    private iniciarFatorAjusteFromJSON() {
        if (this._json.fatorAjuste) {
            this._analiseConverted.fatorAjuste = new FatorAjuste().copyFromJSON(this._json.fatorAjuste);
        }
    }

    private populaModuloDasFuncionalidadesDasFuncoes(funcoes: FuncaoAnalise[], sistema: Sistema) {
        if (funcoes) {
            funcoes.forEach(f => {
                if (!(f.funcionalidade.modulo && f.funcionalidade.modulo.nome )) {
                    const modulo = ModuloDaFuncionalidadeFinder.find(sistema, f.funcionalidade.id);
                    f.funcionalidade.modulo = modulo;
                }
            });
        }
    }

    private converteOrganizacao() {
        this._analiseConverted.organizacao = new Organizacao().copyFromJSON(this._json.organizacao);
    }

    private converteContrato() {
        this._analiseConverted.contrato = new Contrato().copyFromJSON(this._json.contrato);
    }

    private converteEsforcoFases() {
        if (this._json.esforcoFases) {
            this._analiseConverted.esforcoFases = this._json.esforcoFases
                .map(efJSON => new EsforcoFase().copyFromJSON(efJSON));
        }
    }

    private converteManual() {
        if (this._json.contrato !== null) {
            this._analiseConverted.manual = new Manual().copyFromJSON(this._json.manual);
        } else {
            this._analiseConverted.manual = new Manual();
        }
    }
    private converteStatus() {
        if (this._json.status !== null) {
            this._analiseConverted.status = new Status(this._json.status.id, this._json.status.nome, this._json.status.ativo);
        } else {
            this._analiseConverted.status = new Status();
        }
    }
}
