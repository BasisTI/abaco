import {PrimengInputText} from '../../componentes/primeng-inputtext';
import {browser, by} from 'protractor';
import {PrimengComponent} from '../../componentes/primeng-component';
import {PrimengMenu} from '../../componentes/primeng-menu';
import {PrimengBlockUi} from '../../componentes/primeng-block-ui';
import {PrimengFileUpload} from '../../componentes/primeng-fileupload';
import {PrimengButton} from '../../componentes/primeng-button';
import {PrimengRadioButton} from '../../componentes/primeng-radiobutton';
import {PrimengDropdown} from '../../componentes/primeng-dropdown';
import {PrimengCalendar} from '../../componentes/primeng-calendar';
import {PrimengGrowl} from '../../componentes/primeng-growl';
import {PrimengDataTable} from '../../componentes/primeng-datatable';
import {PrimengPaginator} from '../../componentes/primeng-paginator';

class Sistema {
    nome: string;
    sigla: string;
    tipo: string;
    organizacao: string;

    ocorrencia: string;
    modulo: string;

    nomeFunc: string;
    moduloFunc: string;
}

export class SistemaPage {
    private promises = [];
    private data = require('./assets/Sistema.json');
    private sistema: Sistema[];

    login() {
        const username = 'admin';
        const password = 'admin';
        PrimengInputText.clearAndFillTextByLocator(by.name('username'), username);
        PrimengInputText.clearAndFillTextByLocator(by.name('password'), password);
        PrimengComponent.clickByLocator(by.css('.ui-button'));
    }

    navegar() {

        PrimengMenu.clickByPath(['Cadastros', 'Sistema']);
        PrimengBlockUi.waitBlockUi(5000);
    }

    clicarBotao(texto: string) {
        PrimengBlockUi.waitBlockUi(2000);
        PrimengButton.clickByText(texto);
    }

    cadastrarSistemasComSucesso() {
        this.promises = [];
        this.sistema = this.data;
        for (let i = 0; i < this.sistema.length; i++) {
            PrimengBlockUi.waitBlockUi(2000);
            this.clicarBotao('Novo');

            PrimengInputText.clearAndFillTextByLocator(by.id('sigla_sistema'), this.sistema[i].sigla);
            PrimengInputText.clearAndFillTextByLocator(by.id('nome_sistema'), this.sistema[i].nome);

            PrimengDropdown.waitToBePresentByLocator(by.id('tipo_sistema'));
            PrimengDropdown.selectValueByLocator(by.id('tipo_sistema'), this.sistema[i].tipo);
            PrimengInputText.clearAndFillTextByLocator(by.id('idNumeoOcorrenciaFormSistema'), this.sistema[i].ocorrencia);


            PrimengDropdown.waitToBePresentByLocator(by.id('organizacao_sistema'));
            PrimengDropdown.selectValueByLocator(by.id('organizacao_sistema'), this.sistema[i].organizacao);


            // Modulo
            if (this.sistema[i].modulo !== '') {
                PrimengButton.clickByLocator(by.id('idBtnNovoModuloFormSistema'));
                PrimengInputText.clearAndFillTextByLocator(by.id('idNomeModuloSaveFormSistema'), this.sistema[i].modulo);
                PrimengButton.clickByLocator(by.id('idBtnSalvarModuloSaveFormSistema'));

                // Funcionalidade
                PrimengButton.clickByLocator(by.id('idBtnNovoSubmoduloFormSistema'));
                PrimengInputText.clearAndFillTextByLocator(by.id('idNomeFuncionalidadeSaveFormSistema'), this.sistema[i].nomeFunc);
                PrimengDropdown.waitToBePresentByLocator(by.id('idModuloFuncionalidadeSaveFormSistema'));
                PrimengDropdown.selectValueByLocator(by.id('idModuloFuncionalidadeSaveFormSistema'), this.sistema[i].moduloFunc);
                PrimengButton.clickByLocator(by.id('idSalvarFuncionalidadeSaveFormSistema'));

            }
            PrimengButton.clickByLocator(by.id('idBtnSalvarFormSistema'));
            this.promises.push(PrimengGrowl.isWarningMessage('Registro incluído com sucesso!'));
            PrimengGrowl.closeWarningMessage();
        }
    }

