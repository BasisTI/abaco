import {PrimengComponent} from './primeng-component';
import {Locator, ElementFinder, by} from 'protractor';

export class PrimengCheckbox extends PrimengComponent {

    static checkByLocator(locator: Locator, value: boolean) {
        this.checkByElement(this.getElementByLocator(locator), value);
    }

    static checkByElement(elementFinder: ElementFinder, value: boolean) {
        let css: string;
        css = 'div.ui-state-active';
        this.waitToBeClickableByElement(elementFinder);
        this.isPresentByElement(elementFinder.element(by.css(css))).then(presence => {
            if (presence !== value) {
                this.clickByElement(elementFinder);
            }
        });
    }

    static isCheckedByLocator(locator: Locator) {
        return this.isCheckedByElement(this.getElementByLocator(locator));
    }

    static isCheckedByElement(elementFinder: ElementFinder) {
        let css: string;
        css = 'div.ui-state-active';
        this.waitToBePresentByElement(elementFinder);
        return this.isPresentByElement(elementFinder.element(by.css(css)));
    }

}
