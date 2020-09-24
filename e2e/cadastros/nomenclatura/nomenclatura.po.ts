import {PrimengInputText} from '../../componentes/primeng-inputtext';
import {browser, by} from 'protractor';
import {PrimengComponent} from '../../componentes/primeng-component';
import {PrimengMenu} from '../../componentes/primeng-menu';
import {PrimengBlockUi} from '../../componentes/primeng-block-ui';
import {PrimengButton} from '../../componentes/primeng-button';
import {PrimengDropdown} from '../../componentes/primeng-dropdown';
import {PrimengGrowl} from '../../componentes/primeng-growl';
import {PrimengDataTable} from '../../componentes/primeng-datatable';
import {PrimengPaginator} from '../../componentes/primeng-paginator';

export class NomenclaturaPage {
    private promises = [];
    private nomenclatura = [
        'Inserir',
        'Editar',
        'Testar'
    ];
    private descricao = [
        'Funcionalidade para salvar ou persistir dados.',
        'Editar registro de um ALI',
        'Testar registros'
    ];

    login() {
        const username = 'admin';
        const password = 'admin';
        PrimengInputText.clearAndFillTextByLocator(by.name('username'), username);
        PrimengInputText.clearAndFillTextByLocator(by.name('password'), password);
        PrimengComponent.clickByLocator(by.css('.ui-button'));
    }

    navegar() {

        PrimengMenu.clickByPath(['Cadastros', 'Nomenclatura']);
        PrimengBlockUi.waitBlockUi(5000);
    }

    clicarBotao(texto: string) {
        PrimengBlockUi.waitBlockUi(2000);
        PrimengButton.clickByText(texto);
    }

    verificarMensagemInclusão(aviso: string) {
        return Promise.all(this.promises).then(resultados => {
            for (let i = 0; i < this.descricao.length; i++) {
                if (!resultados[i]) {
                    return `Inclusão ${i} não apresentou a mensagem de aviso "${aviso}"`;
                }
            }
            return 'OK';
        });
    }

    cadastrarNomenclaturasComSucesso() {
        this.promises = [];
        for (let i = 0; i < this.nomenclatura.length; i++) {
            PrimengBlockUi.waitBlockUi(2000);
            this.clicarBotao('Novo');

            PrimengInputText.clearAndFillTextByLocator(by.css('input'), this.nomenclatura[i]);
            PrimengInputText.clearAndFillTextByLocator(by.name('descricao'), this.descricao[i]);

            this.clicarBotao('Salvar');
            this.promises.push(PrimengGrowl.isWarningMessage('Registro incluído com sucesso!'));
            PrimengGrowl.closeWarningMessage();
        }
    }

    cadastrarNomenclaturasDuplicidade() {
        this.promises = [];
        PrimengBlockUi.waitBlockUi(2000);
        this.clicarBotao('Novo');

        PrimengInputText.clearAndFillTextByLocator(by.css('input'), this.nomenclatura[0]);
        PrimengInputText.clearAndFillTextByLocator(by.name('descricao'), this.descricao[0]);

        this.clicarBotao('Salvar');
        this.promises.push(PrimengGrowl.isWarningMessage('Registro incluído com sucesso!'));
        PrimengGrowl.closeWarningMessage();

    }

    editarNomenclaturasComSucesso() {
        this.promises = [];
        PrimengBlockUi.waitBlockUi(2000);
        PrimengInputText.clearAndFillTextByLocator(by.css('input'), 'Teste Nomenclatura');
        PrimengInputText.clearAndFillTextByLocator(by.name('descricao'), 'Teste Descrição');
        this.clicarBotao('Salvar');
    }

    cadastrarNomenclaturasObrigatórios() {
        this.promises = [];
        PrimengBlockUi.waitBlockUi(2000);
        PrimengInputText.clearAndFillTextByLocator(by.css('input'), '');
        this.clicarBotao('Salvar');
    }

    verificarPreenchimentoObrigatório() {
        this.promises = [];
        this.promises.push(browser.wait(PrimengComponent.isErrorMessage('.ui-message', 'Campo obrigatório.')));
        return Promise.all(this.promises).then(resultados => {
            switch (false) {
                case resultados[0]:
                    return `Mensagem de Campo Obrigatório não encontrada`;
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

    selecionarLinhaExcluir(linha: string) {
        let id: string;
        id = 'filtroTipoEquipe';
        PrimengInputText.clearAndFillTextByLocator(by.name(id), linha);
        PrimengDataTable.clickCellTextByLocator(by.css('basis-datatable'), linha);
        PrimengButton.clickByLocator(by.css('.ui-button-danger:nth-child(1)'));
        PrimengButton.clickByLocator(by.css('button:nth-child(2)'));
    }
    selecionarLinhaEditar(linha: string) {
        let id: string;
        id = 'filtroTipoEquipe';
        PrimengInputText.clearAndFillTextByLocator(by.name(id), linha);
        this.clicarBotao('Pesquisar');
        PrimengDataTable.clickCellTextByLocator(by.css('basis-datatable'), linha);
        PrimengButton.clickByLocator(by.css('p > .ui-button-success'));
    }

    filtrarNome() {
        let css: string;
        const coluna = 1;
        const mensagem = 'Nenhum registro encontrado.';
        css = 'basis-datatable';

        PrimengInputText.clearAndFillTextByLocator(by.css('input'), 'Editar');
        this.clicarBotao('Pesquisar');
        this.promises.push(browser.wait(PrimengDataTable.isCellTextByLocator(by.css(css), 'Editar', 1, coluna)));
        PrimengInputText.clearAndFillTextByLocator(by.css('input'), 'ditar');
        this.clicarBotao('Pesquisar');
        this.promises.push(browser.wait(PrimengDataTable.isCellTextByLocator(by.css(css), 'Editar', 1, coluna)));
        PrimengInputText.clearAndFillTextByLocator(by.css('input'), '');
        this.clicarBotao('Pesquisar');
        this.promises.push(browser.wait(PrimengDataTable.isCellTextByLocator(by.css(css), 'Inserir', 1, coluna)));
        PrimengInputText.clearAndFillTextByLocator(by.css('input'), '@@@');
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

    ordenarNome() {
        let id: string;
        const coluna = 1;

        this.clicarBotao('Limpar');
        id = 'basis-datatable';
        PrimengDataTable.waitToBePresentByLocator(by.css(id));
        PrimengPaginator.selectMaximumShownedByLocator(by.css(id), 20);

        this.promises = [];
        let linhas: string[];
        linhas = [
            'Editar',
            'Inserir'
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

    ordenarDescricao() {
        let id: string;
        const coluna = 2;

        this.clicarBotao('Limpar');
        id = 'basis-datatable';
        PrimengDataTable.waitToBePresentByLocator(by.css(id));
        PrimengPaginator.selectMaximumShownedByLocator(by.css(id), 20);

        this.promises = [];
        let linhas: string[];
        linhas = [
            'Editar registro de um ALI',
            'Funcionalidade para salvar ou persistir dados.'
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
