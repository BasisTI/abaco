import {PrimengComponent} from './primeng-component';
import {browser, by, ElementFinder, Locator, protractor} from 'protractor';

export class PrimengDropdown extends PrimengComponent {

    private static openByLocator(locator: Locator) {
        this.openByElement(this.getElementByLocator(locator));
    }

    private static openByElement(elementFinder: ElementFinder) {
        let css: string;
        this.waitToBeClickableByElement(elementFinder);
        css = 'span.ui-dropdown-trigger-icon';
        this.clickByElement(elementFinder.element(by.css(css)));
    }

    private static selectByLocator(locator: Locator, value: string) {
        this.selectByElement(this.getElementByLocator(locator), value);
    }

    private static selectByElement(elementFinder: ElementFinder, value: string) {
        let css: string;
        css = 'div > div > div > ul > li > span';
        elementFinder.all(by.css(css)).then(results => {
            if (results.length > 0) {
                css = 'div > div > div > ul > li > span';
                this.waitToBeClickableByElement(elementFinder.element(by.cssContainingText(css, value)));
                this.clickByElement(elementFinder.element(by.cssContainingText(css, value)));
                css = 'div.ui-dropdown-open';
                this.waitNotToBePresentByElement(elementFinder.element(by.css(css)));
            } else {
                css = 'div.ui-dropdown-panel ul > li > span';
                this.waitToBeClickableByLocator(by.cssContainingText(css, value));
                this.clickByLocator(by.cssContainingText(css, value));
                this.waitNotToBePresentByLocator(by.cssContainingText(css, value));
            }
        });
    }

    private static clearByLocator(locator: Locator) {
        this.clickByElement(this.getElementByLocator(locator));
    }

    private static clearByElement(elementFinder: ElementFinder) {
        let css: string;
        css = 'div > div > div > ul > li > span';
        elementFinder.all(by.css(css)).then(results => {
            if (results.length > 0) {
                css = 'li.ui-dropdown-item-empty';
                this.waitToBeClickableByElement(elementFinder.element(by.css(css)));
                this.clickByElement(elementFinder.element(by.css(css)));
                this.waitNotToBePresentByElement(elementFinder.element(by.css(css)));
            } else {
                css = 'div.ui-dropdown-panel ul > li.ui-dropdown-item-empty';
                this.waitToBeClickableByLocator(by.css(css));
                this.clickByLocator(by.css(css));
                this.waitNotToBePresentByLocator(by.css(css));
            }
        });
    }

    static selectValueByLocator(locator: Locator, value: string) {
        this.selectValueByElement(this.getElementByLocator(locator), value);
    }

    static selectValueByElement(elementFinder: ElementFinder, value: string) {
        this.openByElement(elementFinder);
        this.selectByElement(elementFinder, value);
    }

    static clearValueByLocator(locator: Locator) {
        this.clearValueByElement(this.getElementByLocator(locator));
    }

    static clearValueByElement(elementFinder: ElementFinder) {
        const promises = [];
        let css: string;
        css = 'div > label.ui-dropdown-label-empty, div > label.ui-placeholder';
        promises.push(this.isPresentByElement(elementFinder.element(by.css(css))));
        Promise.all(promises).then(results => {
            switch (false) {
                case results[0]:
                    this.openByElement(elementFinder);
                    this.clearByElement(elementFinder);
                    break;
                default:
                    break;
            }
        });
        css = 'div > label.ui-dropdown-label-empty, div > label.ui-placeholder';
        this.waitToBePresentByElement(elementFinder.element(by.css(css)));
    }

    static isClearByLocator(locator: Locator) {
        return this.isClearByElement(this.getElementByLocator(locator));
    }

    static isClearByElement(elementFinder: ElementFinder) {
        const promises = [];
        let css: string;

        this.waitToBePresentByElement(elementFinder);
        css = 'div > label.ui-dropdown-label-empty';
        promises.push(this.isPresentByElement(elementFinder.element(by.css(css))));
        css = 'div > label.ui-placeholder';
        promises.push(this.isPresentByElement(elementFinder.element(by.css(css))));
        return Promise.all(promises).then(resultados => {
            if (resultados[0] || resultados[1]) {
                return true;
            }
            return false;
        });
    }

    static isOptionsByLocator(locator: Locator, value: string[]) {
        return this.isOptionsByElement(this.getElementByLocator(locator), value);
    }

    static isOptionsByElement(elementFinder: ElementFinder, values: string[]) {
        let css: string;
        const promises = [];

        this.waitToBeClickableByElement(elementFinder);
        this.clickByElement(elementFinder);
        css = 'div > div > div > ul > li > span';
        this.waitToBePresentByElement(elementFinder.element(by.cssContainingText(css, values[0])));
        values.forEach(value => {
            promises.push(PrimengComponent.isPresentByElement(elementFinder.element(by.cssContainingText(css, value))));
        });
        return Promise.all(promises).then(resultados => {
            for (const i in resultados) {
                if (!resultados[i]) {
                    browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
                    return false;
                }
            }
            browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
            return true;
        });
    }

    static isValueByLocator(locator: Locator, value: string) {
        return this.isValueByElement(this.getElementByLocator(locator), value);
    }

    static isValueByElement(elementFinder: ElementFinder, value: string) {
        let css: string;
        css = 'label';
        this.waitToBePresentByElement(elementFinder.element(by.css(css)));
        return elementFinder.element(by.css(css)).getText().then(text => {
            return text === value;
        });
    }

    static isErrorMessageByLocator(locator: Locator, message: string) {
        return this.isErrorMessageByElement(this.getElementByLocator(locator), message);
    }

    static isErrorMessageByElement(elementFinder: ElementFinder, message: string) {
        let xpath: string;
        xpath = './following-sibling::span/div[contains(@class,"ui-messages-error")][1]';
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
