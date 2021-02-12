import {PrimengComponent} from './primeng-component';
import {by} from 'protractor';

export class PrimengGrowl extends PrimengComponent {

    static getWarningMessage() {
        const css = 'ui-toast-message';
        this.waitToBePresentByLocator(by.css(css));
        return this.getElementByLocator(by.css(css)).getText();
    }

    static isWarningMessage(text: string, timeout: number = 10000) {
        const css = '.ui-toast-message-content';
        this.waitToBePresentByLocator(by.cssContainingText(css, text), timeout, true);
        return this.isPresentByLocator(by.cssContainingText(css, text));
    }

    static closeWarningMessage(timeout: number = 10000) {
        const css = '.ui-toast-close-icon';
        this.waitToBeClickableByLocator(by.css(css), timeout, false);
        this.clickByLocator(by.css(css), false);
        this.waitNotToBePresentByLocator(by.css(css));
    }

}
