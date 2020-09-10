import {browser} from 'protractor';
import {OrganizacaoPage} from './organizacao.po';

describe('Abaco - Cadastros Organização', function() {
    let page: OrganizacaoPage;
    beforeAll(() => {
        page = new OrganizacaoPage();
        browser.driver.manage().window().maximize();
        browser.get('/');
    });
    beforeEach(function () {
        browser.get('/');
    });

    it('Cadastros Organização - Cadastrar Organização Com Sucesso', function () {
        page.login();
        page.navegar();
        page.cadastrarOrganizacaoComSucesso();
        expect(page.verificarMensagemInclusão('Registro incluído com sucesso!')).toBe('OK');
    }, 2000000);

    it('Cadastros Organização - Cadastrar Organização Campos Obrigatórios', function () {
        page.login();
        page.navegar();
        page.clicarBotao('Novo');
        expect(page.cadastrarOrganizacaoCamposObrigatorios()).toBe('OK');
    }, 80000);

    it('Cadastros Organização - Cadastrar Contrato sem Manual', function () {
        page.login();
        page.navegar();
        page.clicarBotao('Novo');
        expect(page.cadastrarOrganizacaoCamposObrigatoriosContrato()).toBe('OK');
    });

    it('Cadastros Organização - Cadastrar Organização em Duplicidade', function () {
        page.login();
        page.navegar();
        page.clicarBotao('Novo');
        page.cadastrarOrganizacaoDuplicidade();
        expect(page.verificarMensagem('Cadastros.Organizacao.Mensagens.msgJaExisteOrganizacaoRegistradaComEsteCNPJ')).toBe('OK');
    });

    it('Cadastros Organização - Editar Organização Sem Campos Obrigatoŕios', function () {
        page.login();
        page.navegar();
        page.selecionarLinhaEditar('ORG');
        expect(page.cadastrarOrganizacaoCamposObrigatoriosEditar()).toBe('OK');
    });

    it('Cadastros Organização - Editar Organização com Duplicidades', function () {
        page.login();
        page.navegar();
        page.selecionarLinhaEditar('ORG');
        page.cadastrarOrganizacaoEditarDuplicidade();
        expect(page.verificarMensagem('Cadastros.Organizacao.Mensagens.msgJaExisteOrganizacaoRegistradaComEsteCNPJ')).toBe('OK');
    });

    it('Cadastros Organização - Editar Organização com Sucesso', function () {
        page.login();
        page.navegar();
        page.selecionarLinhaEditar('ORG');
        page.cadastrarOrganizacaoEditar();
        expect(page.verificarMensagem('Registro alterado com sucesso!')).toBe('OK');
    });

    it('Cadastros Organização - Visualizar Organização', function () {
        page.login();
        page.navegar();
        page.selecionarLinhaVisualizar('ORG');
        expect(page.verificarVisualizar()).toBe('OK');
    });

    it('Cadastros Organização - Excluir Organização', function () {
        page.login();
        page.navegar();
        page.selecionarLinhaExcluir('ORG1');
        expect(page.verificarMensagem('Registro excluído com sucesso!')).toBe('OK');
    });

    /*Pesquisar*/
    it('Cadastros Organização - Pesquisar Organização', function () {
        page.login();
        page.navegar();
        page.filtrarFase();
        expect(page.verificarFiltrar()).toBe('OK');
    });

    /*Ordenar*/
    it('Cadastros Organização - Ordenar Sigla', function () {
        page.login();
        page.navegar();
        expect(page.ordenarSigla()).toBe('OK');
    });

    it('Cadastros Organização - Ordenar Nome', function () {
        page.login();
        page.navegar();
        expect(page.ordenarNome()).toBe('OK');
    });

    it('Cadastros Organização - Ordenar CNPJ', function () {
        page.login();
        page.navegar();
        expect(page.ordenarCNPJ()).toBe('OK');
    });

    it('Cadastros Organização - Ordenar Ativo', function () {
        page.login();
        page.navegar();
        expect(page.ordenarAtivo()).toBe('OK');
    });
});