    cadastrarSistemasDuplicidade() {
        this.promises = [];
        this.sistema = this.data;
        PrimengBlockUi.waitBlockUi(2000);

        PrimengInputText.clearAndFillTextByLocator(by.id('sigla_sistema'), this.sistema[0].sigla);
        PrimengInputText.clearAndFillTextByLocator(by.id('nome_sistema'), this.sistema[0].nome);
        PrimengDropdown.waitToBePresentByLocator(by.id('tipo_sistema'));
        PrimengDropdown.selectValueByLocator(by.id('tipo_sistema'), this.sistema[0].tipo);
        PrimengInputText.clearAndFillTextByLocator(by.id('idNumeoOcorrenciaFormSistema'), this.sistema[0].ocorrencia);
        PrimengDropdown.waitToBePresentByLocator(by.id('organizacao_sistema'));
        PrimengDropdown.selectValueByLocator(by.id('organizacao_sistema'), this.sistema[0].organizacao);


        // Modulo
        PrimengButton.clickByLocator(by.id('idBtnNovoModuloFormSistema'));
        PrimengInputText.clearAndFillTextByLocator(by.id('idNomeModuloSaveFormSistema'), this.sistema[0].modulo);
        PrimengButton.clickByLocator(by.id('idBtnSalvarModuloSaveFormSistema'));

        // Funcionalidade
        PrimengButton.clickByLocator(by.id('idBtnNovoSubmoduloFormSistema'));
        PrimengInputText.clearAndFillTextByLocator(by.id('idNomeFuncionalidadeSaveFormSistema'), this.sistema[0].nomeFunc);
        PrimengDropdown.waitToBePresentByLocator(by.id('idModuloFuncionalidadeSaveFormSistema'));
        PrimengDropdown.selectValueByLocator(by.id('idModuloFuncionalidadeSaveFormSistema'), this.sistema[0].moduloFunc);
        PrimengButton.clickByLocator(by.id('idSalvarFuncionalidadeSaveFormSistema'));


        PrimengButton.clickByLocator(by.id('idBtnSalvarFormSistema'));
    }

    cadastrarSistemaEditar() {
        this.promises = [];
        this.sistema = this.data;
        PrimengBlockUi.waitBlockUi(2000);

        PrimengInputText.clearAndFillTextByLocator(by.id('sigla_sistema'), 'SisGCorp');
        PrimengInputText.clearAndFillTextByLocator(by.id('nome_sistema'), 'SisGCorp');
        PrimengDropdown.waitToBePresentByLocator(by.id('tipo_sistema'));
        PrimengDropdown.selectValueByLocator(by.id('tipo_sistema'), 'Novo');
        PrimengInputText.clearAndFillTextByLocator(by.id('idNumeoOcorrenciaFormSistema'), 'EBCOLOG1372017-2');
        PrimengDropdown.waitToBePresentByLocator(by.id('organizacao_sistema'));
        PrimengDropdown.selectValueByLocator(by.id('organizacao_sistema'), 'EB - EXERCITO BRASILEIRO');

        PrimengButton.clickByLocator(by.id('idBtnSalvarFormSistema'));
    }

