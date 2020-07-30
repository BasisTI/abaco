import { browser, ExpectedConditions, by } from 'protractor';
import { PrimengComponent } from './primeng-component';

export class BlockUI extends PrimengComponent {

    static esperarBlockUI(tempoEspera: number, callback: any): any {
        browser.ignoreSynchronization = true;
        const blockui = browser.element(by.css('.block-ui-wrapper'));
        return browser.wait(ExpectedConditions.invisibilityOf(blockui), tempoEspera).then(function () {
            browser.ignoreSynchronization = false;
            return callback();
        });
    }
}
