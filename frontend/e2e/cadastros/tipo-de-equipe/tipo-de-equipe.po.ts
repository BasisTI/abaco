import {PrimengInputText} from '../../componentes/primeng-inputtext';
import {browser, by} from 'protractor';
import {PrimengComponent} from '../../componentes/primeng-component';
import {PrimengMenu} from '../../componentes/primeng-menu';
import {PrimengBlockUi} from '../../componentes/primeng-block-ui';
import {PrimengButton} from '../../componentes/primeng-button';
import {PrimengMultiSelect} from '../../componentes/primeng-multiselect';
import {PrimengGrowl} from '../../componentes/primeng-growl';
import {PrimengDataTable} from '../../componentes/primeng-datatable';
import {PrimengPaginator} from '../../componentes/primeng-paginator';
import {Download} from '../../componentes/download';

class Equipe {
    nome: string;
    organizacao: string[];
    cpf: string[];
}


export class TipoDeEquipePage {
    private promises = [];
    private equipe: Equipe[];
    private data = require('./assets/Equipe.json');

    login() {
        const username = 'admin';
        const password = 'admin';
        PrimengInputText.clearAndFillTextByLocator(by.name('username'), username);
        PrimengInputText.clearAndFillTextByLocator(by.name('password'), password);
        PrimengComponent.clickByLocator(by.css('.ui-button'));
    }
    navegar() {
        PrimengMenu.clickByPath(['Cadastros', 'Tipo Equipe']);
        PrimengBlockUi.waitBlockUi(5000);
    }

    clicarBotao(texto: string) {
        PrimengBlockUi.waitBlockUi(2000);
        PrimengButton.clickByText(texto);
    }

    cadastrarEquipeCamposObrigatorios() {

        PrimengInputText.clearAndFillTextByLocator(by.name('nomeTipoEquipe'), 'Equipe');
        PrimengButton.clickByLocator(by.css('.green-btn'));

        this.promises.push(PrimengComponent.isErrorMessage2('/html/body/app-root/div/div/div[2]/div/jhi-tipo-equipe-form/div/div/div/form/div[1]/div[2]/span/div', 'Campo obrigatório.'));
        PrimengGrowl.closeWarningMessage();

        PrimengInputText.clearAndFillTextByLocator(by.name('nomeTipoEquipe'), '');
        PrimengMultiSelect.clearAndSelectValuesByLocator(by.name('organizacoesMultiSelect'), ['MTur - Ministério do Turismo']);
        PrimengButton.clickByLocator(by.css('.green-btn'));

        this.promises.push(PrimengComponent.isErrorMessage('.ui-message', 'Campo obrigatório.'));
        PrimengGrowl.closeWarningMessage();

        return Promise.all(this.promises).then(resultados => {
            switch (false) {
                case resultados[0]:
                    return 'Campo "Nome" não mostrou a mensagem de Preenchimento Obrigatório';
                case resultados[1]:
                    return 'Campo "Organização" não mostrou a mensagem de Preenchimento Obrigatório';
                default:
                    return 'OK';
            }
        });
    }

    cadastrarNovasEquipes() {
        this.promises = [];
        this.equipe = this.data;
        for (let i = 0; i < this.equipe.length; i++) {
            this.clicarBotao('Novo');
            PrimengInputText.clearAndFillTextByLocator(by.name('nomeTipoEquipe'), this.equipe[i].nome);

            PrimengMultiSelect.clearAndSelectValuesByLocator(by.name('organizacoesMultiSelect'), this.equipe[i].organizacao);
            PrimengButton.clickByLocator(by.css('.green-btn'));
            this.promises.push(PrimengGrowl.isWarningMessage('Registro incluído com sucesso!'));
            PrimengGrowl.closeWarningMessage();
        }
    }

    selecionarLinhaEditar(linha: string) {
        PrimengDataTable.clickCellTextByLocator(by.css('basis-datatable'), linha);
        PrimengButton.clickByLocator(by.css('.ng-star-inserted:nth-child(1) .ui-button'));
    }

    selecionarLinhaExcluir(linha: string) {
        PrimengDataTable.clickCellTextByLocator(by.css('basis-datatable'), linha);
        PrimengButton.clickByLocator(by.css('.ui-button-danger:nth-child(1)'));
        PrimengButton.clickByLocator(by.css('.ui-button-text-icon-left:nth-child(2)'));
        this.promises.push(browser.wait(PrimengGrowl.isWarningMessage('Registro excluído com sucesso!')));
        PrimengGrowl.closeWarningMessage();
    }

    selecionarLinhaVisualizar(linha: string) {
        PrimengDataTable.clickCellTextByLocator(by.css('basis-datatable'), linha);
        PrimengButton.clickByLocator(by.css('.ng-star-inserted:nth-child(2) .ui-button'));
    }

    verificarVisualizar() {
        this.promises = [];

        this.promises.push(browser.wait(PrimengComponent.isPresentByLocator(by.css('label'))));
        this.promises.push(browser.wait(PrimengComponent.isPresentByLocator(by.css('.ui-datatable-even > .ng-star-inserted'))));
        return Promise.all(this.promises).then(resultados => {
            switch (false) {
                case resultados[0]:
                    return `Erro ao testar visualizar`;
                case resultados[1]:
                    return `Erro ao testar visualizar`;
                default:
                    return 'OK';
            }
        });
    }

