import { BaseEntity, MappableEntities, JSONable } from '../shared';
import { Contrato } from '../contrato';
import { EsforcoFase } from '../esforco-fase/index';
import { Sistema } from '../sistema/index';
import { FuncaoDados, TipoFuncaoDados, FuncaoDadosFormComponent } from '../funcao-dados/index';
import { Complexidade } from '../analise-shared/complexidade-enum';
import { ResumoTotal, ResumoFuncoes } from '../analise-shared/resumo-funcoes';
import { FuncaoTransacao } from '../funcao-transacao/funcao-transacao.model';
import { FatorAjuste } from '../fator-ajuste';
import { ModuloDaFuncionalidadeFinder } from './modulo-finder';
import { Modulo } from '../modulo';
import { FuncaoAnalise } from '../analise-shared/funcao-analise';
import { Organizacao } from '../organizacao';
import { TipoEquipe } from '../tipo-equipe';
import { Manual } from '../manual';

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

export class Analise implements BaseEntity, JSONable<Analise> {

  private mappableFuncaoDados: MappableEntities<FuncaoDados>;

  private mappableFuncaoTransacaos: MappableEntities<FuncaoTransacao>;

  private _resumoFuncaoDados: ResumoFuncoes;

  private _resumoFuncaoTransacao: ResumoFuncoes;

  private _resumoTotal: ResumoTotal;

  constructor(
    public id?: number,
    public numeroOs?: string,
    public metodoContagem?: MetodoContagem,
    public fatorAjuste?: FatorAjuste,
    public valorAjuste?: number,
    public pfTotal?: string,
    public adjustPFTotal?: string,
    public escopo?: string,
    public fronteiras?: string,
    public documentacao?: string,
    public tipoAnalise?: TipoContagem,
    public propositoContagem?: string,
    public sistema?: Sistema,
    public funcaoDados?: FuncaoDados[],
    public funcaoTransacaos?: FuncaoTransacao[],
    public organizacao?: Organizacao,
    public contrato?: Contrato,
    public esforcoFases?: EsforcoFase[],
    public observacoes?: string,
    public baselineImediatamente?: boolean,
    public dataHomologacao?: Date,
    public identificadorAnalise?: string,
    public equipeResponsavel?: TipoEquipe,
    public manual?: Manual

  ) {
    this.inicializaMappables(funcaoDados, funcaoTransacaos);
    this.inicializaResumos();

    // TODO
    if (!baselineImediatamente) {
      this.baselineImediatamente = false;
    }
  }

  private inicializaMappables(funcaoDados: FuncaoDados[], funcaoTransacaos) {
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
    this.pfTotal = this._resumoTotal.getTotalPf().toString();
    this.adjustPFTotal = this._resumoTotal.getTotalGrossPf().toString();
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

    if (copy.esforcoFases) {
      copy.esforcoFases = copy.esforcoFases.map(ef => ef.toJSONState());
    }

    return copy;
  }

  // como AnaliseCopyFromJSON chama new() no inicio do processo, construtor não roda como deveria
  copyFromJSON(json: any): Analise {
    const analiseCopiada: Analise =  new AnaliseCopyFromJSON(json).copy();
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
    this.funcaoDados.forEach(f => {
      resumo.somaFuncao(f);
    });
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
    this.funcaoTransacaos.forEach(f => {
      resumo.somaFuncao(f);
    });
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
    this._analiseConverted.fatorAjuste = this._json.fatorAjuste;
    this._analiseConverted.valorAjuste = this._json.valorAjuste;
    this._analiseConverted.pfTotal = this._json.pfTotal;
    this._analiseConverted.adjustPFTotal = this._json.adjustPFTotal;
    this._analiseConverted.escopo = this._json.escopo;
    this._analiseConverted.fronteiras = this._json.fronteiras;
    this._analiseConverted.documentacao = this._json.documentacao;
    this._analiseConverted.tipoAnalise = this._json.tipoAnalise;
    this._analiseConverted.propositoContagem = this._json.propositoContagem;
    this._analiseConverted.observacoes = this._json.observacoes;
    this._analiseConverted.baselineImediatamente = this._json.baselineImediatamente;
    this._analiseConverted.dataHomologacao = this._json.dataHomologacao;
    this._analiseConverted.identificadorAnalise = this._json.identificadorAnalise;
    this._analiseConverted.equipeResponsavel = this._json.equipeResponsavel;
    this._analiseConverted.manual = this._json.manual;

    if (!this._analiseConverted.baselineImediatamente) {
      this._analiseConverted.baselineImediatamente = false;
    }
  }

  private converteFuncoes() {
    const sistema = this._analiseConverted.sistema;
    this.inicializaFuncoesFromJSON();
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

  private populaModuloDasFuncionalidadesDasFuncoes(funcoes: FuncaoAnalise[], sistema: Sistema) {
    if (funcoes) {
      funcoes.forEach(f => {
        const modulo = ModuloDaFuncionalidadeFinder.find(sistema, f.funcionalidade.id);
        f.funcionalidade.modulo = modulo;
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
    this._analiseConverted.esforcoFases = this._json.esforcoFases
      .map(efJSON => new EsforcoFase().copyFromJSON(efJSON));
  }

}
