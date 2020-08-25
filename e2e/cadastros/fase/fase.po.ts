import {PrimengInputText} from '../../componentes/primeng-inputtext';
import {browser, by, protractor} from 'protractor';
import {PrimengComponent} from '../../componentes/primeng-component';
import {PrimengMenu} from '../../componentes/primeng-menu';
import {PrimengBlockUi} from '../../componentes/primeng-block-ui';
import {PrimengGrowl} from '../../componentes/primeng-growl';
import {PrimengButton} from '../../componentes/primeng-button';
import {PrimengDataTable} from '../../componentes/primeng-datatable';
import {PrimengPaginator} from '../../componentes/primeng-paginator';
import {Download} from '../../componentes/download';

export class FasePage {
    private promises = [];
    private fases = [
        'Engenharia de Requisitos',
        'Design e Arquitetura',
        'Implementação',
        'Testes',
        'Homologação',
        'Implantação',
        'Fase Teste 1'];



    login() {
        const username = 'admin';
        const password = 'admin';
        PrimengInputText.clearAndFillTextByLocator(by.name('username'), username);
        PrimengInputText.clearAndFillTextByLocator(by.name('password'), password);
        PrimengButton.clickByLocator(by.css('.ui-button'));
    }
    navegar() {
        PrimengMenu.clickByPath(['Cadastros', 'Fase']);
        PrimengBlockUi.waitBlockUi(5000);
    }
    clicarBotao(texto: string) {
        PrimengButton.clickByText(texto);
    }
    cadastrarNovasFases() {
        this.promises = [];
        for (let i = 0; i < this.fases.length; i++) {
            this.clicarBotao('Novo');
            PrimengInputText.clearAndFillTextByLocator(by.name('nomeTipoFase'), `${this.fases[i]}`);
            this.clicarBotao('Salvar') ;
            this.promises.push(PrimengGrowl.isWarningMessage('Registro incluído com sucesso!'));
            PrimengGrowl.closeWarningMessage();
        }
    }
    cadastrarFase(nome: string) {
        PrimengInputText.clearAndFillTextByLocator(by.name('nomeTipoFase'), nome);
        this.clicarBotao('Salvar');
    }
    selecionarLinhaEditar(linha: string) {
        let css: string;
        PrimengInputText.clearAndFillTextByLocator(by.css('.ui-inputtext'), linha);
        PrimengInputText.fillTextByLocator(by.css('.ui-inputtext'), protractor.Key.ENTER);
        css = 'table';
        PrimengDataTable.clickCellTextByLocator(by.css(css), linha);
        PrimengButton.clickByTitle('Editar');
    }
    selecionarLinhaVisualizar(linha: string) {
        let css: string;
        PrimengInputText.clearAndFillTextByLocator(by.css('.ui-inputtext'), linha);
        PrimengInputText.fillTextByLocator(by.css('.ui-inputtext'), protractor.Key.ENTER);
        css = 'table';
        PrimengDataTable.clickCellTextByLocator(by.css(css), linha);
        PrimengButton.clickByTitle('Visualizar');
    }
    selecionarLinhaExcluir(linha: string) {
        let css: string;
        PrimengInputText.clearAndFillTextByLocator(by.css('.ui-inputtext'), linha);
        PrimengInputText.fillTextByLocator(by.css('.ui-inputtext'), protractor.Key.ENTER);
        css = 'table';
        PrimengDataTable.clickCellTextByLocator(by.css(css), linha);
        PrimengButton.clickByTitle('Excluir');
        PrimengButton.clickByLocator(by.css('.ui-button-text-icon-left:nth-child(2)'));
    }
    filtrarFase() {
        let css: string;
        const coluna = 1;
        const mensagem = 'No records found';
        css = 'table';

        PrimengInputText.clearAndFillTextByLocator(by.css('.ui-inputtext'), 'Arqui');
        browser.sleep(2000);
        this.promises.push(browser.wait(PrimengDataTable.isCellTextByLocator(by.css(css), 'Design e Arquitetura', 1, coluna)));
        PrimengInputText.clearAndFillTextByLocator(by.css('.ui-inputtext'), '@@');
        browser.sleep(2000);
        this.promises.push(browser.wait(PrimengDataTable.isEmptyMessageByLocator(by.css(css), mensagem)));
        PrimengInputText.clearAndFillTextByLocator(by.css('.ui-inputtext'), '');
        browser.sleep(2000);
        this.promises.push(browser.wait(PrimengDataTable.isCellTextByLocator(by.css(css), 'Engenharia de Requisitos', 1, coluna)));
    }
    ordenarFase() {
        let css: string;
        const coluna = 1;


        this.promises = [];
        let linhas: string[];
        linhas = [
            'Design e Arquitetura',
            'Engenharia de Requisitos',
            'Homologação',
            'Implantação',
            'Implementação',
            'Testes',
        ];

        css = 'table';
        PrimengButton.clickByLocator(by.css('.ui-sortable-column'));
        this.promises.push(PrimengDataTable.isColumnTextsByLocator(by.css(css), coluna, linhas, true));
        PrimengButton.clickByLocator(by.css('.ui-sortable-column'));
        this.promises.push(PrimengDataTable.isColumnTextsByLocator(by.css(css), coluna, linhas, false));


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
            for (let i = 0; i < resultados.length; i++) {
                if (!resultados[i]) {
                    return `Inclusão ${i} não apresentou a mensagem de aviso "${aviso}"`;
                }
            }
            return 'OK';
        });
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
    verificarVisualizarFechar() {
        this.promises = [];

        this.promises.push(PrimengComponent.isPresentByLocator(by.css('label')));
        return Promise.all(this.promises).then(resultados => {
            switch (false) {
                case resultados[0]:
                    return `Erro ao testar visualizar`;
                default:
                    return 'OK';
            }
        });
    }
    verificarFiltrar() {
        this.promises = [];

        return Promise.all(this.promises).then(resultados => {
            switch (false) {
                case resultados[0]:
                    return `Erro ao filtrar com texto`;
                case resultados[1]:
                    return `Erro ao filtrar sem texto`;
                case resultados[2]:
                    return `Erro ao filtrar com "@@@"`;
                default:
                    return 'OK';
            }
        });
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
