import {PrimengComponent} from './primeng-component';
import {by, ElementFinder, Locator} from 'protractor';

export class PrimengFileUpload extends PrimengComponent {

    static inputFileByLocator(locator: Locator, file: string, filePath: string, id: string) {
        this.inputFileByElement(this.getElementByLocator(locator), file, filePath, id);
    }

    static inputFileByElement(elementFinder: ElementFinder, file: string, filePath: string, id: string) {
        const path = require('path');
        const absolutePath = path.resolve(__dirname, filePath, file);
        elementFinder.element(by.css('input[type="file"]')).sendKeys(absolutePath);
        this.clickByLocator(by.id(id));
    }

}
