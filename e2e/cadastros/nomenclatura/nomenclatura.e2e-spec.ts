import {browser} from 'protractor';
import {NomenclaturaPage} from './nomenclatura.po';

describe('Abaco - Cadastros Nomenclaturas', function() {
    let page: NomenclaturaPage;
    beforeAll(() => {
        page = new NomenclaturaPage();
        browser.driver.manage().window().maximize();
        browser.get('/');
    });
    beforeEach(function () {
        browser.get('/');
    });

    it('Cadastros Nomenclaturas - Cadastrar Nomenclaturas Com Sucesso', function () {
        page.login();
        page.navegar();
        page.cadastrarNomenclaturasComSucesso();
        expect(page.verificarMensagemInclusão('Registro incluído com sucesso!')).toBe('OK');
    }, 200000);

    it('Cadastros Nomenclaturas - Cadastrar Nomenclaturas Campos Obrigatórios', function () {
        page.login();
        page.navegar();
        page.clicarBotao('Novo');
        page.cadastrarNomenclaturasObrigatórios();
        expect(page.verificarPreenchimentoObrigatório()).toBe('OK');
    }, 25000);

    it('Cadastros Nomenclaturas - Editar Nomenclaturas Sem Campos Obrigatoŕios', function () {
        page.login();
        page.navegar();
        page.selecionarLinhaEditar('Testar');
        page.cadastrarNomenclaturasObrigatórios();
        expect(page.verificarPreenchimentoObrigatório()).toBe('OK');
    });

    it('Cadastros Nomenclaturas - Editar Nomenclaturas com Sucesso', function () {
        page.login();
        page.navegar();
        page.selecionarLinhaEditar('Testar');
        page.editarNomenclaturasComSucesso();
        expect(page.verificarMensagem('Registro alterado com sucesso!')).toBe('OK');
    });

    it('Cadastros Nomenclaturas - Excluir Nomenclaturas', function () {
        page.login();
        page.navegar();
        page.selecionarLinhaExcluir('Teste Nomenclatura');
        expect(page.verificarMensagem('Registro excluído com sucesso!')).toBe('OK');
    });

    /*Pesquisar*/
    it('Cadastros Nomenclaturas - Pesquisar Nome', function () {
        page.login();
        page.navegar();
        page.filtrarNome();
        expect(page.verificarFiltrar()).toBe('OK');
    });

    it('Cadastros Nomenclaturas - Ordenar Nome', function () {
        page.login();
        page.navegar();
        expect(page.ordenarNome()).toBe('OK');
    });

    /* Defeito Encontrado */
    it('Cadastros Nomenclaturas - Ordenar Descricao', function () {
        page.login();
        page.navegar();
        expect(page.ordenarDescricao()).toBe('OK');
    });
});
