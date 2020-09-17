import {PrimengComponent} from './primeng-component';
import {by, ElementFinder, Locator} from 'protractor';
import {PrimengBlockUi} from './primeng-block-ui';

export class PrimengMultiSelect extends PrimengComponent {

    static openByLocator(locator: Locator) {
        this.openByElement(this.getElementByLocator(locator));
    }

    static openByElement(elementFinder: ElementFinder) {
        let css: string;
        css = 'div.ui-multiselect-trigger';
        this.waitToBePresentByElement(elementFinder.element(by.css(css)));
        this.clickByElement(elementFinder.element(by.css(css)));
    }

    static closeByLocator(locator: Locator) {
        this.closeByElement(this.getElementByLocator(locator));
    }

    static closeByElement(elementFinder: ElementFinder) {
        let css: string;
        css = 'div.ui-multiselect-trigger';
        this.waitToBePresentByElement(elementFinder.element(by.css(css)));
        this.clickByElement(elementFinder.element(by.css(css)));
        css = 'div.ui-multiselect-panel[style*="display: block;"]';
        this.waitNotToBePresentByElement(elementFinder.element(by.css(css)));
    }

    static clearByLocator(locator: Locator) {
        this.clearByElement(this.getElementByLocator(locator));
    }

    static clearByElement(elementFinder: ElementFinder) {
        let css: string;

        css = 'div.ui-multiselect-items-wrapper ul > li div.ui-chkbox-box.ui-state-active';
        elementFinder.all(by.css(css)).then(actives => {
            if (actives.length > 0) {
                css = 'div.ui-multiselect-header div:not(.ui-state-active).ui-chkbox-box';
                elementFinder.all(by.css(css)).then(headers => {
                    css = 'div.ui-multiselect-header div.ui-chkbox-box';
                    this.waitToBeClickableByElement(elementFinder.element(by.css(css)));
                    if (headers.length > 0) {
                        this.clickByElement(elementFinder.element(by.css(css)));
                        PrimengBlockUi.waitBlockUi(30000);
                        this.clickByElement(elementFinder.element(by.css(css)));
                        PrimengBlockUi.waitBlockUi(30000);
                    } else {
                        this.clickByElement(elementFinder.element(by.css(css)));
                        PrimengBlockUi.waitBlockUi(30000);
                    }
                });
            }
        });
    }

    static selectByLocator(locator: Locator, values: string[]) {
        this.selectByElement(this.getElementByLocator(locator), values);
    }

    static selectByElement(elementFinder: ElementFinder, values: string[]) {
        let css: string;
        css = 'li > span';
        values.forEach(value => {
            // const regex = this.regex(value);
            this.waitToBeClickableByElement(elementFinder.element(by.cssContainingText(css, value)));
            this.clickByElement(elementFinder.element(by.cssContainingText(css, value)));
            PrimengBlockUi.waitBlockUi(30000);
        });
    }

    static selectValuesByLocator(locator: Locator, values: string[]) {
        this.selectValuesByElement(this.getElementByLocator(locator), values);
    }

    static selectValuesByElement(elementFinder: ElementFinder, values: string[]) {
        this.openByElement(elementFinder);
        this.selectByElement(elementFinder, values);
        this.closeByElement(elementFinder);
    }

    static clearValuesByLocator(locator: Locator) {
        this.clearValuesByElement(this.getElementByLocator(locator));
    }

    static clearValuesByElement(elementFinder: ElementFinder) {
        this.openByElement(elementFinder);
        this.clearByElement(elementFinder);
        this.closeByElement(elementFinder);
    }

    static clearAndSelectValuesByLocator(locator: Locator, values: string[]) {
        this.clearAndSelectValuesByElement(this.getElementByLocator(locator), values);
    }

    static clearAndSelectValuesByElement(elementFinder: ElementFinder, values: string[]) {
        this.openByElement(elementFinder);
        this.clearByElement(elementFinder);
        this.selectByElement(elementFinder, values);
        this.closeByElement(elementFinder);
    }

    static isErrorMessageByLocator(locator: Locator, message: string) {
        return this.isErrorMessageByElement(this.getElementByLocator(locator), message);
    }

    static isErrorMessageByElement(elementFinder: ElementFinder, message: string) {
        let xpath: string;
        xpath = './following-sibling::span[1]/div[contains(@class,"ui-messages-error")]';
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
