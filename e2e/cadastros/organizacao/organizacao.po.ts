import {PrimengInputText} from '../../componentes/primeng-inputtext';
import {browser, by} from 'protractor';
import {PrimengComponent} from '../../componentes/primeng-component';
import {PrimengMenu} from '../../componentes/primeng-menu';
import {PrimengBlockUi} from '../../componentes/primeng-block-ui';
import {PrimengButton} from '../../componentes/primeng-button';
import {PrimengFileUpload} from '../../componentes/primeng-fileupload';
import {PrimengGrowl} from '../../componentes/primeng-growl';
import {PrimengDropdown} from '../../componentes/primeng-dropdown';
import {PrimengCalendar} from '../../componentes/primeng-calendar';
import {PrimengRadioButton} from '../../componentes/primeng-radiobutton';
import {PrimengDataTable} from '../../componentes/primeng-datatable';
import {PrimengPaginator} from '../../componentes/primeng-paginator';
import {Download} from '../../componentes/download';
import {PrimengInputMask} from '../../componentes/primeng-inputmask';

class Organizacao {
    nome: string;
    sigla: string;
    cnpj: string;
    ocorrencia: string;

    nroContrato: string;
    dataIniVigencia: string;
    dataFimVigencia: string;
    garantia: string;

    manual: string;
    dataIniManual: string;
    dataFimManual: string;
}

export class OrganizacaoPage {
    private promises = [];
    private data = require('./assets/Organizacao.json');
    private organizacao: Organizacao[];

    login() {
        const username = 'admin';
        const password = 'admin';
        PrimengInputText.clearAndFillTextByLocator(by.name('username'), username);
        PrimengInputText.clearAndFillTextByLocator(by.name('password'), password);
        PrimengComponent.clickByLocator(by.css('.ui-button'));
    }

    navegar() {
        PrimengMenu.clickByPath(['Cadastros', 'Organização']);
        PrimengBlockUi.waitBlockUi(5000);
    }

    clicarBotao(texto: string) {
        PrimengBlockUi.waitBlockUi(2000);
        PrimengButton.clickByText(texto);
    }

    cadastrarOrganizacaoCamposObrigatorios() {
        PrimengBlockUi.waitBlockUi(2000);
        this.promises = [];
        let path: string;
        let id: string;

        id = 'idLogoOrganizacaoFormOrganizacao';
        path = '../cadastros/organizacao/assets/';
        PrimengFileUpload.inputFileByLocator(by.id(id), 'logo.jpg', path, id);

        /*Nome*/
        PrimengInputText.clearAndFillTextByLocator(by.id('idNomeFormOrganizacao'), '');
        PrimengInputText.clearAndFillTextByLocator(by.id('idSiglaFormOrganizacao'), 'ORG 1');
        PrimengInputMask.clearAndFillTextByLocator(by.id('idCNPJFormOrganizacao'), '37.724.585/0001-00');
        PrimengButton.clickByLocator(by.id('idBtnSalvarOrg'));

        this.promises.push(PrimengComponent.isErrorMessage('.ui-message', 'Campo obrigatório.'));
        PrimengGrowl.closeWarningMessage();

        /*Sigla*/
        PrimengInputText.clearAndFillTextByLocator(by.id('idNomeFormOrganizacao'), 'Organização 1');
        PrimengInputText.clearAndFillTextByLocator(by.id('idSiglaFormOrganizacao'), '');
        PrimengInputMask.fillTextByLocator(by.id('idCNPJFormOrganizacao'), '37.724.585/0001-00');
        PrimengButton.clickByLocator(by.id('idBtnSalvarOrg'));

        this.promises.push(PrimengComponent.isErrorMessage('.ui-message', 'Campo obrigatório.'));
        PrimengGrowl.closeWarningMessage();

        /*CNPJ*/
        PrimengInputText.clearAndFillTextByLocator(by.id('idNomeFormOrganizacao'), 'Organização 1');
        PrimengInputText.clearAndFillTextByLocator(by.id('idSiglaFormOrganizacao'), 'ORG 1');
        PrimengInputMask.clearAndFillTextByLocator(by.id('idCNPJFormOrganizacao'), '');
        PrimengButton.clickByLocator(by.id('idBtnSalvarOrg'));

        this.promises.push(PrimengComponent.isErrorMessage('.ui-message', 'Campo obrigatório.'));
        PrimengGrowl.closeWarningMessage();

        /*CNPJ Inválido*/
        PrimengInputText.clearAndFillTextByLocator(by.id('idNomeFormOrganizacao'), 'Organização 1');
        PrimengInputText.clearAndFillTextByLocator(by.id('idSiglaFormOrganizacao'), 'ORG 1');
        PrimengInputMask.clearAndFillTextByLocator(by.id('idCNPJFormOrganizacao'), '12.312.412/4124-14');

        PrimengButton.clickByLocator(by.id('idBtnSalvarOrg'));

        PrimengGrowl.isWarningMessage('CNPJ inválido');
        PrimengGrowl.closeWarningMessage();

        /*Contratos*/
        PrimengInputText.clearAndFillTextByLocator(by.id('idNomeFormOrganizacao'), 'Organização 1');
        PrimengInputText.clearAndFillTextByLocator(by.id('idSiglaFormOrganizacao'), 'ORG 1');
        PrimengInputMask.clearAndFillTextByLocator(by.id('idCNPJFormOrganizacao'), '37.724.585/0001-00');

        PrimengButton.clickByLocator(by.id('idBtnSalvarOrg'));

        PrimengGrowl.isWarningMessage('Pelo menos 1 contrato é obrigatório por organização.');
        PrimengGrowl.closeWarningMessage();

        return Promise.all(this.promises).then(resultados => {
            switch (false) {
                case resultados[0]:
                    return 'Campo "Nome" não mostrou a mensagem de Preenchimento Obrigatório';
                case resultados[1]:
                    return 'Campo "Sigla" não mostrou a mensagem de Preenchimento Obrigatório';
                case resultados[2]:
                    return 'Campo "CNPJ" não mostrou a mensagem de Preenchimento Obrigatório';
                case resultados[3]:
                    return 'Campo "CNPJ" não mostrou a mensagem de CNPJ inválido';
                case resultados[4]:
                    return 'Campo "Contrato" não mostrou a mensagem de Pelo menos 1 contrato é obrigatório por organização.';
                default:
                    return 'OK';
            }
        });
    }

