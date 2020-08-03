import {by, ElementFinder, Locator} from 'protractor';
import {PrimengComponent} from './primeng-component';

export class PrimengBreadcrumbs extends PrimengComponent {

    static isPathByLocator(locator: Locator, path: string[]) {
        return this.isPathByElement(this.getElementByLocator(locator), path);
    }

    static isPathByElement(elementFinder: ElementFinder, path: string[]) {
        let css: string;
        let text: string;
        const promises = [];
        text = 'home';
        css = 'div.layout-breadcrumb > ul > li:nth-of-type(1) > a > i.material-icons';
        promises.push(PrimengComponent.isPresentByElement(elementFinder.element(by.cssContainingText(css, text))));
        text = '/ Você está aqui >>';
        css = 'div.layout-breadcrumb > ul > li:nth-of-type(2)';
        promises.push(PrimengComponent.isPresentByElement(elementFinder.element(by.cssContainingText(css, text))));
        for (let i = 0; i < path.length; i++) {
            css = `div.layout-breadcrumb > ul > li:nth-of-type(${3 + i * 2})`;
            promises.push(PrimengComponent.isPresentByElement(elementFinder.element(by.cssContainingText(css, path[i]))));
            if (i < (path.length - 1)) {
                text = '>>';
                css = `div.layout-breadcrumb > ul > li:nth-of-type(${4 + i * 2})`;
                promises.push(PrimengComponent.isPresentByElement(elementFinder.element(by.cssContainingText(css, text))));
            }
        }
        return Promise.all(promises).then(results => {
            return results.every(item => item === true);
        });
    }

}