    cadastrarSistemasCamposObrigatórios() {
        this.promises = [];
        PrimengBlockUi.waitBlockUi(2000);

        //
        PrimengInputText.clearAndFillTextByLocator(by.id('sigla_sistema'), `Sigla`);
        PrimengInputText.clearAndFillTextByLocator(by.id('nome_sistema'), `Sistema`);
        PrimengInputText.clearAndFillTextByLocator(by.id('idNumeoOcorrenciaFormSistema'), `Ocorrencia`);
        PrimengButton.clickByLocator(by.id('idBtnSalvarFormSistema'));
        this.promises.push(PrimengGrowl.isWarningMessage('Favor preencher os campos Obrigatórios!'));
        PrimengGrowl.closeWarningMessage();

        //
        PrimengInputText.clearAndFillTextByLocator(by.id('sigla_sistema'), ``);
        PrimengInputText.clearAndFillTextByLocator(by.id('nome_sistema'), `Sistema`);
        PrimengDropdown.waitToBePresentByLocator(by.id('tipo_sistema'));
        PrimengDropdown.selectValueByLocator(by.id('tipo_sistema'), `Legado`);
        PrimengInputText.clearAndFillTextByLocator(by.id('idNumeoOcorrenciaFormSistema'), `Ocorrencia`);
        PrimengDropdown.waitToBePresentByLocator(by.id('organizacao_sistema'));
        PrimengDropdown.selectValueByLocator(by.id('organizacao_sistema'), `BASIS - BASIS Tecnologia`);
        PrimengButton.clickByLocator(by.id('idBtnSalvarFormSistema'));
        this.promises.push(PrimengGrowl.isWarningMessage('Favor preencher os campos Obrigatórios!'));
        PrimengGrowl.closeWarningMessage();

        //
        PrimengInputText.clearAndFillTextByLocator(by.id('sigla_sistema'), `Sigla`);
        PrimengInputText.clearAndFillTextByLocator(by.id('nome_sistema'), ``);
        PrimengDropdown.waitToBePresentByLocator(by.id('tipo_sistema'));
        PrimengDropdown.selectValueByLocator(by.id('tipo_sistema'), `Legado`);
        PrimengInputText.clearAndFillTextByLocator(by.id('idNumeoOcorrenciaFormSistema'), `Ocorrencia`);
        PrimengDropdown.waitToBePresentByLocator(by.id('organizacao_sistema'));
        PrimengDropdown.selectValueByLocator(by.id('organizacao_sistema'), `BASIS - BASIS Tecnologia`);
        PrimengButton.clickByLocator(by.id('idBtnSalvarFormSistema'));
        this.promises.push(PrimengGrowl.isWarningMessage('Favor preencher os campos Obrigatórios!'));
        PrimengGrowl.closeWarningMessage();


        // Modulo
        PrimengButton.clickByLocator(by.id('idBtnNovoModuloFormSistema'));
        PrimengInputText.clearAndFillTextByLocator(by.id('idNomeModuloSaveFormSistema'), ``);
        PrimengButton.clickByLocator(by.id('idBtnSalvarModuloSaveFormSistema'));
        this.promises.push(PrimengGrowl.isWarningMessage('Por favor preencher o campo obrigatório!'));
        PrimengGrowl.closeWarningMessage();
        PrimengInputText.clearAndFillTextByLocator(by.id('idNomeModuloSaveFormSistema'), `Módulo`);
        PrimengButton.clickByLocator(by.id('idBtnSalvarModuloSaveFormSistema'));

        // Funcionalidade
        PrimengButton.clickByLocator(by.id('idBtnNovoSubmoduloFormSistema'));
        PrimengInputText.clearAndFillTextByLocator(by.id('idNomeFuncionalidadeSaveFormSistema'), ``);
        PrimengDropdown.waitToBePresentByLocator(by.id('idModuloFuncionalidadeSaveFormSistema'));
        PrimengDropdown.selectValueByLocator(by.id('idModuloFuncionalidadeSaveFormSistema'), `Módulo`);
        PrimengButton.clickByLocator(by.id('idSalvarFuncionalidadeSaveFormSistema'));
        this.promises.push(PrimengGrowl.isWarningMessage('Por favor preencher o campo obrigatório!'));
        PrimengGrowl.closeWarningMessage();

        return Promise.all(this.promises).then(resultados => {
            switch (false) {
                case resultados[0]:
                    return `Mensagem de "Preenchimento obrigatório" não foi exibida.`;
                case resultados[1]:
                    return `Mensagem de "Preenchimento obrigatório" não foi exibida.`;
                case resultados[2]:
                    return `Mensagem de "Preenchimento obrigatório" não foi exibida.`;
                case resultados[3]:
                    return `Mensagem de "Preenchimento obrigatório" não foi exibida.`;
                case resultados[4]:
                    return `Mensagem de "Preenchimento obrigatório" não foi exibida.`;
                default:
                    return 'OK';
            }
        });

    }