    cadastrarOrganizacaoCamposObrigatoriosContrato() {
        PrimengBlockUi.waitBlockUi(2000);
        this.promises = [];
        let path: string;
        let id: string;
        let css: string;

        id = 'idLogoOrganizacaoFormOrganizacao';
        path = '../cadastros/organizacao/assets/';
        PrimengFileUpload.inputFileByLocator(by.id(id), 'logo.jpg', path, id);


        PrimengInputText.clearAndFillTextByLocator(by.id('idNomeFormOrganizacao'), 'Organização 1');
        PrimengInputText.clearAndFillTextByLocator(by.id('idSiglaFormOrganizacao'), 'ORG 1');
        PrimengInputMask.clearAndFillTextByLocator(by.id('idCNPJFormOrganizacao'), '37.724.585/0001-00');

        PrimengButton.clickByLocator(by.id('idBtnNovoContratoFormOrganizacao'));

        /*Manual*/
        PrimengInputText.clearAndFillTextByLocator(by.id('idNumeroContratoContratoSaveFormOrganizacao'), 'Contrato');
        PrimengInputText.clearAndFillTextByLocator(by.id('idDiasGarantiaContratoSaveFormOrganizacao'), '01');
        PrimengRadioButton.clickByLocator(by.id('idAtivoSimContratoSaveFormOrganizacao'));
        css = 'p-calendar[name="dataInicioVigenciaContrato"]';
        let date = new Date(2017, 12, 11);
        PrimengCalendar.fillDateByLocator(by.css(css), date);
        css = 'p-calendar[name="dataFimVigenciaContrato"]';
        date = new Date(2019, 12, 11);
        PrimengCalendar.fillDateByLocator(by.css(css), date);
        PrimengButton.clickByLocator(by.id('idBtnSalvarContratoSaveFormOrganizacao'));
        PrimengGrowl.isWarningMessage('Deve haver ao menos um manual');
        PrimengGrowl.closeWarningMessage();

        return Promise.all(this.promises).then(resultados => {
            switch (false) {
                case resultados[0]:
                    return 'Campo "Manual" não mostrou a mensagem de Preenchimento Obrigatório';
                default:
                    return 'OK';
            }
        });
    }

