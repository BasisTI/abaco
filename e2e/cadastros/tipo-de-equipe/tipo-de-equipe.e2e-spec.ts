import {browser} from 'protractor';
import {TipoDeEquipePage} from './tipo-de-equipe.po';

describe('Abaco - Cadastros Tipo de Equipe', function() {
    let page: TipoDeEquipePage;
    beforeAll(() => {
        page = new TipoDeEquipePage();
        browser.driver.manage().window().maximize();
        browser.get('/');
    });
    beforeEach(function () {
        browser.get('/');
    });

    it('Cadastros Equipe - Cadastrar Equipe com sucesso', function () {
        page.login();
        page.navegar();
        page.cadastrarNovasEquipes();
        expect(page.verificarMensagemInclusão('Registro incluído com sucesso!')).toBe('OK');
    }, 90000);

    it('Cadastros Equipe - Cadastrar Equipe Campos Obrigatórios', function () {
        page.login();
        page.navegar();
        page.clicarBotao('Novo');
        expect(page.cadastrarEquipeCamposObrigatorios()).toBe('OK');
    }, 10000);

    it('Cadastros Equipe - Cadastrar Equipe em Duplicidade', function () {
        page.login();
        page.navegar();
        page.clicarBotao('Novo');
        page.cadastrarEquipeDuplicidade();
        expect(page.verificarMensagem('Já existe um Tipo de Equipe registrado com este nome!')).toBe('OK');
    });

    it('Cadastros Equipe - Editar Equipe com Sucesso', function () {
        page.login();
        page.navegar();
        page.selecionarLinhaEditar('Testes - Equipe');
        page.cadastrarEquipeEditar();
        expect(page.verificarMensagem('Registro alterado com sucesso!')).toBe('OK');
    });

    it('Cadastros Equipe - Editar Equipe com Duplicidade', function () {
        page.login();
        page.navegar();
        page.selecionarLinhaEditar('Equipe 21');
        page.cadastrarEquipeEditarDuplicidade();
        expect(page.verificarMensagem('Já existe um Tipo de Equipe registrado com este nome!')).toBe('OK');
    });

    it('Cadastros Equipe - Excluir Equipe', function () {
        page.login();
        page.navegar();
        page.selecionarLinhaExcluir('Equipe 21');
        expect(page.verificarMensagem('Registro excluído com sucesso!')).toBe('OK');
    });

    it('Cadastros Equipe - Filtrar por "Equipe"', function () {
        page.login();
        page.navegar();
        page.filtrarEquipe('Fabrica de Métricas - Cliente');
        expect(page.verificarFiltrarEquipe('Fabrica de Métricas - Cliente')).toBe('OK');
    });

    it('Cadastros Equipe - Ordenar "Equipe"', function () {
        page.login();
        page.navegar();
        expect(page.ordenarEquipe()).toBe('OK');
    });
});
