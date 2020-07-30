import {by, ElementFinder, Locator} from 'protractor';
import {PrimengComponent} from './primeng-component';
import {PrimengDropdown} from './primeng-dropdown';

export class PrimengPaginator extends PrimengComponent {
    static selectMaximumShownedByLocator(locator: Locator, maximum: number) {
        this.selectMaximumShownedByElement(this.getElementByLocator(locator), maximum);
    }

    static selectMaximumShownedByElement(elementFinder: ElementFinder, maximum: number) {
        this.waitToBePresentByElement(elementFinder);
        const css = 'p-dropdown';
        PrimengDropdown.selectValueByElement(elementFinder.element(by.css(css)), maximum.toString());
    }

    static clickNextPageByLocator(locator: Locator) {
        this.clickNextPageByElement(this.getElementByLocator(locator));
    }

    static clickNextPageByElement(elementFinder: ElementFinder) {
        const css = 'a.ui-paginator-next';
        this.clickByElement(elementFinder.element(by.css(css)));
    }

    static clickPreviousPageByLocator(locator: Locator) {
        this.clickPreviousPageByElement(this.getElementByLocator(locator));
    }

    static clickPreviousPageByElement(elementFinder: ElementFinder) {
        const css = 'a.ui-paginator-prev';
        this.clickByElement(elementFinder.element(by.css(css)));
    }

    static clickFirstPageByLocator(locator: Locator) {
        this.clickFirstPageByElement(this.getElementByLocator(locator));
    }

    static clickFirstPageByElement(elementFinder: ElementFinder) {
        const css = 'a.ui-paginator-first';
        this.clickByElement(elementFinder.element(by.css(css)));
    }

    static clickLastPageByLocator(locator: Locator) {
        this.clickLastPageByElement(this.getElementByLocator(locator));
    }

    static clickLastPageByElement(elementFinder: ElementFinder) {
        const css = 'a.ui-paginator-last';
        this.clickByElement(elementFinder.element(by.css(css)));
    }

    static clickPageByLocator(locator: Locator, page: number) {
        this.clickPageByElement(this.getElementByLocator(locator), page);
    }

    static clickPageByElement(elementFinder: ElementFinder, page: number) {
        let css: string;
        css = 'a.ui-paginator-page';
        PrimengComponent.clickByElement(elementFinder.element(by.cssContainingText(css, page.toString())));
    }

}