    cadastrarOrganizacaoCamposObrigatoriosEditar() {
        PrimengBlockUi.waitBlockUi(2000);
        this.promises = [];
        let path: string;
        let id: string;

        id = 'idLogoOrganizacaoFormOrganizacao';
        path = '../cadastros/organizacao/assets/';
        PrimengFileUpload.inputFileByLocator(by.id(id), 'logo.jpg', path, id);

        /*Nome*/
        PrimengInputText.clearAndFillTextByLocator(by.id('idNomeFormOrganizacao'), '');
        PrimengInputText.clearAndFillTextByLocator(by.id('idSiglaFormOrganizacao'), 'ORG 1');
        PrimengInputMask.clearAndFillTextByLocator(by.id('idCNPJFormOrganizacao'), '37.724.585/0001-00');
        PrimengButton.clickByLocator(by.id('idBtnSalvarOrg'));

        this.promises.push(PrimengComponent.isErrorMessage('.ui-message', 'Campo obrigatório.'));
        PrimengGrowl.closeWarningMessage();

        /*Sigla*/
        PrimengInputText.clearAndFillTextByLocator(by.id('idNomeFormOrganizacao'), 'Organização 1');
        PrimengInputText.clearAndFillTextByLocator(by.id('idSiglaFormOrganizacao'), '');
        PrimengInputMask.clearAndFillTextByLocator(by.id('idCNPJFormOrganizacao'), '37.724.585/0001-00');
        PrimengButton.clickByLocator(by.id('idBtnSalvarOrg'));

        this.promises.push(PrimengComponent.isErrorMessage('.ui-message', 'Campo obrigatório.'));
        PrimengGrowl.closeWarningMessage();

        /*CNPJ*/
        PrimengInputText.clearAndFillTextByLocator(by.id('idNomeFormOrganizacao'), 'Organização 1');
        PrimengInputText.clearAndFillTextByLocator(by.id('idSiglaFormOrganizacao'), 'ORG 1');
        PrimengInputMask.clearAndFillTextByLocator(by.id('idCNPJFormOrganizacao'), '');
        PrimengButton.clickByLocator(by.id('idBtnSalvarOrg'));

        this.promises.push(PrimengComponent.isErrorMessage('.ui-message', 'Campo obrigatório.'));
        PrimengGrowl.closeWarningMessage();

        /*CNPJ Invalido*/
        PrimengInputText.clearAndFillTextByLocator(by.id('idNomeFormOrganizacao'), 'Organização 1');
        PrimengInputText.clearAndFillTextByLocator(by.id('idSiglaFormOrganizacao'), 'ORG 1');
        PrimengInputMask.clearAndFillTextByLocator(by.id('idCNPJFormOrganizacao'), '12.312.412/4124-14');


        PrimengButton.clickByLocator(by.id('idBtnSalvarOrg'));

        PrimengGrowl.isWarningMessage('CNPJ inválido');
        PrimengGrowl.closeWarningMessage();

        return Promise.all(this.promises).then(resultados => {
            switch (false) {
                case resultados[0]:
                    return 'Campo "Nome" não mostrou a mensagem de Preenchimento Obrigatório';
                case resultados[1]:
                    return 'Campo "Sigla" não mostrou a mensagem de Preenchimento Obrigatório';
                case resultados[2]:
                    return 'Campo "CNPJ" não mostrou a mensagem de Preenchimento Obrigatório';
                case resultados[3]:
                    return 'Campo "CNPJ" não mostrou a mensagem de CNPJ inválido';
                default:
                    return 'OK';
            }
        });
    }