    cadastrarSistemaCamposObrigatoriosEditar() {
        this.promises = [];
        PrimengBlockUi.waitBlockUi(2000);

        //
        PrimengInputText.clearAndFillTextByLocator(by.id('sigla_sistema'), ``);
        PrimengInputText.clearAndFillTextByLocator(by.id('nome_sistema'), `Sistema`);
        PrimengDropdown.waitToBePresentByLocator(by.id('tipo_sistema'));
        PrimengDropdown.selectValueByLocator(by.id('tipo_sistema'), `Legado`);
        PrimengInputText.clearAndFillTextByLocator(by.id('idNumeoOcorrenciaFormSistema'), `Ocorrencia`);
        PrimengDropdown.waitToBePresentByLocator(by.id('organizacao_sistema'));
        PrimengDropdown.selectValueByLocator(by.id('organizacao_sistema'), `BASIS - BASIS Tecnologia`);
        PrimengButton.clickByLocator(by.id('idBtnSalvarFormSistema'));
        this.promises.push(PrimengGrowl.isWarningMessage('Favor preencher os campos Obrigatórios!'));
        PrimengGrowl.closeWarningMessage();

        //
        PrimengInputText.clearAndFillTextByLocator(by.id('sigla_sistema'), `Sigla`);
        PrimengInputText.clearAndFillTextByLocator(by.id('nome_sistema'), ``);
        PrimengDropdown.waitToBePresentByLocator(by.id('tipo_sistema'));
        PrimengDropdown.selectValueByLocator(by.id('tipo_sistema'), `Legado`);
        PrimengInputText.clearAndFillTextByLocator(by.id('idNumeoOcorrenciaFormSistema'), `Ocorrencia`);
        PrimengDropdown.waitToBePresentByLocator(by.id('organizacao_sistema'));
        PrimengDropdown.selectValueByLocator(by.id('organizacao_sistema'), `BASIS - BASIS Tecnologia`);
        PrimengButton.clickByLocator(by.id('idBtnSalvarFormSistema'));
        this.promises.push(PrimengGrowl.isWarningMessage('Favor preencher os campos Obrigatórios!'));
        PrimengGrowl.closeWarningMessage();


        // Modulo
        PrimengButton.clickByLocator(by.id('idBtnNovoModuloFormSistema'));
        PrimengInputText.clearAndFillTextByLocator(by.id('idNomeModuloSaveFormSistema'), ``);
        PrimengButton.clickByLocator(by.id('idBtnSalvarModuloSaveFormSistema'));
        this.promises.push(PrimengGrowl.isWarningMessage('Por favor preencher o campo obrigatório!'));
        PrimengGrowl.closeWarningMessage();
        PrimengInputText.clearAndFillTextByLocator(by.id('idNomeModuloSaveFormSistema'), `Módulo`);
        PrimengButton.clickByLocator(by.id('idBtnSalvarModuloSaveFormSistema'));

        // Funcionalidade
        PrimengButton.clickByLocator(by.id('idBtnNovoSubmoduloFormSistema'));
        PrimengInputText.clearAndFillTextByLocator(by.id('idNomeFuncionalidadeSaveFormSistema'), ``);
        PrimengDropdown.waitToBePresentByLocator(by.id('idModuloFuncionalidadeSaveFormSistema'));
        PrimengDropdown.selectValueByLocator(by.id('idModuloFuncionalidadeSaveFormSistema'), `Módulo`);
        PrimengButton.clickByLocator(by.id('idSalvarFuncionalidadeSaveFormSistema'));
        this.promises.push(PrimengGrowl.isWarningMessage('Por favor preencher o campo obrigatório!'));
        PrimengGrowl.closeWarningMessage();

        return Promise.all(this.promises).then(resultados => {
            switch (false) {
                case resultados[0]:
                    return `Mensagem de "Preenchimento obrigatório" não foi exibida.`;
                case resultados[1]:
                    return `Mensagem de "Preenchimento obrigatório" não foi exibida.`;
                case resultados[2]:
                    return `Mensagem de "Preenchimento obrigatório" não foi exibida.`;
                case resultados[3]:
                    return `Mensagem de "Preenchimento obrigatório" não foi exibida.`;
                case resultados[4]:
                    return `Mensagem de "Preenchimento obrigatório" não foi exibida.`;
                default:
                    return 'OK';
            }
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

    verificarMensagemInclusão(aviso: string) {
        return Promise.all(this.promises).then(resultados => {
            for (let i = 0; i < this.sistema.length; i++) {
                if (!resultados[i]) {
                    return `Inclusão ${i} não apresentou a mensagem de aviso "${aviso}"`;
                }
            }
            return 'OK';
        });
    }

    selecionarLinhaEditar(linha: string) {
        let id: string;
        id = 'idSiglaComponentSistema';
        PrimengInputText.clearAndFillTextByLocator(by.id(id), linha);
        PrimengButton.clickByLocator(by.id('idBtnPesquisarComponentSistema'));
        PrimengDataTable.clickCellTextByLocator(by.css('basis-datatable'), linha);
        PrimengButton.clickByLocator(by.css('p > .ui-button-success'));
    }

    selecionarLinhaVisualizar(linha: string) {
        let id: string;
        id = 'idSiglaComponentSistema';
        PrimengInputText.clearAndFillTextByLocator(by.id(id), linha);
        PrimengButton.clickByLocator(by.id('idBtnPesquisarComponentSistema'));
        PrimengDataTable.clickCellTextByLocator(by.css('basis-datatable'), linha);
        PrimengButton.clickByLocator(by.css(' basis-datatable-button:nth-child(2) > p > button'));
    }

    selecionarLinhaExcluir(linha: string) {
        let id: string;
        id = 'idSiglaComponentSistema';
        PrimengInputText.clearAndFillTextByLocator(by.id(id), linha);
        PrimengButton.clickByLocator(by.id('idBtnPesquisarComponentSistema'));
        PrimengDataTable.clickCellTextByLocator(by.css('basis-datatable'), linha);
        PrimengButton.clickByLocator(by.css('.ui-button-danger:nth-child(1)'));
        PrimengButton.clickByLocator(by.css('button:nth-child(2)'));
    }

    verificarVisualizar() {
        this.promises = [];

        this.promises.push(PrimengComponent.isPresentByLocator(by.css('label')));
        this.promises.push(PrimengComponent.isPresentByLocator(by.css('div:nth-child(2) > div.ui-g-10 > label')));
        this.promises.push(PrimengComponent.isPresentByLocator(by.css('div:nth-child(2) > div.ui-g-4 > label')));
        this.promises.push(PrimengComponent.isPresentByLocator(by.css('div:nth-child(2) > div.ui-g-8 > label')));
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
                case resultados[4]:
                    return `Erro ao testar visualizar 5`;
                default:
                    return 'OK';
            }
        });
    }

