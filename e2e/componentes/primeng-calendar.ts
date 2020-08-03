import {PrimengComponent} from './primeng-component';
import {by, ElementFinder, Locator, protractor} from 'protractor';
import {PrimengInputText} from './primeng-inputtext';


export class PrimengCalendar extends PrimengComponent {

    static clearAndFillDateByLocator(locator: Locator, date: Date) {
        this.clearAndFillDateByElement(this.getElementByLocator(locator), date);
    }

    static clearAndFillDateByElement(elementFinder: ElementFinder, date: Date) {
        this.clearFieldByElement(elementFinder);
        this.fillDateByElement(elementFinder, date);
    }

    static fillDateByLocator(locator: Locator, date: Date) {
        this.fillDateByElement(this.getElementByLocator(locator), date);
    }

    static fillDateByElement(elementFinder: ElementFinder, date: Date) {
        let css: string;
        let text: string;

        css = 'input';
        text = `${(date.getDate() < 9 ? '0' : '')}${date.getDate()}`
            + `/${(date.getMonth() < 9 ? '0' : '')}${date.getMonth() + 1}`
            + `/${date.getFullYear()}`;
        PrimengInputText.fillTextByElement(elementFinder.element(by.css(css)), text);
    }

    static clearFieldByLocator(locator: Locator) {
        this.clearFieldByElement(this.getElementByLocator(locator));
    }

    static clearFieldByElement(elementFinder: ElementFinder) {
        let css: string;

        css = 'input';
        for (let i = 0; i < 4; i++) {
            elementFinder.element(by.css(css)).sendKeys(protractor.Key.BACK_SPACE);
        }
        this.closeByElement(elementFinder);
    }

    static openByElement(elementFinder: ElementFinder) {
        const css = 'button';
        this.clickByElement(elementFinder.element(by.css(css)));
    }

    static closeByElement(elementFinder: ElementFinder) {
        const css = 'button';
        this.clickByElement(elementFinder.element(by.css(css)));
    }

    static pickDateByLocator(locator: Locator, date: Date) {
        this.pickDateByElement(this.getElementByLocator(locator), date);
    }

    static pickDateByElement(elementFinder: ElementFinder, date: Date) {
        let css: string;
        let current: Date;
        let delta: Date;
        let months: number;

        this.openByElement(elementFinder);
        css = 'input';
        this.waitToBePresentByElement(elementFinder.element(by.css(css)));
        elementFinder.element(by.css(css)).getAttribute('value').then(result => {
            current = new Date(Number(result.slice(6, 10)), (Number(result.slice(3, 5)) - 1), Number(result.slice(0, 2)));
            if (current.getFullYear() === 1899) {
                current = new Date(Date.now());
            }
            if (date.getTime() > current.getTime()) {
                delta = new Date(date.getTime() - current.getTime());
                css = 'a.ui-datepicker-next';
                months = (delta.getFullYear() - 1970) * 12 + (delta.getMonth());
                for (let i = 0; i < months; i++) {
                    PrimengComponent.clickByElement(elementFinder.element(by.css(css)));
                }
            } else {
                delta = new Date(current.getTime() - date.getTime());
                css = 'a.ui-datepicker-prev';
                months = (delta.getFullYear() - 1970) * 12 + (delta.getMonth() + 1);
                for (let i = 0; i < months; i++) {
                    PrimengComponent.clickByElement(elementFinder.element(by.css(css)));
                }
            }
            css = 'table > tbody > tr > td:not(.ui-state-disabled) > a';
            PrimengComponent.clickByElement(elementFinder.all(by.cssContainingText(css, date.getDate().toString())).first());
        });
        css = 'div.ui-datepicker[style*="display: block;"]';
        this.waitNotToBePresentByElement(elementFinder.element(by.css(css)), 30000);
    }

}