    cadastrarOrganizacaoComSucesso() {
        this.organizacao = this.data;
        let css: string;
        this.promises = [];
        for (let i = 0; i < this.organizacao.length; i++) {
            PrimengBlockUi.waitBlockUi(2000);
            this.clicarBotao('Novo');
            let path: string;
            let id: string;

            id = 'idLogoOrganizacaoFormOrganizacao';
            path = '../cadastros/organizacao/assets/';
            PrimengFileUpload.inputFileByLocator(by.id(id), 'logo.jpg', path, id);

            PrimengInputText.clearAndFillTextByLocator(by.id('idNomeFormOrganizacao'), this.organizacao[i].nome);
            PrimengInputText.clearAndFillTextByLocator(by.id('idSiglaFormOrganizacao'), this.organizacao[i].sigla);
            PrimengInputMask.clearAndFillTextByLocator(by.id('idCNPJFormOrganizacao'), this.organizacao[i].cnpj);
            PrimengInputText.clearAndFillTextByLocator(by.id('idNumeroOcorrenciaFormOrganizacao'), this.organizacao[i].ocorrencia);

            PrimengButton.clickByLocator(by.id('idBtnNovoContratoFormOrganizacao'));

            PrimengInputText.clearAndFillTextByLocator(by.id('idNumeroContratoContratoSaveFormOrganizacao'),
                this.organizacao[i].nroContrato);
            PrimengInputText.clearAndFillTextByLocator(by.id('idDiasGarantiaContratoSaveFormOrganizacao'), this.organizacao[i].garantia);
            PrimengRadioButton.clickByLocator(by.id('idAtivoSimContratoSaveFormOrganizacao'));

            PrimengButton.clickByLocator(by.css('fieldset > legend'));

            css = ' p-calendar[name="dataInicioVigenciaManual"]';
            let date = new Date(this.organizacao[i].dataIniManual);
            PrimengCalendar.fillDateByLocator(by.css(css), date);
            css = ' p-calendar[name="dataFimVigenciaManuak"]';
            date = new Date(this.organizacao[i].dataFimManual);
            PrimengCalendar.fillDateByLocator(by.css(css), date);

            PrimengDropdown.waitToBePresentByLocator(by.name('manualDropdownNovo'));
            PrimengDropdown.selectValueByLocator(by.name('manualDropdownNovo'), this.organizacao[i].manual);
            PrimengRadioButton.clickByLocator(by.id('idAtivoSimManual'));

            PrimengButton.clickByLocator(by.id('idBtnSalvarManualFormOrganizacao'));

            css = 'p-calendar[name="dataInicioVigenciaContrato"]';
            date = new Date(this.organizacao[i].dataIniVigencia);
            PrimengCalendar.fillDateByLocator(by.css(css), date);
            css = 'p-calendar[name="dataFimVigenciaContrato"]';
            date = new Date(this.organizacao[i].dataFimVigencia);
            PrimengCalendar.fillDateByLocator(by.css(css), date);
            PrimengButton.clickByLocator(by.id('idBtnSalvarContratoSaveFormOrganizacao'));
            PrimengButton.clickByLocator(by.id('idBtnSalvarOrg'));
            this.promises.push(PrimengGrowl.isWarningMessage('Registro incluído com sucesso!'));
            PrimengGrowl.closeWarningMessage();
        }
    }

    cadastrarOrganizacaoDuplicidade() {
        let css: string;
        PrimengBlockUi.waitBlockUi(2000);
        this.promises = [];
        let path: string;
        let id: string;
        this.organizacao = this.data;

        id = 'idLogoOrganizacaoFormOrganizacao';
        path = '../cadastros/organizacao/assets/';
        PrimengFileUpload.inputFileByLocator(by.id(id), 'logo.jpg', path, id);

        PrimengInputText.clearAndFillTextByLocator(by.id('idNomeFormOrganizacao'), this.organizacao[1].nome);
        PrimengInputText.clearAndFillTextByLocator(by.id('idSiglaFormOrganizacao'), this.organizacao[1].sigla);
        PrimengInputMask.clearAndFillTextByLocator(by.id('idCNPJFormOrganizacao'), this.organizacao[1].cnpj);
        PrimengInputText.clearAndFillTextByLocator(by.id('idNumeroOcorrenciaFormOrganizacao'), this.organizacao[1].ocorrencia);

        PrimengButton.clickByLocator(by.id('idBtnNovoContratoFormOrganizacao'));


        PrimengInputText.clearAndFillTextByLocator(by.id('idNumeroContratoContratoSaveFormOrganizacao'), this.organizacao[1].nroContrato);
        PrimengInputText.clearAndFillTextByLocator(by.id('idDiasGarantiaContratoSaveFormOrganizacao'), this.organizacao[1].garantia);
        PrimengRadioButton.clickByLocator(by.id('idAtivoSimContratoSaveFormOrganizacao'));

        PrimengButton.clickByLocator(by.css('fieldset > legend'));

        css = ' p-calendar[name="dataInicioVigenciaManual"]';
        let date = new Date(this.organizacao[1].dataIniManual);
        PrimengCalendar.fillDateByLocator(by.css(css), date);
        css = ' p-calendar[name="dataFimVigenciaManuak"]';
        date = new Date(this.organizacao[1].dataFimManual);
        PrimengCalendar.fillDateByLocator(by.css(css), date);

        PrimengDropdown.waitToBePresentByLocator(by.name('manualDropdownNovo'));
        PrimengDropdown.selectValueByLocator(by.name('manualDropdownNovo'), this.organizacao[1].manual);
        PrimengRadioButton.clickByLocator(by.id('idAtivoSimManual'));

        PrimengButton.clickByLocator(by.id('idBtnSalvarManualFormOrganizacao'));

        css = 'p-calendar[name="dataInicioVigenciaContrato"]';
        date = new Date(this.organizacao[1].dataIniVigencia);
        PrimengCalendar.fillDateByLocator(by.css(css), date);
        css = 'p-calendar[name="dataFimVigenciaContrato"]';
        date = new Date(this.organizacao[1].dataFimVigencia);
        PrimengCalendar.fillDateByLocator(by.css(css), date);
        PrimengButton.clickByLocator(by.id('idBtnSalvarContratoSaveFormOrganizacao'));
        PrimengButton.clickByLocator(by.id('idBtnSalvarOrg'));
    }

