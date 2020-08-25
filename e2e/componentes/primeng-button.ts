import { PrimengComponent } from './primeng-component';
import {by, ElementFinder, Locator} from 'protractor';
import {PrimengBlockUi} from './primeng-block-ui';

export class PrimengButton extends PrimengComponent {

    static clickByLocator(locator: Locator) {
        this.clickByElement(this.getElementByLocator(locator));
    }

    static clickByElement(elementFinder: ElementFinder) {
        PrimengBlockUi.waitBlockUi(20000);
        this.waitToBePresentByElement(elementFinder);
        this.waitToBeClickableByElement(elementFinder);
        PrimengComponent.clickByElement(elementFinder);
    }

    static clickByText(text: string) {
        const css = 'button > span';
        this.clickByLocator(by.cssContainingText(css, text));
    }

    static clickByTitle(text: string) {
        const css = `basis-datatable-button[ng-reflect-b-tooltip="${text}"]`;
        this.clickByLocator(by.css(css));
    }

}
