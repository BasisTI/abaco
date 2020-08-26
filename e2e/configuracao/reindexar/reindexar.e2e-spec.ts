import {browser, by} from 'protractor';
import {ReindexarPage} from './reindexar.po';

describe('Abaco - Reindexar', function() {
    let page: ReindexarPage;

    beforeAll(() => {
        page = new ReindexarPage();
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
    it('Reindexar - Reindex uma opção', function () {
        page.login();
        page.navegar();
        page.selecionarMulti('Analise');
        expect(browser.findElement(by.css('.footer-text-right > span:nth-child(2)'))
            .getText()).toContain('Todos os direitos reservados');
    });
    it('Reindexar - Reindex todas as opções', function () {
        page.login();
        page.navegar();
        page.selecionarMulti('');
        expect(browser.findElement(by.css('.footer-text-right > span:nth-child(2)'))
            .getText()).toContain('Todos os direitos reservados');
    });
});