    cadastrarOrganizacaoEditar() {
        let css: string;
        PrimengBlockUi.waitBlockUi(2000);
        this.promises = [];
        let path: string;
        let id: string;

        id = 'idLogoOrganizacaoFormOrganizacao';
        path = '../cadastros/organizacao/assets/';
        PrimengFileUpload.inputFileByLocator(by.id(id), 'logo.jpg', path, id);

        PrimengInputText.clearAndFillTextByLocator(by.id('idNomeFormOrganizacao'), 'Organização 1');
        PrimengInputText.clearAndFillTextByLocator(by.id('idSiglaFormOrganizacao'), 'ORG1');
        PrimengInputMask.clearAndFillTextByLocator(by.id('idCNPJFormOrganizacao'), '84.332.047/0001-42');
        PrimengInputText.clearAndFillTextByLocator(by.id('idNumeroOcorrenciaFormOrganizacao'), '08/16');

        PrimengButton.clickByLocator(by.id('idBtnNovoContratoFormOrganizacao'));


        PrimengInputText.clearAndFillTextByLocator(by.id('idNumeroContratoContratoSaveFormOrganizacao'), '08/2016');
        PrimengInputText.clearAndFillTextByLocator(by.id('idDiasGarantiaContratoSaveFormOrganizacao'), '80');
        PrimengRadioButton.clickByLocator(by.id('idAtivoSimContratoSaveFormOrganizacao'));

        PrimengButton.clickByLocator(by.css('fieldset > legend'));

        css = ' p-calendar[name="dataInicioVigenciaManual"]';
        let date = new Date('2016/12/08');
        PrimengCalendar.fillDateByLocator(by.css(css), date);
        css = ' p-calendar[name="dataFimVigenciaManuak"]';
        date = new Date('2022/12/08');
        PrimengCalendar.fillDateByLocator(by.css(css), date);

        PrimengDropdown.waitToBePresentByLocator(by.name('manualDropdownNovo'));
        PrimengDropdown.selectValueByLocator(by.name('manualDropdownNovo'), 'IBAMA');
        PrimengRadioButton.clickByLocator(by.id('idAtivoSimManual'));

        PrimengButton.clickByLocator(by.id('idBtnSalvarManualFormOrganizacao'));

        css = 'p-calendar[name="dataInicioVigenciaContrato"]';
        date = new Date('2016/12/08');
        PrimengCalendar.fillDateByLocator(by.css(css), date);
        css = 'p-calendar[name="dataFimVigenciaContrato"]';
        date = new Date('2022/12/08');
        PrimengCalendar.fillDateByLocator(by.css(css), date);
        PrimengButton.clickByLocator(by.id('idBtnSalvarContratoSaveFormOrganizacao'));
        PrimengButton.clickByLocator(by.id('idBtnSalvarOrg'));
    }

