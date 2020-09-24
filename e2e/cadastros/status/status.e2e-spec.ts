import {browser} from 'protractor';
import {StatusPage} from './status.po';

describe('Abaco - Cadastros Status', function() {
    let page: StatusPage;
    beforeAll(() => {
        page = new StatusPage();
        browser.driver.manage().window().maximize();
        browser.get('/');
    });
    beforeEach(function () {
        browser.get('/');
    });

    it('Cadastros Status - Cadastrar Status com Sucesso', function () {
        page.login();
        page.navegar();
        page.cadastrarNovasStatus();
        expect(page.verificarMensagemInclusão('Registro incluído com sucesso!')).toBe('OK');
    }, 100000);

    it('Cadastros Status - Cadastrar Status Campos Obrigatórios', function () {
        page.login();
        page.navegar();
        page.clicarBotao('Novo');
        expect(page.cadastrarStatusCamposObrigatorios()).toBe('OK');
    }, 10000);

    it('Cadastros Status - Editar Status com Sucesso', function () {
        page.login();
        page.navegar();
        page.selecionarLinhaEditar('Reprovada');
        page.editarStatus();
        expect(page.verificarMensagem('Registro alterado com sucesso!')).toBe('OK');
    });

    it('Cadastros Status - Visualizar Status', function () {
        page.login();
        page.navegar();
        page.selecionarLinhaVisualizar('Devolvida');
        expect(page.verificarVisualizar()).toBe('OK');
    });

    it('Cadastros Status - Excluir Status', function () {
        page.login();
        page.navegar();
        page.selecionarLinhaExcluir('Devolvida');
        expect(page.verificarMensagem('Registro excluído com sucesso!')).toBe('OK');
    });

    /*Pesquisar*/
    it('Cadastros Status - Pesquisar Status', function () {
        page.login();
        page.navegar();
        page.filtrarStatus();
        expect(page.verificarFiltrar()).toBe('OK');
    });

    /*Ordenar*/
    it('Cadastros Status - Ordenar Status', function () {
        page.login();
        page.navegar();
        expect(page.ordenarStatus()).toBe('OK');
    });

    it('Cadastros Status - Ordenar Ativo', function () {
        page.login();
        page.navegar();
        expect(page.ordenarAtivo()).toBe('OK');
    });


});