    filtrarSigla() {
        let css: string;
        const coluna = 1;
        const mensagem = 'Nenhum registro encontrado.';
        css = 'idTabelaComponentSistema';

        PrimengInputText.clearAndFillTextByLocator(by.id('idSiglaComponentSistema'), 'ADS China');
        this.clicarBotao('Pesquisar');
        this.promises.push(browser.wait(PrimengDataTable.isCellTextByLocator(by.id(css), 'ADS China', 1, coluna)));
        PrimengInputText.clearAndFillTextByLocator(by.id('idSiglaComponentSistema'), 'ads china');
        this.clicarBotao('Pesquisar');
        this.promises.push(browser.wait(PrimengDataTable.isCellTextByLocator(by.id(css), 'ADS China', 1, coluna)));
        PrimengInputText.clearAndFillTextByLocator(by.id('idSiglaComponentSistema'), '');
        this.clicarBotao('Pesquisar');
        this.promises.push(browser.wait(PrimengDataTable.isCellTextByLocator(by.id(css), 'ADS China', 1, coluna)));
        PrimengInputText.clearAndFillTextByLocator(by.id('idSiglaComponentSistema'), '@@@');
        this.clicarBotao('Pesquisar');
        this.promises.push(browser.wait(PrimengDataTable.isEmptyMessageByLocator(by.css(css), mensagem)));
    }

