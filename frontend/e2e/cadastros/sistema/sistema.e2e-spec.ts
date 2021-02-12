import {browser} from 'protractor';
import {SistemaPage} from './sistema.po';

describe('Abaco - Cadastros Sistemas', function() {
    let page: SistemaPage;
    beforeAll(() => {
        page = new SistemaPage();
        browser.driver.manage().window().maximize();
        browser.get('/');
    });
    beforeEach(function () {
        browser.get('/');
    });

    it('Cadastros Sistemas - Cadastrar Sistemas Com Sucesso', function () {
        page.login();
        page.navegar();
        page.cadastrarSistemasComSucesso();
        expect(page.verificarMensagemInclusão('Registro incluído com sucesso!')).toBe('OK');
    }, 200000);

    it('Cadastros Sistemas - Cadastrar Sistemas Campos Obrigatórios', function () {
        page.login();
        page.navegar();
        page.clicarBotao('Novo');
        expect(page.cadastrarSistemasCamposObrigatórios()).toBe('OK');
    }, 25000);

    it('Cadastros Sistemas - Cadastrar Sistemas em Duplicidade', function () {
        page.login();
        page.navegar();
        page.clicarBotao('Novo');
        page.cadastrarSistemasDuplicidade();
        expect(page.verificarMensagem('O sistema ADS China já está cadastrado!')).toBe('OK');
    });

    it('Cadastros Sistemas - Editar Sistemas Sem Campos Obrigatoŕios', function () {
        page.login();
        page.navegar();
        page.selecionarLinhaEditar('Fiscon');
        expect(page.cadastrarSistemaCamposObrigatoriosEditar()).toBe('OK');
    });

    it('Cadastros Sistemas - Editar Sistemas com Duplicidade', function () {
        page.login();
        page.navegar();
        page.selecionarLinhaEditar('Fiscon');
        page.cadastrarSistemasDuplicidade();
        expect(page.verificarMensagem('O sistema ADS China já está cadastrado!')).toBe('OK');
    });

    it('Cadastros Sistemas - Editar Sistema com Sucesso', function () {
        page.login();
        page.navegar();
        page.selecionarLinhaEditar('Fiscon');
        page.cadastrarSistemaEditar();
        expect(page.verificarMensagem('Registro alterado com sucesso!')).toBe('OK');
    });

    it('Cadastros Sistemas - Excluir Sistema', function () {
        page.login();
        page.navegar();
        page.selecionarLinhaExcluir('Apolo');
        expect(page.verificarMensagem('Registro excluído com sucesso!')).toBe('OK');
    });

    /*Pesquisar*/
    it('Cadastros Sistemas - Pesquisar Sigla', function () {
        page.login();
        page.navegar();
        page.filtrarSigla();
        expect(page.verificarFiltrar()).toBe('OK');
    });

    it('Cadastros Sistemas - Pesquisar Nome Sistema', function () {
        page.login();
        page.navegar();
        page.filtrarSistema();
        expect(page.verificarFiltrar()).toBe('OK');
    });

    it('Cadastros Sistemas - Pesquisar Organização', function () {
        page.login();
        page.navegar();
        page.filtrarOrganizacao();
        expect(page.verificarFiltrarOrganizacao()).toBe('OK');
    });

    /* Defeito Encontrado */
    it('Cadastros Sistemas - Ordenar Sigla', function () {
        page.login();
        page.navegar();
        expect(page.ordenarSigla()).toBe('OK');
    });

    it('Cadastros Sistemas - Ordenar Nome', function () {
        page.login();
        page.navegar();
        expect(page.ordenarNome()).toBe('OK');
    });

    it('Cadastros Sistemas - Ordenar Número Ocorrencia', function () {
        page.login();
        page.navegar();
        expect(page.ordenarNumero()).toBe('OK');
    });
});

