import { BaseEntity, MappableEntities, JSONable } from '../shared';
import { Contrato } from '../contrato';
import { EsforcoFase } from '../esforco-fase/index';
import { Sistema } from '../sistema/index';
import { FuncaoDados, TipoFuncaoDados, FuncaoDadosFormComponent } from '../funcao-dados/index';
import { Complexidade } from '../analise-shared/complexidade-enum';
import { ResumoTotal, ResumoFuncoes } from '../analise-shared/resumo-funcoes';
import { FuncaoTransacao } from '../funcao-transacao/index';
import { FatorAjuste } from '../fator-ajuste';
import { ModuloDaFuncionalidadeFinder } from './modulo-finder';
import { Modulo } from '../modulo';
import { FuncaoAnalise } from '../analise-shared/funcao-analise';
import { Organizacao } from '../organizacao';

export const enum MetodoContagem {
  'DETALHADA',
  'INDICATIVA',
  'ESTIMADA'
}
export const enum TipoAnalise {
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
    public tipoContagem?: MetodoContagem,
    public fatorAjuste?: FatorAjuste,
    public valorAjuste?: number,
    public pfTotal?: string,
    public escopo?: string,
    public fronteiras?: string,
    public documentacao?: string,
    public tipoAnalise?: TipoAnalise,
    public propositoContagem?: string,
    public sistema?: Sistema,
    public funcaoDados?: FuncaoDados[],
    public funcaoTransacaos?: FuncaoTransacao[],
    public organizacao?: Organizacao,
    public contrato?: Contrato,
    public esforcoFases?: EsforcoFase[],
  ) {
    this.inicializaMappables(funcaoDados, funcaoTransacaos);
    this.inicializaResumos();
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

  // FIXME quando for edicao?
  private inicializaResumos() {
    this._resumoFuncaoDados = new ResumoFuncoes(FuncaoDados.tipos());
    this._resumoFuncaoTransacao = new ResumoFuncoes(FuncaoTransacao.tipos());
    this.generateResumoTotal();
  }

  private generateResumoTotal() {
    // TODO setar pfTotal
    // TODO criar e setar adjustPFTotal
    this._resumoTotal = new ResumoTotal(this._resumoFuncaoDados, this._resumoFuncaoTransacao);
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

    console.log(copy.esforcoFases);

    if (copy.esforcoFases) {
      copy.esforcoFases = copy.esforcoFases.map(ef => ef.toJSONState());
    }

    console.log('analise sendo enviada...');
    console.log(JSON.stringify(copy, null, 4));

    return copy;
  }

  copyFromJSON(json: any): Analise {
    return new AnaliseCopyFromJSON(json).copy();
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
    this.generateResumoFuncaoDados();
    this.generateResumoTotal();
  }

  // potencial para ficar bem eficiente
  // inserção/alteração/deleção pode ser feita por elemento
  private generateResumoFuncaoDados() {
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
    this._analiseConverted.tipoContagem = this._json.tipoContagem;
    this._analiseConverted.fatorAjuste = this._json.fatorAjuste;
    this._analiseConverted.valorAjuste = this._json.valorAjuste;
    this._analiseConverted.pfTotal = this._json.pfTotal;
    this._analiseConverted.escopo = this._json.escopo;
    this._analiseConverted.fronteiras = this._json.fronteiras;
    this._analiseConverted.documentacao = this._json.documentacao;
    this._analiseConverted.tipoAnalise = this._json.tipoAnalise;
    this._analiseConverted.propositoContagem = this._json.propositoContagem;
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