    cadastrarOrganizacaoEditarDuplicidade() {
        let css: string;
        PrimengBlockUi.waitBlockUi(2000);
        this.promises = [];
        let path: string;
        let id: string;
        this.organizacao = this.data;

        id = 'idLogoOrganizacaoFormOrganizacao';
        path = '../cadastros/organizacao/assets/';
        PrimengFileUpload.inputFileByLocator(by.id(id), 'logo.jpg', path, id);

        PrimengInputText.clearAndFillTextByLocator(by.id('idNomeFormOrganizacao'), this.organizacao[1].nome);
        PrimengInputText.clearAndFillTextByLocator(by.id('idSiglaFormOrganizacao'), this.organizacao[1].sigla);
        PrimengInputMask.clearAndFillTextByLocator(by.id('idCNPJFormOrganizacao'), this.organizacao[1].cnpj);
        PrimengInputText.clearAndFillTextByLocator(by.id('idNumeroOcorrenciaFormOrganizacao'), this.organizacao[1].ocorrencia);

        PrimengButton.clickByLocator(by.id('idBtnNovoContratoFormOrganizacao'));


        PrimengInputText.clearAndFillTextByLocator(by.id('idNumeroContratoContratoSaveFormOrganizacao'), this.organizacao[1].nroContrato);
        PrimengInputText.clearAndFillTextByLocator(by.id('idDiasGarantiaContratoSaveFormOrganizacao'), this.organizacao[1].garantia);
        PrimengRadioButton.clickByLocator(by.id('idAtivoSimContratoSaveFormOrganizacao'));

        PrimengButton.clickByLocator(by.css('fieldset > legend'));

        css = ' p-calendar[name="dataInicioVigenciaManual"]';
        let date = new Date(this.organizacao[1].dataIniManual);
        PrimengCalendar.fillDateByLocator(by.css(css), date);
        css = ' p-calendar[name="dataFimVigenciaManuak"]';
        date = new Date(this.organizacao[1].dataFimManual);
        PrimengCalendar.fillDateByLocator(by.css(css), date);

        PrimengDropdown.waitToBePresentByLocator(by.name('manualDropdownNovo'));
        PrimengDropdown.selectValueByLocator(by.name('manualDropdownNovo'), this.organizacao[1].manual);
        PrimengRadioButton.clickByLocator(by.id('idAtivoSimManual'));

        PrimengButton.clickByLocator(by.id('idBtnSalvarManualFormOrganizacao'));

        css = 'p-calendar[name="dataInicioVigenciaContrato"]';
        date = new Date(this.organizacao[1].dataIniVigencia);
        PrimengCalendar.fillDateByLocator(by.css(css), date);
        css = 'p-calendar[name="dataFimVigenciaContrato"]';
        date = new Date(this.organizacao[1].dataFimVigencia);
        PrimengCalendar.fillDateByLocator(by.css(css), date);
        PrimengButton.clickByLocator(by.id('idBtnSalvarContratoSaveFormOrganizacao'));
        PrimengButton.clickByLocator(by.id('idBtnSalvarOrg'));
}

    selecionarLinhaEditar(linha: string) {
        let css: string;
        css = 'input';
        PrimengInputText.clearAndFillTextByLocator(by.css(css), linha);
        PrimengButton.clickByLocator(by.id('idBtnPesquisarComponentOrganizacao'));
        PrimengDataTable.clickCellTextByLocator(by.css('basis-datatable'), linha);
        PrimengButton.clickByLocator(by.css('p > .ui-button-success'));
    }

    selecionarLinhaVisualizar(linha: string) {
        let css: string;
        css = 'input';
        PrimengInputText.clearAndFillTextByLocator(by.css(css), linha);
        PrimengButton.clickByLocator(by.id('idBtnPesquisarComponentOrganizacao'));
        PrimengDataTable.clickCellTextByLocator(by.css('basis-datatable'), linha);
        PrimengButton.clickByLocator(by.css(' basis-datatable-button:nth-child(2) > p > button'));
    }

