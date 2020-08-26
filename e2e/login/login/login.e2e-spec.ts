
import {browser, by} from 'protractor';
import {LoginPage} from './login.po';

describe('Abaco - Login Abaco', function() {
    let page: LoginPage;
    beforeAll(() => {
        page = new LoginPage();
        browser.driver.manage().window().maximize();
        browser.get('/');
    });

    beforeEach(function () {
        browser.get('/');
    });

    it('Login Abaco - Campo Obrigatório', function () {
        expect(page.verificarPreenchimentoObrigatório()).toBe('OK');
    });

    it('Login Abaco - Senha Invalida', function () {
        page.login('admin', 'asd');
        expect(page.verificarMensagem('A senha precisa ter no mínimo 4 caracteres!')).toBe('OK');
    });

    it('Login Abaco - Senha Errada', function () {
        page.login('admin', 'asddd');
        expect(page.verificarMensagem('Usuário ou senha inválidos!')).toBe('OK');
    });

    it('Login Abaco - Usuário Errado', function () {
        page.login('ad', 'admin');
        expect(page.verificarMensagem('Usuário ou senha inválidos!')).toBe('OK');
    });

    it('Login Abaco - Login com Sucesso', function () {
        page.login('admin', 'admin');
        expect(browser.findElement(by.css('.footer-text-right > span:nth-child(2)'))
            .getText()).toContain('Todos os direitos reservados');
    });
});
