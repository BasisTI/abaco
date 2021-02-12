import {FasePage} from './fase.po';
import {browser} from 'protractor';

describe('Abaco - Cadastros Fase', function() {
    let page: FasePage;
    beforeAll(() => {
        page = new FasePage();
        browser.driver.manage().window().maximize();
        browser.get('/');
    });

    beforeEach(function () {
        browser.get('/');
    });


    it('Cadastros Fase - Cadastrar Fases com sucesso', function () {
        page.login();
        page.navegar();
        page.cadastrarNovasFases();
        expect(page.verificarMensagemInclusão('Registro incluído com sucesso!')).toBe('OK');
    }, 300000);

    it('Cadastros Fase - Cadastrar Fase Sem Campos Obrigatórios', function () {
        page.login();
        page.navegar();
        page.clicarBotao('Novo');
        page.cadastrarFase('');
        expect(page.verificarPreenchimentoObrigatório()).toBe('OK');
    });

    it('Cadastros Fase - Editar Fase Sem Campos Obrigatoŕios', function () {
        page.login();
        page.navegar();
        page.selecionarLinhaEditar('Testes');
        page.cadastrarFase('');
        expect(page.verificarPreenchimentoObrigatório()).toBe('OK');
    });

    it('Cadastros Fase - Editar Fase com Sucesso', function () {
        page.login();
        page.navegar();
        page.selecionarLinhaEditar('Fase Teste 1');
        page.cadastrarFase('Fase Teste 2');
        expect(page.verificarMensagem('Registro alterado com sucesso!')).toBe('OK');
    });

    it('Cadastros Fase - Visualizar Fase', function () {
        page.login();
        page.navegar();
        page.selecionarLinhaVisualizar('Testes');
        expect(page.verificarVisualizarFechar()).toBe('OK');
    });

    it('Cadastros Fase - Excluir Fase', function () {
        page.login();
        page.navegar();
        page.selecionarLinhaExcluir('Fase Teste 2');
        expect(page.verificarMensagem('Registro excluído com sucesso!')).toBe('OK');
    });

    /*Ordenar e Pesquisar*/
    it('Cadastros Fase - Pesquisar Fase', function () {
        page.login();
        page.navegar();
        page.filtrarFase();
        expect(page.verificarFiltrar()).toBe('OK');
    });

    it('Cadastros Fase - Ordenar Fase', function () {
        page.login();
        page.navegar();
        expect(page.ordenarFase()).toBe('OK');
    });
    /*Exportar*/
    it('Cadastros Fase - Exportar', function () {
        page.login();
        page.navegar();
        page.exportar();
        expect(page.verificarDownloads('fases.pdf')).toBe('OK');
    });
});
