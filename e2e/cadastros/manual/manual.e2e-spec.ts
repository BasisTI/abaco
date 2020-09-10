import {browser, by} from 'protractor';
import {ManualPage} from './manual.po';

describe('Abaco - Cadastros Manual', function() {
    let page: ManualPage;
    beforeAll(() => {
        page = new ManualPage();
        browser.driver.manage().window().maximize();
        browser.get('/');
    });
    beforeEach(function () {
        browser.get('/');
    });

    it('Cadastros Manual - Cadastrar Manual Com Sucesso', function () {
        page.login();
        page.navegar();
        page.cadastrarManualSucesso();
        expect(page.verificarMensagemInclusão('Registro incluído com sucesso!')).toBe('OK');
    }, 2000000);

    it('Cadastros Manual - Cadastrar Manual Campos Obrigatórios', function () {
        page.login();
        page.navegar();
        page.clicarBotao('Novo');
        expect(page.cadastrarManualCamposObrigatorios()).toBe('OK');
    }, 200000);

    it('Cadastros Manual - Cadastrar Manual em Duplicidade', function () {
        page.login();
        page.navegar();
        page.cadastrarManualDuplicidade();
        expect(page.verificarMensagem('Já existe um Manual registrado com este nome!')).toBe('OK');
    }, 2000000);

    it('Cadastros Manual - Editar Manual com Duplicidade', function () {
        page.login();
        page.navegar();
        page.selecionarLinhaEditar('Teste Manual');
        page.cadastrarManualEditar();
        expect(page.verificarMensagem('Já existe um Manual registrado com este nome!')).toBe('OK');
    });

    it('Cadastros Manual - Visualizar Manual', function () {
        page.login();
        page.navegar();
        page.selecionarLinhaVisualizar('Teste Manual');
        expect(page.verificarVisualizar()).toBe('OK');
    });

    it('Cadastros Manual - Excluir Manual', function () {
        page.login();
        page.navegar();
        page.selecionarLinhaExcluir('Teste Manual');
        expect(page.verificarMensagem('Registro excluído com sucesso!')).toBe('OK');
    });

    it('Cadastros Manual - Ordenar Manual', function () {
        page.login();
        page.navegar();
        expect(page.ordenarManual()).toBe('OK');
    });

    it('Cadastros Manual - Ordenar Estimada', function () {
        page.login();
        page.navegar();
        expect(page.ordenarEstimada()).toBe('OK');
    });

    it('Cadastros Manual - Ordenar Indicativa', function () {
        page.login();
        page.navegar();
        expect(page.ordenarIndicativa()).toBe('OK');
    });

    it('Cadastros Manual - Ordenar Inclusão', function () {
        page.login();
        page.navegar();
        expect(page.ordenarInclusao()).toBe('OK');
    });

    it('Cadastros Manual - Ordenar Alteração', function () {
        page.login();
        page.navegar();
        expect(page.ordenarAlteracao()).toBe('OK');
    });

    it('Cadastros Manual - Ordenar Exclusão', function () {
        page.login();
        page.navegar();
        expect(page.ordenarExclusao()).toBe('OK');
    });

    it('Cadastros Manual - Ordenar Conversão', function () {
        page.login();
        page.navegar();
        expect(page.ordenarConversao()).toBe('OK');
    });

    it('Cadastros Manual - Clonar Manual', function () {
        page.login();
        page.navegar();
        page.selecionarLinhaClonar('MEC');
        page.clonarManual();
        expect(page.verificarMensagem('ManualManual MEC Duplicado clonado a partir do manualMEC com sucesso!')).toBe('OK');
    });

    it('Cadastros Manual - Clonar Manual Duplicidade', function () {
        page.login();
        page.navegar();
        page.selecionarLinhaClonar('MEC');
        page.clonarManual();
        expect(page.verificarMensagem('O nome digitado já existe!')).toBe('OK');
    });

});