    cadastrarEquipeDuplicidade() {
        this.equipe = this.data;
        this.promises = [];
        PrimengInputText.clearAndFillTextByLocator(by.name('nomeTipoEquipe'), this.equipe[1].nome);
        PrimengMultiSelect.clearAndSelectValuesByLocator(by.name('organizacoesMultiSelect'), this.equipe[1].organizacao);
        PrimengButton.clickByLocator(by.css('.green-btn'));
        this.promises.push(PrimengGrowl.isWarningMessage('Já existe um Tipo de Equipe registrado com este nome!'));
        PrimengGrowl.closeWarningMessage();
    }

    cadastrarEquipeEditar() {
        this.promises = [];
        PrimengInputText.clearAndFillTextByLocator(by.name('nomeTipoEquipe'), `Equipe 21`);
        PrimengMultiSelect.clearAndSelectValuesByLocator(by.name('organizacoesMultiSelect'), [`EB - EXERCITO BRASILEIRO`]);
        PrimengButton.clickByLocator(by.css('.green-btn'));
        this.promises.push(browser.wait(PrimengGrowl.isWarningMessage('Registro alterado com sucesso!')));
        PrimengGrowl.closeWarningMessage();
    }

    cadastrarEquipeEditarDuplicidade() {
            this.promises = [];
            PrimengInputText.clearAndFillTextByLocator(by.name('nomeTipoEquipe'), `Fabrica de Métricas - Cliente`);
            PrimengMultiSelect.clearAndSelectValuesByLocator(by.name('organizacoesMultiSelect'), [`MTur - Ministério do Turismo`]);
            PrimengButton.clickByLocator(by.css('.green-btn'));
            this.promises.push(browser.wait(PrimengGrowl.isWarningMessage('Já existe um Tipo de Equipe registrado com este nome!')));
            PrimengGrowl.closeWarningMessage();
        }

    verificarMensagem(aviso: string) {
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

    filtrarEquipe(texto: string) {
        const coluna = 1;
        let css: string;
        this.promises = [];
        const mensagem = 'Nenhum registro encontrado.';
        css = 'basis-datatable';

        PrimengInputText.clearAndFillTextByLocator(by.name('filtroTipoEquipe'), `Fabrica`);
        PrimengButton.clickByLocator(by.css('.blue-btn'));
        this.promises.push(browser.wait(PrimengDataTable.isCellTextByLocator(by.css(css), texto, 1, coluna)));
        PrimengInputText.clearAndFillTextByLocator(by.name('filtroTipoEquipe'), `brica`);
        PrimengButton.clickByLocator(by.css('.blue-btn'));
        this.promises.push(browser.wait(PrimengDataTable.isCellTextByLocator(by.css(css), texto, 1, coluna)));
        PrimengInputText.clearAndFillTextByLocator(by.name('filtroTipoEquipe'), ``);
        PrimengButton.clickByLocator(by.css('.blue-btn'));
        this.promises.push(browser.wait(PrimengDataTable.isCellTextByLocator(by.css(css), 'Métricas - BASIS', 1, coluna)));
    }

    verificarFiltrarEquipe(texto: string) {
        return Promise.all(this.promises).then(resultados => {
            switch (false) {
                case resultados[0]:
                    return `Filtro com texto "${texto}" retornou resultados incorretos para a linha 1.`;
                case resultados[1]:
                    return `Filtro com texto "${texto}" em minusculo retornou resultados incorretos para a linha 1.`;
                case resultados[2]:
                    return `Filtro sem texto retornou resultados incorretos para a linha 1.`;
                default:
                    return 'OK';
            }
        });
    }

    ordenarEquipe() {
        const coluna = 1;

        PrimengButton.clickByLocator(by.css('.abaco-white-btn'));
        const css = 'basis-datatable';
        PrimengDataTable.waitToBePresentByLocator(by.css(css));
        PrimengPaginator.selectMaximumShownedByLocator(by.css(css), 20);

        this.promises = [];
        let linhas: string[];
        linhas = [
            'Fabrica de Métricas - Cliente',
            'Métricas - BASIS',
            'Métricas - BASIS 2'
        ];

        PrimengButton.clickByLocator(by.css(`p-table > div > div > table > thead > tr > th:nth-child(${coluna})`));
        this.promises.push(PrimengDataTable.isColumnTextsByLocatorSpan(by.css(css), coluna, linhas, true));
        PrimengButton.clickByLocator(by.css(`p-table > div > div > table > thead > tr > th:nth-child(${coluna})`));
        this.promises.push(PrimengDataTable.isColumnTextsByLocatorSpan(by.css(css), coluna, linhas, false));


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

    exportar() {
        PrimengButton.clickByLocator(by.css('.ui-splitbutton-menubutton'));
        PrimengButton.clickByLocator(by.css('.ui-menuitem:nth-child(1) > .ui-menuitem-link'));
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
}
