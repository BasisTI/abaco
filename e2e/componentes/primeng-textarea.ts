import {PrimengComponent} from './primeng-component';
import {ElementFinder, Locator, protractor} from 'protractor';

export class PrimengTextArea extends PrimengComponent {

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
        elementFinder.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
        elementFinder.sendKeys(protractor.Key.DELETE);
    }

    static fillTextByLocator(locator: Locator, value: string) {
        this.fillTextByElement(this.getElementByLocator(locator), value);
    }

    static fillTextByElement(elementFinder: ElementFinder, value: string) {
        this.scrollToByElement(elementFinder);
        elementFinder.sendKeys(value);
    }

    static isValueByLocator(locator: Locator, value: string) {
        return this.isValueByElement(this.getElementByLocator(locator), value);
    }

    static isValueByElement(elementFinder: ElementFinder, value: string) {
        this.waitToBePresentByElement(elementFinder);
        return elementFinder.getAttribute('value').then(text => {
            return text === value;
        });
    }

}
