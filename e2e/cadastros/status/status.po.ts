import {PrimengInputText} from '../../componentes/primeng-inputtext';
import {browser, by} from 'protractor';
import {PrimengComponent} from '../../componentes/primeng-component';
import {PrimengMenu} from '../../componentes/primeng-menu';
import {PrimengBlockUi} from '../../componentes/primeng-block-ui';
import {PrimengButton} from '../../componentes/primeng-button';
import {PrimengGrowl} from '../../componentes/primeng-growl';
import {PrimengDataTable} from '../../componentes/primeng-datatable';
import {PrimengPaginator} from '../../componentes/primeng-paginator';

export class StatusPage {
    private promises = [];
    private status = ['Em Coleta',
        'Concluída',
        'Divergência',
        'Aprovada',
        'Reprovada'
    ];

    login() {
        const username = 'admin';
        const password = 'admin';
        PrimengInputText.clearAndFillTextByLocator(by.name('username'), username);
        PrimengInputText.clearAndFillTextByLocator(by.name('password'), password);
        PrimengComponent.clickByLocator(by.css('.ui-button'));
    }

    navegar() {
        PrimengMenu.clickByPath(['Cadastros', 'Status']);
        PrimengBlockUi.waitBlockUi(5000);
    }

    clicarBotao(texto: string) {
        PrimengBlockUi.waitBlockUi(2000);
        PrimengButton.clickByText(texto);
    }

    cadastrarNovasStatus() {
        this.promises = [];
        for (let i = 0; i < this.status.length; i++) {
            this.clicarBotao('Novo');
            PrimengInputText.clearAndFillTextByLocator(by.name('nome'), this.status[i]);
            this.clicarBotao('Salvar');
            this.promises.push(PrimengGrowl.isWarningMessage('Registro incluído com sucesso!'));
            PrimengGrowl.closeWarningMessage();
        }
    }

    verificarMensagemInclusão(aviso: string) {
        return Promise.all(this.promises).then(resultados => {
            for (let i = 0; i < resultados.length; i++) {
                if (!resultados[i]) {
                    return `Inclusão ${i} não apresentou a mensagem de aviso "${aviso}"`;
                }
            }
            return 'OK';
        });
    }

    cadastrarStatusCamposObrigatorios() {
        PrimengInputText.clearAndFillTextByLocator(by.name('nome'), '');
        this.clicarBotao('Salvar');

        this.promises.push(PrimengComponent.isErrorMessage('.ui-message', 'Campo obrigatório.'));

        return Promise.all(this.promises).then(resultados => {
            switch (false) {
                case resultados[0]:
                    return 'Campo "Nome" não mostrou a mensagem de Preenchimento Obrigatório';
                default:
                    return 'OK';
            }
        });
    }

    selecionarLinhaEditar(linha: string) {
        let css: string;
        css = 'input';
        PrimengInputText.clearAndFillTextByLocator(by.css(css), linha);
        this.clicarBotao('Pesquisar');
        PrimengDataTable.clickCellTextByLocator(by.css('basis-datatable'), linha);
        PrimengButton.clickByLocator(by.css('p > .ui-button-success'));
    }

    editarStatus() {
        PrimengInputText.clearAndFillTextByLocator(by.name('nome'), 'Devolvida');
        PrimengButton.clickByLocator(by.css('.p-col-6:nth-child(3) .ui-radiobutton-box'));
        this.clicarBotao('Salvar');
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

    selecionarLinhaVisualizar(linha: string) {
        let css: string;
        css = 'input';
        PrimengInputText.clearAndFillTextByLocator(by.css(css), linha);
        this.clicarBotao('Pesquisar');
        PrimengDataTable.clickCellTextByLocator(by.css('basis-datatable'), linha);
        PrimengButton.clickByLocator(by.css('.ng-star-inserted:nth-child(2) > p > .ui-button'));
    }

    selecionarLinhaExcluir(linha: string) {
        let css: string;
        css = 'input';
        PrimengInputText.clearAndFillTextByLocator(by.css(css), linha);
        this.clicarBotao('Pesquisar');
        PrimengDataTable.clickCellTextByLocator(by.css('basis-datatable'), linha);
        PrimengButton.clickByLocator(by.css('.ui-button-danger:nth-child(1)'));
        PrimengButton.clickByLocator(by.css('.ui-button:nth-child(2)'));
    }

    verificarVisualizar() {
        this.promises = [];

        this.promises.push(PrimengComponent.isPresentByLocator(by.css('.ui-g:nth-child(2) > .ui-g-12:nth-child(2) > label')));
        this.promises.push(PrimengComponent.isPresentByLocator(by.css('.ui-g:nth-child(3) > .ui-g-12:nth-child(2) > label')));
        return Promise.all(this.promises).then(resultados => {
            switch (false) {
                case resultados[0]:
                    return `Erro ao testar visualizar 1`;
                case resultados[1]:
                    return `Erro ao testar visualizar 2`;
                default:
                    return 'OK';
            }
        });
    }

    filtrarStatus() {
        let css: string;
        const coluna = 1;
        const mensagem = 'Nenhum registro encontrado.';
        css = 'basis-datatable';

        PrimengInputText.clearAndFillTextByLocator(by.css('input'), 'Em Col');
        this.clicarBotao('Pesquisar');
        this.promises.push(browser.wait(PrimengDataTable.isCellTextByLocator(by.id(css), 'Em Coleta', 1, coluna)));
        PrimengInputText.clearAndFillTextByLocator(by.css('input'), 'iverg');
        this.clicarBotao('Pesquisar');
        this.promises.push(browser.wait(PrimengDataTable.isCellTextByLocator(by.id(css), 'Divergência', 1, coluna)));
        PrimengInputText.clearAndFillTextByLocator(by.css('input'), '');
        this.clicarBotao('Pesquisar');
        this.promises.push(browser.wait(PrimengDataTable.isCellTextByLocator(by.id(css), 'Em Coleta', 1, coluna)));
        PrimengInputText.clearAndFillTextByLocator(by.css('input'), '@@');
        this.clicarBotao('Pesquisar');
        this.promises.push(browser.wait(PrimengDataTable.isEmptyMessageByLocator(by.css(css), mensagem)));
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

    ordenarStatus() {
        let id: string;
        const coluna = 1;

        this.clicarBotao('Limpar');
        id = 'basis-datatable';
        PrimengDataTable.waitToBePresentByLocator(by.css(id));
        PrimengPaginator.selectMaximumShownedByLocator(by.css(id), 20);

        this.promises = [];
        let linhas: string[];
        linhas = [
            'Aprovada',
            'Concluída',
            'Divergência',
            'Em Coleta'
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

    ordenarAtivo() {
        let id: string;
        const coluna = 2;

        this.clicarBotao('Limpar');
        id = 'basis-datatable';
        PrimengDataTable.waitToBePresentByLocator(by.css(id));
        PrimengPaginator.selectMaximumShownedByLocator(by.css(id), 20);

        this.promises = [];
        let linhas: string[];
        linhas = [
            'Sim',
            'Sim',
            'Sim',
            'Sim'
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
