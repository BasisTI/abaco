import {browser, by, ElementFinder, protractor} from 'protractor';

import {PrimengComponent} from './primeng-component';
import {PrimengBlockUi} from './primeng-block-ui';
import {Locator} from 'protractor/built/locators';

export class PrimengInputText extends PrimengComponent {

    static clearAndFillTextByLocator(locator: Locator, value: string) {
        this.clearAndFillTextByElement(this.getElementByLocator(locator), value);
    }

    static clearAndFillTextByElement(elementFinder: ElementFinder, value: string) {
        if (value === '') {
            // Search fields bug workaround
            this.scrollToByElement(elementFinder);
            elementFinder.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
            elementFinder.sendKeys(protractor.Key.DELETE);
        } else {
            this.clearFieldByElement(elementFinder);
            this.fillTextByElement(elementFinder, value);
        }
    }

    static clearFieldByLocator(locator: Locator) {
        this.clearFieldByElement(this.getElementByLocator(locator));
    }

    static clearFieldByElement(elementFinder: ElementFinder) {
        PrimengBlockUi.waitBlockUi(30000);
        this.waitToBeClickableByElement(elementFinder);
        this.scrollToByElement(elementFinder);
        elementFinder.clear();
    }

    static fillTextByLocator(locator: Locator, value: string) {
        this.fillTextByElement(this.getElementByLocator(locator), value);
    }

    static fillTextByElement(elementFinder: ElementFinder, value: string) {
        PrimengBlockUi.waitBlockUi(30000);
        this.waitToBeClickableByElement(elementFinder);
        this.scrollToByElement(elementFinder);
        elementFinder.sendKeys(value);
    }

    static isValueByLocator(locator: Locator, value: string) {
        return this.isValueByElement(this.getElementByLocator(locator), value);
    }

    static isValueByElement(elementFinder: ElementFinder, value: string) {
        this.waitToBePresentByElement(elementFinder);
        this.scrollToByElement(elementFinder);
        return elementFinder.getAttribute('value').then(text => {
            return text === value;
        });

    }

    static isErrorMessageByLocator(locator: Locator, message: string) {
        return this.isErrorMessageByElement(this.getElementByLocator(locator), message);
    }

    static isErrorMessageByElement(elementFinder: ElementFinder, message: string) {
        let xpath: string;
        xpath = '.ui-g-6 .ui-message';
        return elementFinder.element(by.css(xpath)).isPresent().then(presence => {
            if (presence) {
                return elementFinder.element(by.css(xpath)).getText().then(text => {
                    return text === message;
                });
            } else {
                return false;
            }
        });
    }

}
