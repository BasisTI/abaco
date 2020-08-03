import {browser, by, ElementFinder, Locator, protractor} from 'protractor';

export class PrimengComponent {

    static getElementByLocator(locator: Locator) {
        return browser.element(locator);
    }

    static getElementsByLocator(locator: Locator) {
        return browser.element.all(locator);
    }

    static isPresentByLocator(locator: Locator) {
        return this.isPresentByElement(this.getElementByLocator(locator));
    }

    static isPresentByElement(elementFinder: ElementFinder) {
        return elementFinder.isPresent().then(result => {
            if (result) {
                this.scrollToByElement(elementFinder);
                return true;
            } else {
                return false;
            }
        });
    }

    static isDisplayedByLocator(locator: Locator) {
        return this.isDisplayedByElement(this.getElementByLocator(locator));
    }

    static isDisplayedByElement(elementFinder: ElementFinder) {
        return elementFinder.isDisplayed().then(result => {
            if (result) {
                this.scrollToByElement(elementFinder);
                return true;
            } else {
                return false;
            }
        });
    }

    static clickByLocator(locator: Locator, stop: boolean = true) {
        this.clickByElement(this.getElementByLocator(locator), stop);
    }

    static clickByElement(elementFinder: ElementFinder, stop: boolean = true) {
        this.scrollToByElement(elementFinder, stop);
        elementFinder.click().then(() => {}, error => {
            if (stop) {
                throw error;
            } else {
                return false;
            }
        });
    }

    static waitToBePresentByLocator(locator: Locator, timeout = 5000, stop: boolean = true) {
        return this.waitToBePresentByElement(this.getElementByLocator(locator), timeout, stop);
    }

    static waitToBePresentByElement(elementFinder: ElementFinder, timeout: number = 5000, stop: boolean = true) {
        const conditions = protractor.ExpectedConditions;
        const message = `Element ${elementFinder.locator().toString()} still not present.`;
        return browser.wait(conditions.presenceOf(elementFinder), timeout, message).catch(error => {
            if (stop) {
                throw error;
            } else {
                return false;
            }
        });
    }

    static waitNotToBePresentByLocator(locator: Locator, timeout: number = 5000, stop: boolean = true) {
        return this.waitNotToBePresentByElement(this.getElementByLocator(locator), timeout, stop);
    }

    static waitNotToBePresentByElement(elementFinder: ElementFinder, timeout: number = 5000, stop: boolean = true) {
        const conditions = protractor.ExpectedConditions;
        const message = `Element ${elementFinder.locator().toString()} still present.`;
        return browser.wait(conditions.not(conditions.presenceOf(elementFinder)), timeout, message).catch(error => {
            if (stop) {
                throw error;
            } else {
                return false;
            }
        });
    }

    static waitToBeVisibleByLocator(locator: Locator, timeout: number = 5000, stop: boolean = true) {
        return this.waitToBeVisibleByElement(this.getElementByLocator(locator), timeout, stop);
    }

    static waitToBeVisibleByElement(elementFinder: ElementFinder, timeout: number = 5000, stop: boolean = true) {
        const conditions = protractor.ExpectedConditions;
        const message = `Element ${elementFinder.locator().toString()} still not visible.`;
        return browser.wait(conditions.visibilityOf(elementFinder), timeout, message).catch(error => {
            if (stop) {
                throw error;
            } else {
                return false;
            }
        });
    }

    static waitNotToBeVisibleByLocator(locator: Locator, timeout: number = 5000, stop: boolean = true) {
        return this.waitNotToBeVisibleByElement(this.getElementByLocator(locator), timeout, stop);
    }

    static waitNotToBeVisibleByElement(elementFinder: ElementFinder, timeout: number = 5000, stop: boolean = true) {
        const conditions = protractor.ExpectedConditions;
        const message = `Element ${elementFinder.locator().toString()} still visible.`;
        return browser.wait(conditions.invisibilityOf(elementFinder), timeout, message).catch(error => {
            if (stop) {
                throw error;
            } else {
                return false;
            }
        });
    }

    static waitToBeClickableByLocator(locator: Locator, timeout: number = 5000, stop: boolean = true) {
        return this.waitToBeClickableByElement(this.getElementByLocator(locator), timeout, stop);
    }

    static waitToBeClickableByElement(elementFinder: ElementFinder, timeout: number = 5000, stop: boolean = true) {
        const conditions = protractor.ExpectedConditions;
        const message = `Element ${elementFinder.locator().toString()} still not clickable.`;
        return browser.wait(conditions.elementToBeClickable(elementFinder), timeout, message).catch(error => {
            if (stop) {
                throw error;
            } else {
                return false;
            }
        });
    }

    static scrollToByLocator(locator: Locator, stop: boolean = true) {
        this.scrollToByElement(this.getElementByLocator(locator));
    }

    static scrollToByElement(elementFinder: ElementFinder, stop: boolean = true) {
        this.waitToBePresentByElement(elementFinder).catch(error => {
            if (stop) {
                throw error;
            } else {
                return false;
            }
        });
        browser.executeScript('arguments[0].scrollIntoView({block: "center", inline: "center"});', elementFinder).then(() => {}, error => {
            if (stop) {
                throw error;
            } else {
                return false;
            }
        });
    }

    static regex(text: string, trim: boolean = false) {
        if (trim) {
            return new RegExp(`^[\\s]*${text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}[\\s]*$`);
        } else {
            return new RegExp(`^${text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}$`);
        }
    }

    static isDisabledByLocator(locator: Locator) {
        return this.isDisabledByElement(this.getElementByLocator(locator));
    }

    static isDisabledByElement(elementFinder: ElementFinder) {
        return elementFinder.getAttribute('disabled').then(disabled => {
            this.scrollToByElement(elementFinder);
            if (disabled === 'true') {
                return true;
            } else {
                return elementFinder.getAttribute('ng-reflect-disabled').then(reflect => {
                    if (reflect === 'true') {
                        return true;
                    } else {
                        return false;
                    }
                });
            }
        });
    }


    static isErrorMessage(css: string, mensagem: string) {
        return expect(browser.findElement(by.css(css))
            .getText()).toContain(mensagem);
    }

    static isErrorMessage2(css: string, mensagem: string) {
        return expect(browser.findElement(by.xpath(css))
            .getText()).toContain(mensagem);
    }

}
