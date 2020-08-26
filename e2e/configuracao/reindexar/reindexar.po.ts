import {PrimengInputText} from '../../componentes/primeng-inputtext';
import {browser, by} from 'protractor';
import {PrimengComponent} from '../../componentes/primeng-component';
import {PrimengMenu} from '../../componentes/primeng-menu';
import {PrimengBlockUi} from '../../componentes/primeng-block-ui';
import {PrimengMultiSelect} from '../../componentes/primeng-multiselect';
import {PrimengButton} from '../../componentes/primeng-button';

export class ReindexarPage {

    login() {
        const username = 'admin';
        const password = 'admin';
        PrimengInputText.clearAndFillTextByLocator(by.name('username'), username);
        PrimengInputText.clearAndFillTextByLocator(by.name('password'), password);
        PrimengComponent.clickByLocator(by.css('.ui-button'));
    }
    navegar() {
        PrimengMenu.clickByPath(['Configuração', 'Reindexar']);
        PrimengBlockUi.waitBlockUi(5000);
    }
    selecionarMulti(value: string) {
        PrimengButton.clickByLocator(by.css('.ui-multiselect'));
        PrimengInputText.clearAndFillTextByLocator(by.css('.ui-inputtext'), value);
        PrimengButton.clickByLocator(by.css('.ui-chkbox-box:nth-child(2)'));
        PrimengButton.clickByLocator(by.css('.ui-button-text'));
        browser.wait(browser.findElement(by.css('.footer-text-right > span:nth-child(2)')));
    }
}
