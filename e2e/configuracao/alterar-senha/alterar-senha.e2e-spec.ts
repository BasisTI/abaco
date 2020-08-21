import {browser} from 'protractor';
import {AlterarSenhaPage} from './alterar-senha.po';

describe('Abaco - Alterar Senha', function() {
    let page: AlterarSenhaPage;

    beforeAll(() => {
        page = new AlterarSenhaPage();
        browser.driver.manage().window().maximize();
        browser.get('/');
    });

    beforeEach(function () {
        browser.get('/');
    });

    afterEach(function () {
    });

    afterAll(function () {
    });
    it('Alterar Senha - Senha Atual Incorreta', function () {
        page.login();
        page.navegar();
        page.preencherSenhaInvalida();
        expect(page.verificarSenha('Senha atual incorreta!')).toBe('OK');
    });
    it('Alterar Senha - Senha Confirmação Incorreta', function () {
        page.login();
        page.navegar();
        page.preencherSenhaConfirmacaoInvalida();
        expect(page.verificarSenha('Nova senha não confere com a confirmação!')).toBe('OK');
    });
    it('Alterar Senha - Alterar com sucesso', function () {
        page.login();
        page.navegar();
        page.preencherSenha();
        expect(page.verificarSenha('msgSenhaAlteradaComSucessoParaUsuarioadmin')).toBe('OK');
        // expect(page.verificarSenha('Senha alterada com sucesso para o usuário admin!')).toBe('OK');
    });
});
