import { PrimengComponent } from './primeng-component';
import {by, ElementFinder, Locator} from 'protractor';
import {PrimengInputText} from './primeng-inputtext';
import {PrimengBlockUi} from './primeng-block-ui';

export class PrimengInputMask extends PrimengComponent {

    static clearAndFillTextByLocator(locator: Locator, value: string) {
        this.clearAndFillTextByElement(this.getElementByLocator(locator), value);
    }

    static clearAndFillTextByElement(elementFinder: ElementFinder, value: string) {
        this.clearFieldByElement(elementFinder);
        this.fillTextByElement(elementFinder, value);
    }

    static clearFieldByLocator(locator: Locator) {
        this.clearFieldByElement(this.getElementByLocator(locator));
    }

    static clearFieldByElement(elementFinder: ElementFinder) {
        let css: string;
        PrimengBlockUi.waitBlockUi(30000);
        this.waitToBeClickableByElement(elementFinder);
        css = 'input';
        this.clickByElement(elementFinder.element(by.css(css)));
        PrimengInputText.clearFieldByElement(elementFinder.element(by.css(css)));
    }

    static fillTextByLocator(locator: Locator, value: string) {
        this.fillTextByElement(this.getElementByLocator(locator), value);
    }

    static fillTextByElement(elementFinder: ElementFinder, value: string) {
        let css: string;
        PrimengBlockUi.waitBlockUi(30000);
        this.waitToBeClickableByElement(elementFinder);
        css = 'input';
        this.clickByElement(elementFinder.element(by.css(css)));
        elementFinder.element(by.css(css)).sendKeys(value);
    }

    static isValueByLocator(locator: Locator, value: string) {
        return this.isValueByElement(this.getElementByLocator(locator), value);
    }

    static isValueByElement(elementFinder: ElementFinder, value: string) {
        let css: string;
        css = 'input';
        this.waitToBePresentByElement(elementFinder.element(by.css(css)));
        return elementFinder.element(by.css(css)).getAttribute('value').then(text => {
            return text === value;
        });
    }

    static isErrorMessageByLocator(locator: Locator, message: string) {
        return this.isErrorMessageByElement(this.getElementByLocator(locator), message);
    }

    static isErrorMessageByElement(elementFinder: ElementFinder, message: string) {
        let xpath: string;
        xpath = './following-sibling::div[contains(@class,"ui-messages-error")][1]';
        return elementFinder.element(by.xpath(xpath)).isPresent().then(presence => {
            if (presence) {
                return elementFinder.element(by.xpath(xpath)).getText().then(text => {
                    return text === message;
                });
            } else {
                return false;
            }
        });
    }

}
