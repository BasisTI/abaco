import {FuncaoDados} from '../funcao-dados/funcao-dados.model';
import {Complexidade} from '../analise-shared/complexidade-enum';
import {MetodoContagem} from '../analise/index';
import {TipoFatorAjuste, FatorAjuste} from '../fator-ajuste/fator-ajuste.model';
import {ComplexidadeFuncionalDados} from './calculadora/complexidade-funcional-dados';
import {PFPorTiposComplexidades} from './calculadora/pf-por-tipos-complexidades';
import {CalculadoraFator} from './calculadora/calculadora-fator';
import {Manual} from '../manual/manual.model';
import {FatorAjusteImpactoRetriever} from './calculadora/fator-ajuste-impacto-retriever';

export class Calculadora {

    private static funcaoDados: FuncaoDados;

    private static metodoContagem: MetodoContagem;

    // ainda não sei como vai ficar após generalizar
    private static funcaoDadosCalculada: FuncaoDados;

    private static fatorPF: number;

    private static _manual: Manual;

    private static _fatorAjuste: FatorAjuste;

    // TODO extrair uma interface implementada por FuncaoDados e FuncaoTransacao
    public static calcular(metodoContagem: MetodoContagem, funcaoDados: FuncaoDados, manual: Manual): FuncaoDados {
        this.inicializaVariaveis(metodoContagem, funcaoDados, manual);
        this.calcularDeAcordoComMetodoContagem();
        this.aplicarFator();
        return this.funcaoDadosCalculada;
    }

    private static inicializaVariaveis(metodoContagem: MetodoContagem, funcaoDados: FuncaoDados, manual: Manual) {
        this.funcaoDadosCalculada = funcaoDados.clone();
        this.funcaoDados = funcaoDados;
        this.metodoContagem = metodoContagem;
        this.defineFatorAjuste(funcaoDados, manual);
    }

    private static defineFatorAjuste(fd: FuncaoDados, manual: Manual) {
        this._fatorAjuste = FatorAjusteImpactoRetriever.retrieve(fd.fatorAjuste, fd.impacto, manual);
    }

    private static calcularDeAcordoComMetodoContagem() {
        switch (this.metodoContagem.toString()) {
            case 'INDICATIVA': {
                this.calcularIndicativa();
                break;
            }
            case 'ESTIMADA':
            case 'DETALHADA':
                this.calcularNaoIndicativa();
        }
    }

    private static calcularIndicativa() {
        this.funcaoDadosCalculada.der = '0';
        this.funcaoDadosCalculada.rlr = '0';
        this.funcaoDadosCalculada.complexidade = Complexidade.SEM;

        console.log("this.funcaoDados.quantidade ",this.funcaoDados.quantidade);

        if (this.funcaoDados.quantidade === undefined) {

            this.definePFIndicativaDeAcordoComGrupoDadosLogicos();
        } else {
            this.definePFIndicativaDeAcordoComAQuantidade();

        }

    }

    private static definePFIndicativaDeAcordoComAQuantidade() {
        const fator: number = this.funcaoDados.fatorAjuste.fator * 100;
        this.funcaoDadosCalculada.pf = fator * this.funcaoDados.quantidade;
    }

    private static definePFIndicativaDeAcordoComGrupoDadosLogicos() {
        // TODO extrair constantes

        if (this.funcaoDados.tipo === 'ALI') {
            this.funcaoDadosCalculada.pf = 35;
        } else { // AIE
            this.funcaoDadosCalculada.pf = 15;
        }
    }

    private static calcularNaoIndicativa() {
        this.definirComplexidade();
        this.calcularPfsDeAcordoComGrupoDeDadosLogicos();
    }

    private static definirComplexidade() {
        // FIXME é isso aqui mesmo? funcao de dados sempre vai ter fatorAjuste?
        if (this._fatorAjuste.isUnitario()) {
            this.funcaoDadosCalculada.complexidade = Complexidade.SEM;
        } else {
            this.definirComplexidadePercentual();
        }
    }

    private static definirComplexidadePercentual() {
        this.funcaoDadosCalculada.complexidade =
            ComplexidadeFuncionalDados.calcular(this.funcaoDados.derValue(), this.funcaoDados.rlrValue());
    }

    private static calcularPfsDeAcordoComGrupoDeDadosLogicos() {
        this.funcaoDadosCalculada.pf = PFPorTiposComplexidades.getPorTipoEComplexidade(
            this.funcaoDados.tipo, this.funcaoDadosCalculada.complexidade
        );
    }

    // FIXME aplicar fator que vem da aba geral também
    private static aplicarFator() {
        this.funcaoDadosCalculada.grossPF = this.funcaoDadosCalculada.pf;
        this.funcaoDadosCalculada.pf = CalculadoraFator.aplicarFator(
            this.funcaoDadosCalculada.pf, this._fatorAjuste, this.funcaoDados.quantidade
        );
    }

}