    selecionarLinhaExcluir(linha: string) {let css: string;
        css = 'input';
        PrimengInputText.clearAndFillTextByLocator(by.css(css), linha);
        PrimengButton.clickByLocator(by.id('idBtnPesquisarComponentOrganizacao'));
        PrimengDataTable.clickCellTextByLocator(by.css('basis-datatable'), linha);
        PrimengButton.clickByLocator(by.css('.ui-button-danger:nth-child(1)'));
        PrimengButton.clickByLocator(by.id('idBtnSimDeleteComponentOrganizacao'));
    }
    filtrarFase() {
        let css: string;
        const coluna = 1;
        const mensagem = 'Nenhum registro encontrado.';
        css = 'basis-datatable';

        PrimengInputText.clearAndFillTextByLocator(by.css('input'), 'MTur');
        this.clicarBotao('Pesquisar');
        this.promises.push(browser.wait(PrimengDataTable.isCellTextByLocator(by.id(css), 'MTur', 1, coluna)));
        PrimengInputText.clearAndFillTextByLocator(by.css('input'), 'presp');
        this.clicarBotao('Pesquisar');
        this.promises.push(browser.wait(PrimengDataTable.isCellTextByLocator(by.id(css), 'FUNPRESP', 1, coluna)));
        PrimengInputText.clearAndFillTextByLocator(by.css('input'), '');
        this.clicarBotao('Pesquisar');
        this.promises.push(browser.wait(PrimengDataTable.isCellTextByLocator(by.id(css), 'BASIS', 1, coluna)));
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

    verificarVisualizar() {
        this.promises = [];

        this.promises.push(PrimengComponent.isPresentByLocator(by.css('.ui-md-12:nth-child(1)')));
        this.promises.push(PrimengComponent.isPresentByLocator(by.css('.ui-g-12:nth-child(2)')));
        this.promises.push(PrimengComponent.isPresentByLocator(by.css('.ui-g-12:nth-child(3)')));
        this.promises.push(PrimengComponent.isPresentByLocator(by.css('.ui-g-12:nth-child(4)')));
        this.promises.push(PrimengComponent.isPresentByLocator(by.css('.ui-g-12:nth-child(5)')));
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

    verificarMensagemInclusão(aviso: string) {
        return Promise.all(this.promises).then(resultados => {
            for (let i = 0; i < this.organizacao.length; i++) {
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
            'ANCINE',
            'ANVISA',
            'BASIS',
            'CADE',
            'CFC',
            'CNJ',
            'EB',
            'FNDE',
            'FUNPRESP',
            'IBAMA',
            'MEC',
            'MMA',
            'MME',
            'MTur',
            'SFB'
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
            'Agência Nacional de Vigilância Sanitária',
            'Agência Nacional do Cinema',
            'BASIS Tecnologia',
            'Conselho Administrativo de Defesa Econômica',
            'Conselho Federal de Contabilidade',
            'Conselho Nacional de Justiça',
            'EXERCITO BRASILEIRO',
            'FUNPRESP',
            'Fundo Nacional de Desenvolvimento da Educação'	,
            'Instituto Brasileiro do Meio Ambiente e dos Recursos Naturais Renováveis',
            'Ministério da Educação',
            'Ministério de Minas e Energia',
            'Ministério do Meio Ambiente',
            'Ministério do Turismo',
            'Serviço Florestal Brasileiro'
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

    ordenarCNPJ() {
        let id: string;
        const coluna = 3;

        this.clicarBotao('Limpar');
        id = 'basis-datatable';
        PrimengDataTable.waitToBePresentByLocator(by.css(id));
        PrimengPaginator.selectMaximumShownedByLocator(by.css(id), 20);

        this.promises = [];
        let linhas: string[];
        linhas = [
            '00378257000181',
            '00394445013939',
            '00394452025009',
            '00396895009424',
            '00418993000116',
            '03112386000111',
            '03659166000102',
            '04884574000120',
            '05457283000208',
            '07421906000129',
            '11777162000157',
            '17312597000102',
            '33618570000107',
            '37115375000298',
            '37115383000153'
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
        const coluna = 4;

        this.clicarBotao('Limpar');
        id = 'basis-datatable';
        PrimengDataTable.waitToBePresentByLocator(by.css(id));
        PrimengPaginator.selectMaximumShownedByLocator(by.css(id), 20);

        this.promises = [];
        let linhas: string[];
        linhas = [
            'ANCINE112019-1',
            'CADE072018-1',
            'IBAMA442017-1',
            'MEC252019-1',
            'ANVISA012020-1',
            'MTUR302019-1',
            'CFC-1',
            'FNDE-1',
            'CNJ-1',
            'EBCOLOG1372017-1 E EBDCT32017-1',
            'MME372017-1',
            'FUNPRESP072019-1',
            'MMA202017-1',
            'SFB082018-1',
            '',
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
        const coluna = 5;

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
            'Sim',
            'Sim',
            'Sim',
            'Sim',
            'Sim',
            'Sim',
            'Sim',
            'Sim',
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
