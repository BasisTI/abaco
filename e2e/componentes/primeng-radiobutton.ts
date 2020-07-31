import {PrimengComponent} from './primeng-component';
import {by, ElementFinder, Locator} from 'protractor';

export class PrimengRadioButton extends PrimengComponent {

    static clickByLocator(locator: Locator) {
        this.clickByElement(this.getElementByLocator(locator));
    }

    static clickByElement(elementFinder: ElementFinder) {
        let css: string;
        css = 'div.ui-radiobutton-box';
        PrimengComponent.clickByElement(elementFinder.element(by.css(css)));
    }

    static isCheckedByLocator(locator: Locator) {
        return this.isCheckedByElement(this.getElementByLocator(locator));
    }

    static isCheckedByElement(elementFinder: ElementFinder) {
        let css: string;
        css = 'div.ui-radiobutton-box.ui-state-active';
        return PrimengComponent.isPresentByElement(elementFinder.element(by.css(css)));
    }

}