    filtrarSistema() {
        let css: string;
        const coluna = 2;
        const mensagem = 'Nenhum registro encontrado.';
        css = 'idTabelaComponentSistema';

        PrimengInputText.clearAndFillTextByLocator(by.id('idNomeSistemaComponentSistema'), 'Apolo');
        this.clicarBotao('Pesquisar');
        this.promises.push(browser.wait(PrimengDataTable.isCellTextByLocator(by.id(css), 'Apolo', 1, coluna)));
        PrimengInputText.clearAndFillTextByLocator(by.id('idNomeSistemaComponentSistema'), 'apolo');
        this.clicarBotao('Pesquisar');
        this.promises.push(browser.wait(PrimengDataTable.isCellTextByLocator(by.id(css), 'Apolo', 1, coluna)));
        PrimengInputText.clearAndFillTextByLocator(by.id('idNomeSistemaComponentSistema'), '');
        this.clicarBotao('Pesquisar');
        this.promises.push(browser.wait(PrimengDataTable.isCellTextByLocator(by.id(css), 'ADS China', 1, coluna)));
        PrimengInputText.clearAndFillTextByLocator(by.id('idNomeSistemaComponentSistema'), '@@@');
        this.clicarBotao('Pesquisar');
        this.promises.push(browser.wait(PrimengDataTable.isEmptyMessageByLocator(by.css(css), mensagem)));
    }

    filtrarOrganizacao() {
        let id: string;
        const coluna = 4;
        const mensagem = 'Nenhum registro encontrado.';
        id = 'idTabelaComponentSistema';

        this.clicarBotao('Pesquisar');
        this.promises.push(browser.wait(PrimengDataTable.isCellTextByLocator(by.id(id), 'MTur - Ministério do Turismo', 1, coluna)));
        PrimengDropdown.selectValueByLocator(by.id('idOrganizacaoComponentSistema'), 'BASIS - BASIS Tecnologia');
        this.clicarBotao('Pesquisar');
        this.promises.push(browser.wait(PrimengDataTable.isCellTextByLocator(by.id(id), 'BASIS - BASIS Tecnologia', 1, coluna)));
    }

    verificarFiltrar() {
        this.promises = [];

        return Promise.all(this.promises).then(resultados => {
            switch (false) {
                case resultados[0]:
                    return `Erro ao filtrar com texto`;
                case resultados[1]:
                    return `Erro ao filtrar com texto minusculo`;
                case resultados[2]:
                    return `Erro ao filtrar sem texto`;
                case resultados[3]:
                    return `Erro ao filtrar com "@@@"`;
                default:
                    return 'OK';
            }
        });
    }

    verificarFiltrarOrganizacao() {
        this.promises = [];

        return Promise.all(this.promises).then(resultados => {
            switch (false) {
                case resultados[0]:
                    return `Erro ao filtrar com texto`;
                case resultados[1]:
                    return `Erro ao filtrar sem texto`;
                default:
                    return 'OK';
            }
        });
    }

