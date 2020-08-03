import {PrimengComponent} from './primeng-component';
import {by, browser} from 'protractor';

export class PrimengMenu extends PrimengComponent {

    static clickByPath(items: string[]) {
        const css = 'app-menu > ul > li:nth-of-type(1)';
        this.isPresentByLocator(by.css(css)).then(function(result) {
            if (result) {
                for (let i = 0; i < items.length; i++) {
                    PrimengMenu.clickByText(i, items[i]);
                }
            } else {
                browser.get('/');
                PrimengMenu.clickByPath(items);
            }
        });
    }

    static clickByText(level: number, value: string) {
        let css: string;
        css = 'app-menu > ul > li';
        for (let i = 0; i < level; i++) {
            css = css + ' > ul > li';
        }
        css = css + ' > a.ripplelink';
        PrimengComponent.waitToBeVisibleByLocator(by.cssContainingText(css, value));
        PrimengComponent.clickByLocator(by.cssContainingText(css, value));
    }

}
