import {PrimengComponent} from './primeng-component';
import {browser, by} from 'protractor';

export class PrimengBlockUi extends PrimengComponent {

    static waitBlockUi(timeout: number, waitPresence: boolean = false) {
        const css = 'block-ui > block-ui-content > div[class*="active"]';
        if (waitPresence) {
            PrimengComponent.waitToBePresentByLocator(by.css(css));
        }
        this.waitNotToBePresentByLocator(by.css(css), timeout);
    }

}