    ordenarSigla() {
        let id: string;
        const coluna = 1;

        this.clicarBotao('Limpar');
        id = 'basis-datatable';
        PrimengDataTable.waitToBePresentByLocator(by.css(id));
        PrimengPaginator.selectMaximumShownedByLocator(by.css(id), 20);

        this.promises = [];
        let linhas: string[];
        linhas = [
            'ADAWEB',
            'ADS China',
            'AGATHA',
            'ANCINE-FRAMEWORK',
            'APAC',
            'AUDITAR',
            'Barramento',
            'BPS',
            'CACS',
            'Caixa Postal',
            'CLIG',
            'EB SAÚDE',
            'IFN',
            'SisGCorp'
        ];

        id = 'basis-datatable';
        PrimengButton.clickByLocator(by.css(`p-table > div > div > table > thead > tr > th:nth-child(${coluna})`));
        this.promises.push(PrimengDataTable.isColumnTextsByLocatorSpan(by.css(id), coluna, linhas, true));
        PrimengButton.clickByLocator(by.css(`p-table > div > div > table > thead > tr > th:nth-child(${coluna})`));
        this.promises.push(PrimengDataTable.isColumnTextsByLocatorSpan(by.css(id), coluna, linhas, false));


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

    ordenarNome() {
        let id: string;
        const coluna = 2;

        this.clicarBotao('Limpar');
        id = 'basis-datatable';
        PrimengDataTable.waitToBePresentByLocator(by.css(id));
        PrimengPaginator.selectMaximumShownedByLocator(by.css(id), 20);

        this.promises = [];
        let linhas: string[];
        linhas = [
            'ADAWEB',
            'ADS China',
            'AGATHA',
            'ANCINE-FRAMEWORK',
            'APAC',
            'AUDITAR',
            'BPS',
            'Barramento',
            'CACS',
            'CLIG',
            'Caixa Postal',
            'EB SAÚDE',
            'SisGCorp',
            'Sistema do Inventário Florestal Nacional'
        ];

        id = 'basis-datatable';
        PrimengButton.clickByLocator(by.css(`p-table > div > div > table > thead > tr > th:nth-child(${coluna})`));
        this.promises.push(PrimengDataTable.isColumnTextsByLocatorSpan(by.css(id), coluna, linhas, true));
        PrimengButton.clickByLocator(by.css(`p-table > div > div > table > thead > tr > th:nth-child(${coluna})`));
        this.promises.push(PrimengDataTable.isColumnTextsByLocatorSpan(by.css(id), coluna, linhas, false));


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

    ordenarNumero() {
        let id: string;
        const coluna = 3;

        this.clicarBotao('Limpar');
        id = 'basis-datatable';
        PrimengDataTable.waitToBePresentByLocator(by.css(id));
        PrimengPaginator.selectMaximumShownedByLocator(by.css(id), 20);

        this.promises = [];
        let linhas: string[];
        linhas = [
            'ANCINE112019-14',
            'ANVISA012020-4',
            'CADE172019-24',
            'CNJ-1014',
            'EBCOLOG1372017-2',
            'EBDCT32017-8',
            'FNDE-25',
            'FNDE-31',
            'FUNPRESP072019-120',
            'IBAMA442017-33',
            'MMA202017-116',
            'MME372017-26',
            'MTUR302019-2',
            'SFB082018-7'
        ];

        id = 'basis-datatable';
        PrimengButton.clickByLocator(by.css(`p-table > div > div > table > thead > tr > th:nth-child(${coluna})`));
        this.promises.push(PrimengDataTable.isColumnTextsByLocatorSpan(by.css(id), coluna, linhas, true));
        PrimengButton.clickByLocator(by.css(`p-table > div > div > table > thead > tr > th:nth-child(${coluna})`));
        this.promises.push(PrimengDataTable.isColumnTextsByLocatorSpan(by.css(id), coluna, linhas, false));


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
}
