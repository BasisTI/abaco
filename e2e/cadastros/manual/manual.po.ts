import {PrimengInputText} from '../../componentes/primeng-inputtext';
import {browser, by} from 'protractor';
import {PrimengComponent} from '../../componentes/primeng-component';
import {PrimengMenu} from '../../componentes/primeng-menu';
import {PrimengBlockUi} from '../../componentes/primeng-block-ui';
import {PrimengButton} from '../../componentes/primeng-button';
import {PrimengTextArea} from '../../componentes/primeng-textarea';
import {PrimengFileUpload} from '../../componentes/primeng-fileupload';
import {PrimengDropdown} from '../../componentes/primeng-dropdown';
import {PrimengGrowl} from '../../componentes/primeng-growl';
import {PrimengDataTable} from '../../componentes/primeng-datatable';
import {PrimengPaginator} from '../../componentes/primeng-paginator';
import {Download} from '../../componentes/download';

class Manual {
    nome: string;
    estimada: string;
    indicativa: string;
    observacao: string;
    inclusao: string;
    alteracao: string;
    exclusao: string;
    convesao: string;

    fase: Fase[];
    deflator: Deflator[];
}

class Fase {
    fase: string;
    esforco: string;
}

class Deflator {
    nome: string;
    ajuste: string;
    deflator: string;
    descricao: string;
    codigo: string;
    origem: string;
}

export class ManualPage {
    private promises = [];
    private manual: Manual[];
    private data = require('./assets/Manual.json');


    login() {
        const username = 'admin';
        const password = 'admin';
        PrimengInputText.clearAndFillTextByLocator(by.name('username'), username);
        PrimengInputText.clearAndFillTextByLocator(by.name('password'), password);
        PrimengComponent.clickByLocator(by.css('.ui-button'));
    }

    navegar() {
        PrimengBlockUi.waitBlockUi(5000);
        PrimengMenu.clickByPath(['Cadastros', 'Manual']);
        PrimengBlockUi.waitBlockUi(5000);
    }

    clicarBotao(texto: string) {
        PrimengBlockUi.waitBlockUi(2000);
        PrimengButton.clickByText(texto);
    }

    cadastrarManualCamposObrigatorios() {
        PrimengBlockUi.waitBlockUi(2000);
        this.promises = [];
        let path: string;
        let id: string;

        id = 'idArquivoManualFormManual';
        path = '../cadastros/manual/assets/';
        PrimengFileUpload.inputFileByLocator(by.id(id), 'documento.pdf', path, id);

        PrimengButton.clickByLocator(by.id('idBtnNovoEsforcoFaseFormManual'));
        PrimengDropdown.selectValueByLocator(by.id('nome_fase'), 'Testes');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idEsforcoSaveFormManual .ui-spinner-input'), '25');
        PrimengButton.clickByLocator(by.id('idBtnSalvarSaveEsforcoFormManual'));
        PrimengGrowl.isWarningMessage('Registro incluído com sucesso!');
        PrimengGrowl.closeWarningMessage();

        PrimengButton.clickByLocator(by.id('idBtnNovoDeflatorFormManual'));
        PrimengInputText.clearAndFillTextByLocator(by.id('nome_fator_ajuste'), 'Deflator 1');
        PrimengDropdown.selectValueByLocator(by.id('tipo_ajuste'), 'Percentual');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idDeflatorDeflatorFormManual .ui-spinner-input'), '15');
        PrimengTextArea.clearAndFillTextByLocator(by.id('idDescricaoSaveFormManual'), 'Deflator de Testes');
        PrimengInputText.clearAndFillTextByLocator(by.id('codigo_fator'), '1');
        PrimengInputText.clearAndFillTextByLocator(by.id('origem_fator'), 'Brasilia');
        PrimengButton.clickByLocator(by.id('idBtnSalvarDeflatorSaveFormManual'));
        PrimengGrowl.isWarningMessage('Registro incluído com sucesso!');
        PrimengGrowl.closeWarningMessage();

        /*Nome*/
        PrimengInputText.clearAndFillTextByLocator(by.id('nome_manual'), '');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idValorVariacaoEstimadaFormManual .ui-spinner-input'), '1');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idValorVariacaoIndicativoFormManual .ui-spinner-input'), '2');
        PrimengInputText.clearAndFillTextByLocator(by.id('idObservacaoFormManual'), 'Observação Manual 1');

        PrimengInputText.clearAndFillTextByLocator(by.css('#idInclusaoFormManual .ui-spinner-input'), '2');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idAlteracaoFormManual .ui-spinner-input'), '2');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idExclusaoFormManual .ui-spinner-input'), '2');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idConvercaoFormManual .ui-spinner-input'), '2');

        PrimengButton.clickByLocator(by.id('idBtnSalvarFormManual'));

        this.promises.push(PrimengComponent.isErrorMessage('.ui-message', 'Campo obrigatório.'));
        PrimengGrowl.closeWarningMessage();

        /*Estimada*/
        PrimengInputText.clearAndFillTextByLocator(by.id('nome_manual'), 'Manual');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idValorVariacaoEstimadaFormManual .ui-spinner-input'), '');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idValorVariacaoIndicativoFormManual .ui-spinner-input'), '2');
        PrimengInputText.clearAndFillTextByLocator(by.id('idObservacaoFormManual'), 'Observação Manual 1');

        PrimengInputText.clearAndFillTextByLocator(by.css('#idInclusaoFormManual .ui-spinner-input'), '2');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idAlteracaoFormManual .ui-spinner-input'), '2');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idExclusaoFormManual .ui-spinner-input'), '2');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idConvercaoFormManual .ui-spinner-input'), '2');

        PrimengButton.clickByLocator(by.id('idBtnSalvarFormManual'));

        this.promises.push(PrimengComponent.isErrorMessage('.ui-message', 'Campo obrigatório.'));
        PrimengGrowl.closeWarningMessage();

        /*Indicativo*/
        PrimengInputText.clearAndFillTextByLocator(by.id('nome_manual'), 'Manual');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idValorVariacaoEstimadaFormManual .ui-spinner-input'), '1');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idValorVariacaoIndicativoFormManual .ui-spinner-input'), '');
        PrimengInputText.clearAndFillTextByLocator(by.id('idObservacaoFormManual'), 'Observação Manual 1');

        PrimengInputText.clearAndFillTextByLocator(by.css('#idInclusaoFormManual .ui-spinner-input'), '2');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idAlteracaoFormManual .ui-spinner-input'), '2');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idExclusaoFormManual .ui-spinner-input'), '2');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idConvercaoFormManual .ui-spinner-input'), '2');

        PrimengButton.clickByLocator(by.id('idBtnSalvarFormManual'));

        this.promises.push(PrimengComponent.isErrorMessage('.ui-message', 'Campo obrigatório.'));
        PrimengGrowl.closeWarningMessage();

        /*Inclusão*/
        PrimengInputText.clearAndFillTextByLocator(by.id('nome_manual'), 'Manual');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idValorVariacaoEstimadaFormManual .ui-spinner-input'), '1');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idValorVariacaoIndicativoFormManual .ui-spinner-input'), '3');
        PrimengInputText.clearAndFillTextByLocator(by.id('idObservacaoFormManual'), 'Observação Manual 1');

        PrimengInputText.clearAndFillTextByLocator(by.css('#idInclusaoFormManual .ui-spinner-input'), '');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idAlteracaoFormManual .ui-spinner-input'), '2');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idExclusaoFormManual .ui-spinner-input'), '2');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idConvercaoFormManual .ui-spinner-input'), '2');

        PrimengButton.clickByLocator(by.id('idBtnSalvarFormManual'));

        this.promises.push(PrimengComponent.isErrorMessage('.ui-message', 'Campo obrigatório.'));
        PrimengGrowl.closeWarningMessage();

        /*Alteração*/
        PrimengInputText.clearAndFillTextByLocator(by.id('nome_manual'), 'Manual');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idValorVariacaoEstimadaFormManual .ui-spinner-input'), '1');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idValorVariacaoIndicativoFormManual .ui-spinner-input'), '3');
        PrimengInputText.clearAndFillTextByLocator(by.id('idObservacaoFormManual'), 'Observação Manual 1');

        PrimengInputText.clearAndFillTextByLocator(by.css('#idInclusaoFormManual .ui-spinner-input'), '2');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idAlteracaoFormManual .ui-spinner-input'), '');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idExclusaoFormManual .ui-spinner-input'), '2');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idConvercaoFormManual .ui-spinner-input'), '2');

        PrimengButton.clickByLocator(by.id('idBtnSalvarFormManual'));

        this.promises.push(PrimengComponent.isErrorMessage('.ui-message', 'Campo obrigatório.'));
        PrimengGrowl.closeWarningMessage();

        /*Exclusão*/
        PrimengInputText.clearAndFillTextByLocator(by.id('nome_manual'), 'Manual');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idValorVariacaoEstimadaFormManual .ui-spinner-input'), '1');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idValorVariacaoIndicativoFormManual .ui-spinner-input'), '3');
        PrimengInputText.clearAndFillTextByLocator(by.id('idObservacaoFormManual'), 'Observação Manual 1');

        PrimengInputText.clearAndFillTextByLocator(by.css('#idInclusaoFormManual .ui-spinner-input'), '2');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idAlteracaoFormManual .ui-spinner-input'), '2');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idExclusaoFormManual .ui-spinner-input'), '');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idConvercaoFormManual .ui-spinner-input'), '2');

        PrimengButton.clickByLocator(by.id('idBtnSalvarFormManual'));

        this.promises.push(PrimengComponent.isErrorMessage('.ui-message', 'Campo obrigatório.'));
        PrimengGrowl.closeWarningMessage();

        /*Converão*/
        PrimengInputText.clearAndFillTextByLocator(by.id('nome_manual'), 'Manual');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idValorVariacaoEstimadaFormManual .ui-spinner-input'), '1');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idValorVariacaoIndicativoFormManual .ui-spinner-input'), '3');
        PrimengInputText.clearAndFillTextByLocator(by.id('idObservacaoFormManual'), 'Observação Manual 1');

        PrimengInputText.clearAndFillTextByLocator(by.css('#idInclusaoFormManual .ui-spinner-input'), '2');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idAlteracaoFormManual .ui-spinner-input'), '2');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idExclusaoFormManual .ui-spinner-input'), '3');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idConvercaoFormManual .ui-spinner-input'), '');

        PrimengButton.clickByLocator(by.id('idBtnSalvarFormManual'));

        this.promises.push(browser.wait(PrimengComponent.isErrorMessage('.ui-message', 'Campo obrigatório.')));
        PrimengGrowl.closeWarningMessage();

        /*Esforço Fase*/
        PrimengDataTable.clickCellTextByLocator(by.id('idTabelaEsforcoFaseFormManual'), '25');

        PrimengButton.clickByLocator(by.css('#idTabelaEsforcoFaseFormManual .ui-button-danger'));
        PrimengButton.clickByLocator(by.id('idBtnSimFormManual'));

        PrimengGrowl.closeWarningMessage();
        PrimengButton.clickByLocator(by.id('idBtnSalvarFormManual'));

        this.promises.push(browser.wait(PrimengGrowl.isWarningMessage('Por favor, preencha campos obrigatórios!')));
        PrimengGrowl.closeWarningMessage();

        /*Deflator*/
        PrimengButton.clickByLocator(by.id('idBtnNovoEsforcoFaseFormManual'));
        PrimengDropdown.selectValueByLocator(by.id('nome_fase'), 'Testes');
        PrimengInputText.clearAndFillTextByLocator(by.css('#idEsforcoSaveFormManual .ui-spinner-input'), '25');
        PrimengButton.clickByLocator(by.id('idBtnSalvarSaveEsforcoFormManual'));
        PrimengGrowl.isWarningMessage('Registro incluído com sucesso!');
        PrimengGrowl.closeWarningMessage();

        PrimengDataTable.clickCellTextByLocator(by.id('idTabelaDeflatorFormManual'), 'Deflator 1');
        PrimengButton.clickByLocator(by.css('#idTabelaDeflatorFormManual .ui-button-danger'));
        PrimengButton.clickByLocator(by.id('idBtnSimFormManual'));
        PrimengGrowl.closeWarningMessage();

        PrimengButton.clickByLocator(by.id('idBtnSalvarFormManual'));

        this.promises.push(browser.wait(PrimengGrowl.isWarningMessage('Por favor, preencha campos obrigatórios!')));
        PrimengGrowl.closeWarningMessage();

        return Promise.all(this.promises).then(resultados => {
            switch (false) {
                case resultados[0]:
                    return 'Campo "Nome" não mostrou a mensagem de Preenchimento Obrigatório';
                case resultados[1]:
                    return 'Campo "Estimada" não mostrou a mensagem de Preenchimento Obrigatório';
                case resultados[2]:
                    return 'Campo "Indicativa" não mostrou a mensagem de Preenchimento Obrigatório';
                case resultados[3]:
                    return 'Campo "Inclusão" não mostrou a mensagem de Preenchimento Obrigatório';
                case resultados[4]:
                    return 'Campo "Alteração" não mostrou a mensagem de Preenchimento Obrigatório';
                case resultados[5]:
                    return 'Campo "Exclusão" não mostrou a mensagem de Preenchimento Obrigatório';
                case resultados[6]:
                    return 'Campo "Conversão" não mostrou a mensagem de Preenchimento Obrigatório';
                case resultados[7]:
                    return 'Campo "Esforço Fase" não mostrou a mensagem de Preenchimento Obrigatório';
                case resultados[8]:
                    return 'Campo "Deflator" não mostrou a mensagem de Preenchimento Obrigatório';
                default:
                    return 'OK';
            }
        });
    }

    cadastrarManualDuplicidade() {
        PrimengBlockUi.waitBlockUi(2000);
        let path: string;
        let id: string;

        this.manual = this.data;

        this.clicarBotao('Novo');
        PrimengBlockUi.waitBlockUi(2000);
        PrimengInputText.clearAndFillTextByLocator(by.id('nome_manual'), this.manual[0].nome);
        PrimengInputText.fillTextByLocator(by.css('#idValorVariacaoEstimadaFormManual .ui-spinner-input'), this.manual[0].estimada);
        PrimengInputText.fillTextByLocator(by.css('#idValorVariacaoIndicativoFormManual .ui-spinner-input'), this.manual[0].indicativa);
        PrimengInputText.clearAndFillTextByLocator(by.id('idObservacaoFormManual'), this.manual[0].observacao);

        id = 'idArquivoManualFormManual';
        path = '../cadastros/manual/assets/';
        PrimengFileUpload.inputFileByLocator(by.id(id), 'documento.pdf', path, id);

        PrimengInputText.fillTextByLocator(by.css('#idInclusaoFormManual .ui-spinner-input'), this.manual[0].inclusao);
        PrimengInputText.fillTextByLocator(by.css('#idAlteracaoFormManual .ui-spinner-input'), this.manual[0].alteracao);
        PrimengInputText.fillTextByLocator(by.css('#idExclusaoFormManual .ui-spinner-input'), this.manual[0].exclusao);
        PrimengInputText.fillTextByLocator(by.css('#idConvercaoFormManual .ui-spinner-input'), this.manual[0].convesao);
        for (let j = 0; j < this.manual[0].fase.length; j++) {
            PrimengButton.clickByLocator(by.id('idBtnNovoEsforcoFaseFormManual'));
            PrimengDropdown.selectValueByLocator(by.id('nome_fase'), this.manual[0].fase[j].fase);
            PrimengInputText.fillTextByLocator(by.css('#idEsforcoSaveFormManual .ui-spinner-input'), this.manual[0].fase[j].esforco);
            PrimengButton.clickByLocator(by.id('idBtnSalvarSaveEsforcoFormManual'));
            PrimengGrowl.isWarningMessage('Registro incluído com sucesso!');
            PrimengGrowl.closeWarningMessage();
        }
        for (let j = 0; j < this.manual[0].deflator.length; j++) {
            PrimengButton.clickByLocator(by.id('idBtnNovoDeflatorFormManual'));
            PrimengInputText.clearAndFillTextByLocator(by.id('nome_fator_ajuste'), this.manual[0].deflator[j].nome);
            PrimengDropdown.selectValueByLocator(by.id('tipo_ajuste'), this.manual[0].deflator[j].ajuste);
            PrimengInputText.fillTextByLocator(by.css('#idDeflatorDeflatorFormManual .ui-spinner-input'),
                this.manual[0].deflator[j].deflator);

            PrimengTextArea.clearAndFillTextByLocator(by.id('idDescricaoSaveFormManual'), this.manual[0].deflator[j].descricao);

            PrimengInputText.clearAndFillTextByLocator(by.id('codigo_fator'), this.manual[0].deflator[j].codigo);
            PrimengInputText.clearAndFillTextByLocator(by.id('origem_fator'), this.manual[0].deflator[j].origem);
            PrimengButton.clickByLocator(by.id('idBtnSalvarDeflatorSaveFormManual'));
            PrimengGrowl.isWarningMessage('Registro incluído com sucesso!');
            PrimengGrowl.closeWarningMessage();

        }
        PrimengButton.clickByLocator(by.id('idBtnSalvarFormManual'));
    }

    cadastrarManualEditar() {
        PrimengBlockUi.waitBlockUi(2000);

        this.manual = this.data;

        PrimengBlockUi.waitBlockUi(2000);
        PrimengInputText.clearAndFillTextByLocator(by.id('nome_manual'), this.manual[5].nome);
        PrimengInputText.clearAndFillTextByLocator(by.css('#idValorVariacaoEstimadaFormManual .ui-spinner-input'),
            this.manual[5].estimada);
        PrimengInputText.clearAndFillTextByLocator(by.css('#idValorVariacaoIndicativoFormManual .ui-spinner-input'),
            this.manual[5].indicativa);
        PrimengInputText.clearAndFillTextByLocator(by.id('idObservacaoFormManual'), this.manual[5].observacao);

        PrimengInputText.clearAndFillTextByLocator(by.css('#idInclusaoFormManual .ui-spinner-input'), this.manual[5].inclusao);
        PrimengInputText.clearAndFillTextByLocator(by.css('#idAlteracaoFormManual .ui-spinner-input'), this.manual[5].alteracao);
        PrimengInputText.clearAndFillTextByLocator(by.css('#idExclusaoFormManual .ui-spinner-input'), this.manual[5].exclusao);
        PrimengInputText.clearAndFillTextByLocator(by.css('#idConvercaoFormManual .ui-spinner-input'), this.manual[5].convesao);
        for (let j = 1; j < this.manual[5].fase.length; j++) {
            PrimengButton.clickByLocator(by.id('idBtnNovoEsforcoFaseFormManual'));
            PrimengDropdown.selectValueByLocator(by.id('nome_fase'), this.manual[5].fase[j].fase);
            PrimengInputText.fillTextByLocator(by.css('#idEsforcoSaveFormManual .ui-spinner-input'), this.manual[5].fase[j].esforco);
            PrimengButton.clickByLocator(by.id('idBtnSalvarSaveEsforcoFormManual'));
            PrimengGrowl.isWarningMessage('Registro incluído com sucesso!');
            PrimengGrowl.closeWarningMessage();
        }
        for (let j = 0; j < this.manual[5].deflator.length; j++) {
            PrimengButton.clickByLocator(by.id('idBtnNovoDeflatorFormManual'));
            PrimengInputText.clearAndFillTextByLocator(by.id('nome_fator_ajuste'), this.manual[5].deflator[j].nome);
            PrimengDropdown.selectValueByLocator(by.id('tipo_ajuste'), this.manual[5].deflator[j].ajuste);
            PrimengInputText.fillTextByLocator(by.css('#idDeflatorDeflatorFormManual .ui-spinner-input'),
                this.manual[5].deflator[j].deflator);

            PrimengTextArea.clearAndFillTextByLocator(by.id('idDescricaoSaveFormManual'), this.manual[5].deflator[j].descricao);

            PrimengInputText.clearAndFillTextByLocator(by.id('codigo_fator'), this.manual[5].deflator[j].codigo);
            PrimengInputText.clearAndFillTextByLocator(by.id('origem_fator'), this.manual[5].deflator[j].origem);
            PrimengButton.clickByLocator(by.id('idBtnSalvarDeflatorSaveFormManual'));
            PrimengGrowl.isWarningMessage('Registro incluído com sucesso!');
            PrimengGrowl.closeWarningMessage();

        }

        PrimengButton.clickByLocator(by.id('idBtnSalvarFormManual'));
    }

    cadastrarManualSucesso() {
        this.promises = [];
        this.manual = this.data;
        for (let i = 0; i < this.manual.length; i++) {
            this.clicarBotao('Novo');
            PrimengBlockUi.waitBlockUi(2000);
            let path: string;
            let id: string;
            PrimengInputText.clearAndFillTextByLocator(by.id('nome_manual'), this.manual[i].nome);
            PrimengInputText.fillTextByLocator(by.css('#idValorVariacaoEstimadaFormManual .ui-spinner-input'), this.manual[i].estimada);
            PrimengInputText.fillTextByLocator(by.css('#idValorVariacaoIndicativoFormManual .ui-spinner-input'), this.manual[i].indicativa);
            PrimengInputText.clearAndFillTextByLocator(by.id('idObservacaoFormManual'), this.manual[i].observacao);

            id = 'idArquivoManualFormManual';
            path = '../cadastros/manual/assets/';
            PrimengFileUpload.inputFileByLocator(by.id(id), 'documento.pdf', path, id);

            PrimengInputText.fillTextByLocator(by.css('#idInclusaoFormManual .ui-spinner-input'), this.manual[i].inclusao);
            PrimengInputText.fillTextByLocator(by.css('#idAlteracaoFormManual .ui-spinner-input'), this.manual[i].alteracao);
            PrimengInputText.fillTextByLocator(by.css('#idExclusaoFormManual .ui-spinner-input'), this.manual[i].exclusao);
            PrimengInputText.fillTextByLocator(by.css('#idConvercaoFormManual .ui-spinner-input'), this.manual[i].convesao);
            for (let j = 0; j < this.manual[i].fase.length; j++) {
                PrimengButton.clickByLocator(by.id('idBtnNovoEsforcoFaseFormManual'));
                PrimengDropdown.selectValueByLocator(by.id('nome_fase'), this.manual[i].fase[j].fase);
                PrimengInputText.fillTextByLocator(by.css('#idEsforcoSaveFormManual .ui-spinner-input'), this.manual[i].fase[j].esforco);
                PrimengButton.clickByLocator(by.id('idBtnSalvarSaveEsforcoFormManual'));
                PrimengGrowl.isWarningMessage('Registro incluído com sucesso!');
                PrimengGrowl.closeWarningMessage();
            }
            for (let j = 0; j < this.manual[i].deflator.length; j++) {
                PrimengButton.clickByLocator(by.id('idBtnNovoDeflatorFormManual'));
                PrimengInputText.clearAndFillTextByLocator(by.id('nome_fator_ajuste'), this.manual[i].deflator[j].nome);
                PrimengDropdown.selectValueByLocator(by.id('tipo_ajuste'), this.manual[i].deflator[j].ajuste);
                PrimengInputText.fillTextByLocator(by.css('#idDeflatorDeflatorFormManual .ui-spinner-input'),
                    this.manual[i].deflator[j].deflator);

                PrimengTextArea.clearAndFillTextByLocator(by.id('idDescricaoSaveFormManual'), this.manual[i].deflator[j].descricao);

                PrimengInputText.clearAndFillTextByLocator(by.id('codigo_fator'), this.manual[i].deflator[j].codigo);
                PrimengInputText.clearAndFillTextByLocator(by.id('origem_fator'), this.manual[i].deflator[j].origem);
                PrimengButton.clickByLocator(by.id('idBtnSalvarDeflatorSaveFormManual'));
                PrimengGrowl.isWarningMessage('Registro incluído com sucesso!');
                PrimengGrowl.closeWarningMessage();
            }
            PrimengButton.clickByLocator(by.id('idBtnSalvarFormManual'));
            this.promises.push(PrimengGrowl.isWarningMessage('Registro incluído com sucesso!'));
            PrimengGrowl.closeWarningMessage();
        }
    }

    selecionarLinhaEditar(linha: string) {
        PrimengDataTable.clickCellTextByLocator(by.id('idTabelaComponentManual'), linha);
        PrimengButton.clickByLocator(by.css('.ng-star-inserted:nth-child(1) .ui-button'));
    }

    selecionarLinhaVisualizar(linha: string) {
        PrimengDataTable.clickCellTextByLocator(by.id('idTabelaComponentManual'), linha);
        PrimengButton.clickByLocator(by.css('.ng-star-inserted:nth-child(2) > p > .ui-button'));
    }

    selecionarLinhaExcluir(linha: string) {
        PrimengDataTable.clickCellTextByLocator(by.id('idTabelaComponentManual'), linha);
        PrimengButton.clickByLocator(by.css('.ui-button-danger:nth-child(1)'));
        PrimengButton.clickByLocator(by.id('idBtnSimComponentManual'));
    }

    verificarMensagemInclusão(aviso: string) {
        return Promise.all(this.promises).then(resultados => {
            for (let i = 0; i < 1; i++) {
                if (!resultados[i]) {
                    return `Inclusão ${i} não apresentou a mensagem de aviso "${aviso}"`;
                }
            }
            return 'OK';
        });
    }

    verificarMensagem(aviso: string) {
        this.promises = [];
        this.promises.push(PrimengGrowl.isWarningMessage(aviso));
        PrimengGrowl.closeWarningMessage();
        return Promise.all(this.promises).then(resultados => {
            switch (false) {
                case resultados[0]:
                    return `Mensagem de aviso "${aviso}" não foi exibida.`;
                default:
                    return 'OK';
            }
        });
    }

    verificarVisualizar() {
        this.promises = [];

        this.promises.push(PrimengComponent.isPresentByLocator(by.css('.ui-g-6:nth-child(1) > label')));
        this.promises.push(PrimengComponent.isPresentByLocator(by.css('.ui-g-6:nth-child(2) > label')));
        this.promises.push(PrimengComponent.isPresentByLocator(by.css('.ui-g-6:nth-child(3) > label')));
        this.promises.push(PrimengComponent.isPresentByLocator(by.css('.ui-g-6:nth-child(4) > label')));
        return Promise.all(this.promises).then(resultados => {
            switch (false) {
                case resultados[0]:
                    return `Erro ao testar visualizar 1`;
                case resultados[1]:
                    return `Erro ao testar visualizar 2`;
                case resultados[2]:
                    return `Erro ao testar visualizar 3`;
                case resultados[3]:
                    return `Erro ao testar visualizar 4`;
                default:
                    return 'OK';
            }
        });
    }

    ordenarManual() {
        let id: string;
        const coluna = 1;

        id = 'idTabelaComponentManual';
        PrimengDataTable.waitToBePresentByLocator(by.id(id));
        PrimengPaginator.selectMaximumShownedByLocator(by.id(id), 20);

        this.promises = [];
        let linhas: string[];
        linhas = [
            'IBAMA',
            'MEC',
            'Manual EB-SISP',
            'Manual MME-SISP',
            'Manual MP-SISP',
            'SISP 2.2'
        ];

        id = 'idTabelaComponentManual';

        PrimengButton.clickByLocator(by.css(`p-table > div > div > table > thead > tr > th:nth-child(${coluna})`));
        this.promises.push(PrimengDataTable.isColumnTextsByLocator(by.id(id), coluna, linhas, true));
        PrimengButton.clickByLocator(by.css(`p-table > div > div > table > thead > tr > th:nth-child(${coluna})`));
        this.promises.push(PrimengDataTable.isColumnTextsByLocator(by.id(id), coluna, linhas, false));


        return Promise.all(this.promises).then(resultados => {
            switch (false) {
                case resultados[0]:
                    return `Sequência ascendente de ordenação incorreta.`;
                case resultados[1]:
                    return `Sequência descendente de ordenação incorreta.`;
                default:
                    return 'OK';
            }
        });
    }

    ordenarEstimada() {
        let id: string;
        const coluna = 2;

        id = 'idTabelaComponentManual';
        PrimengDataTable.waitToBePresentByLocator(by.id(id));
        PrimengPaginator.selectMaximumShownedByLocator(by.id(id), 20);

        this.promises = [];
        let linhas: string[];
        linhas = [
            ' 35% ',
            ' 35% ',
            ' 35% ',
            ' 35% ',
            ' 35% ',
            ' 35% '
        ];

        id = 'idTabelaComponentManual';
        PrimengButton.clickByLocator(by.css(`p-table > div > div > table > thead > tr > th:nth-child(${coluna})`));
        this.promises.push(PrimengDataTable.isColumnTextsByLocatorSpan(by.id(id), coluna, linhas, true));
        PrimengButton.clickByLocator(by.css(`p-table > div > div > table > thead > tr > th:nth-child(${coluna})`));
        this.promises.push(PrimengDataTable.isColumnTextsByLocatorSpan(by.id(id), coluna, linhas, false));


        return Promise.all(this.promises).then(resultados => {
            switch (false) {
                case resultados[0]:
                    return `Sequência ascendente de ordenação incorreta.`;
                case resultados[1]:
                    return `Sequência descendente de ordenação incorreta.`;
                default:
                    return 'OK';
            }
        });
    }

    ordenarIndicativa() {
        let id: string;
        const coluna = 3;

        id = 'idTabelaComponentManual';
        PrimengDataTable.waitToBePresentByLocator(by.id(id));
        PrimengPaginator.selectMaximumShownedByLocator(by.id(id), 20);

        this.promises = [];
        let linhas: string[];
        linhas = [
            '50%',
            '50%',
            '50%',
            '50%',
            '50%',
            '50%'
        ];

        id = 'idTabelaComponentManual';
        PrimengButton.clickByLocator(by.css(`p-table > div > div > table > thead > tr > th:nth-child(${coluna})`));
        this.promises.push(PrimengDataTable.isColumnTextsByLocatorSpan(by.id(id), coluna, linhas, true));
        PrimengButton.clickByLocator(by.css(`p-table > div > div > table > thead > tr > th:nth-child(${coluna})`));
        this.promises.push(PrimengDataTable.isColumnTextsByLocatorSpan(by.id(id), coluna, linhas, false));


        return Promise.all(this.promises).then(resultados => {
            switch (false) {
                case resultados[0]:
                    return `Sequência ascendente de ordenação incorreta.`;
                case resultados[1]:
                    return `Sequência descendente de ordenação incorreta.`;
                default:
                    return 'OK';
            }
        });
    }

    ordenarInclusao() {
        let id: string;
        const coluna = 4;

        id = 'idTabelaComponentManual';
        PrimengDataTable.waitToBePresentByLocator(by.id(id));
        PrimengPaginator.selectMaximumShownedByLocator(by.id(id), 20);

        this.promises = [];
        let linhas: string[];
        linhas = [
            '100%',
            '100%',
            '100%',
            '100%',
            '100%',
            '100%'
        ];

        id = 'idTabelaComponentManual';
        PrimengButton.clickByLocator(by.css(`p-table > div > div > table > thead > tr > th:nth-child(${coluna})`));
        this.promises.push(PrimengDataTable.isColumnTextsByLocatorSpan(by.id(id), coluna, linhas, true));
        PrimengButton.clickByLocator(by.css(`p-table > div > div > table > thead > tr > th:nth-child(${coluna})`));
        this.promises.push(PrimengDataTable.isColumnTextsByLocatorSpan(by.id(id), coluna, linhas, false));


        return Promise.all(this.promises).then(resultados => {
            switch (false) {
                case resultados[0]:
                    return `Sequência ascendente de ordenação incorreta.`;
                case resultados[1]:
                    return `Sequência descendente de ordenação incorreta.`;
                default:
                    return 'OK';
            }
        });
    }

    ordenarAlteracao() {
        let id: string;
        const coluna = 5;

        id = 'idTabelaComponentManual';
        PrimengDataTable.waitToBePresentByLocator(by.id(id));
        PrimengPaginator.selectMaximumShownedByLocator(by.id(id), 20);

        this.promises = [];
        let linhas: string[];
        linhas = [
            '50%',
            '50%',
            '60%',
            '90%',
            '90%',
            '90%'
        ];

        id = 'idTabelaComponentManual';
        PrimengButton.clickByLocator(by.css(`p-table > div > div > table > thead > tr > th:nth-child(${coluna})`));
        this.promises.push(PrimengDataTable.isColumnTextsByLocatorSpan(by.id(id), coluna, linhas, true));
        PrimengButton.clickByLocator(by.css(`p-table > div > div > table > thead > tr > th:nth-child(${coluna})`));
        this.promises.push(PrimengDataTable.isColumnTextsByLocatorSpan(by.id(id), coluna, linhas, false));


        return Promise.all(this.promises).then(resultados => {
            switch (false) {
                case resultados[0]:
                    return `Sequência ascendente de ordenação incorreta.`;
                case resultados[1]:
                    return `Sequência descendente de ordenação incorreta.`;
                default:
                    return 'OK';
            }
        });
    }

    ordenarExclusao() {
        let id: string;
        const coluna = 6;

        id = 'idTabelaComponentManual';
        PrimengDataTable.waitToBePresentByLocator(by.id(id));
        PrimengPaginator.selectMaximumShownedByLocator(by.id(id), 20);

        this.promises = [];
        let linhas: string[];
        linhas = [
            '30%',
            '30%',
            '30%',
            '30%',
            '30%',
            '30%'
        ];

        id = 'idTabelaComponentManual';
        PrimengButton.clickByLocator(by.css(`p-table > div > div > table > thead > tr > th:nth-child(${coluna})`));
        this.promises.push(PrimengDataTable.isColumnTextsByLocatorSpan(by.id(id), coluna, linhas, true));
        PrimengButton.clickByLocator(by.css(`p-table > div > div > table > thead > tr > th:nth-child(${coluna})`));
        this.promises.push(PrimengDataTable.isColumnTextsByLocatorSpan(by.id(id), coluna, linhas, false));


        return Promise.all(this.promises).then(resultados => {
            switch (false) {
                case resultados[0]:
                    return `Sequência ascendente de ordenação incorreta.`;
                case resultados[1]:
                    return `Sequência descendente de ordenação incorreta.`;
                default:
                    return 'OK';
            }
        });
    }

    ordenarConversao() {
        let id: string;
        const coluna = 7;

        id = 'idTabelaComponentManual';
        PrimengDataTable.waitToBePresentByLocator(by.id(id));
        PrimengPaginator.selectMaximumShownedByLocator(by.id(id), 20);

        this.promises = [];
        let linhas: string[];
        linhas = [
            '30%',
            '100%',
            '100%',
            '100%',
            '100%',
            '100%'
        ];

        id = 'idTabelaComponentManual';
        PrimengButton.clickByLocator(by.css(`p-table > div > div > table > thead > tr > th:nth-child(${coluna})`));
        this.promises.push(PrimengDataTable.isColumnTextsByLocatorSpan(by.id(id), coluna, linhas, true));
        PrimengButton.clickByLocator(by.css(`p-table > div > div > table > thead > tr > th:nth-child(${coluna})`));
        this.promises.push(PrimengDataTable.isColumnTextsByLocatorSpan(by.id(id), coluna, linhas, false));


        return Promise.all(this.promises).then(resultados => {
            switch (false) {
                case resultados[0]:
                    return `Sequência ascendente de ordenação incorreta.`;
                case resultados[1]:
                    return `Sequência descendente de ordenação incorreta.`;
                default:
                    return 'OK';
            }
        });
    }

    selecionarLinhaClonar(linha: string) {
        PrimengDataTable.clickCellTextByLocator(by.id('idTabelaComponentManual'), linha);
        PrimengButton.clickByLocator(by.css('.ui-icon-content-copy'));
    }

    clonarManual() {
        PrimengInputText.clearAndFillTextByLocator(by.id('nome_manual'), 'Manual MEC Duplicado');
        PrimengButton.clickByLocator(by.id('idBtnSalvarCloneComponentManual'));
    }

    exportar() {
        PrimengButton.clickByLocator(by.css('.ui-splitbutton-menubutton'));
        PrimengButton.clickByLocator(by.css('.ui-menuitem:nth-child(1) > .ui-menuitem-link'));
    }

    limparDownloads(arquivos: string[]) {
        const promises = [];
        arquivos.forEach(arquivo => {
            promises.push(Download.checkDownload(`${__dirname}/../../../downloads/${arquivo}`, 500));
        });
        Promise.all(promises).then(resultados => {
            for (let i = 0; i < resultados.length; i++) {
                if (resultados[i]) {
                    Download.removeDownload(`${__dirname}/../../../downloads/${arquivos[i]}`, 5000);
                }
            }
        });
    }
    verificarDownloads(arquivo: string) {
        this.promises = [];
        this.promises.push(Download.checkDownload(`${__dirname}/../../downloads/${arquivo}`, 5000));
        this.limparDownloads([arquivo]);
        return Promise.all(this.promises).then(resultados => {
            switch (false) {
                case resultados[0]:
                    return `Download do arquivo"${arquivo}" não foi feito.`;
                default:
                    return 'OK';
            }
        });
    }
}
