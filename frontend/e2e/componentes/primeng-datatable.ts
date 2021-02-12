import {browser, by, ElementFinder, Locator, protractor} from 'protractor';
import {PrimengDropdown} from './primeng-dropdown';
import {PrimengComponent} from './primeng-component';
import {PrimengInputText} from './primeng-inputtext';
import {PrimengInputMask} from './primeng-inputmask';
import {PrimengCheckbox} from './primeng-checkbox';
import {PrimengBlockUi} from './primeng-block-ui';
import {PrimengButton} from './primeng-button';

export class PrimengDataTable extends PrimengComponent {

    static isHeaderTextsByLocator(locator: Locator, texts: string[], trim: boolean = false) {
        return this.isHeaderTextsByElement(this.getElementByLocator(locator), texts, trim);
    }

    static isHeaderTextsByElement(elementFinder: ElementFinder, texts: string[], trim: boolean = false) {
        let css: string;
        const promises = [];
        for (let i = 0; i < texts.length; i++) {
            if (texts[i] !== '') {
                css = `table > thead > tr > th:nth-of-type(${(i + 1)}) > span.ui-column-title`;
                this.waitToBePresentByElement(elementFinder.element(by.cssContainingText(css, texts[i])));
                promises.push(this.isPresentByElement(elementFinder.element(by.cssContainingText(css, texts[i]))));
            }
        }
        return Promise.all(promises).then(results => {
            return results.every(item => item === true);
        });
    }

    static sortColumnByLocator(locator: Locator, column: number, ascendent: boolean = true) {
        this.sortColumnByElement(this.getElementByLocator(locator), column, ascendent);
    }

    static sortColumnByElement(elementFinder: ElementFinder, column: number, ascendent: boolean = true) {
        let css: string;
        let timeout: number;
        timeout = 30000;
        this.waitToBePresentByElement(elementFinder);
        css = `table > thead > tr > th:nth-of-type(${column}) span.ui-sortable-column-icon.fa-sort-asc`;
        elementFinder.all(by.css(css)).then(elements => {
            if (elements.length === 0 && ascendent) {
                css = `table > thead > tr > th:nth-of-type(${column}) span.ui-sortable-column-icon`;
                this.waitToBePresentByElement(elementFinder.element(by.css(css)));
                this.clickByElement(elementFinder.element(by.css(css)));
                PrimengBlockUi.waitBlockUi(timeout);
            }
        });
        css = `table > thead > tr > th:nth-of-type(${column}) span.ui-sortable-column-icon.fa-sort-desc`;
        elementFinder.all(by.css(css)).then(elements => {
            if (elements.length === 0 && !ascendent) {
                css = `table > thead > tr > th:nth-of-type(${column}) span.ui-sortable-column-icon`;
                this.waitToBePresentByElement(elementFinder.element(by.css(css)));
                this.clickByElement(elementFinder.element(by.css(css)));
                PrimengBlockUi.waitBlockUi(timeout);
            }
        });
        css = `table > thead > tr > th:nth-of-type(${column}) span.ui-sortable-column-icon.fa-sort-desc`;
        elementFinder.all(by.css(css)).then(elements => {
            if (elements.length === 0 && !ascendent) {
                css = `table > thead > tr > th:nth-of-type(${column}) span.ui-sortable-column-icon`;
                this.waitToBePresentByElement(elementFinder.element(by.css(css)));
                this.clickByElement(elementFinder.element(by.css(css)));
                PrimengBlockUi.waitBlockUi(timeout);
            }
        });
    }

    static isRowTextsByLocator(locator: Locator,
                                  row: number,
                                  texts: string[],
                                  ascendent: boolean = true,
                                  trim: boolean = false) {
        return this.isRowTextsByElement(this.getElementByLocator(locator), row, texts, ascendent, trim);
    }

    static isRowTextsByElement(elementFinder: ElementFinder,
                                  row: number,
                                  texts: string[],
                                  ascendent: boolean = true,
                                  trim: boolean = false) {
        const promises = [];
        if (ascendent) {
            for (let i = 0; i < texts.length; i++) {
                if (texts[i] !== null) {
                    promises.push(PrimengDataTable.isCellTextByElement(elementFinder, texts[i], row, (i + 1), trim));
                }
            }
        } else {
            let j: number;
            for (let i = 0; i < texts.length; i++) {
                if (texts[i] !== null) {
                    j = (texts.length - 1) - i;
                    promises.push(PrimengDataTable.isCellTextByElement(elementFinder, texts[j], row, (i + 1), trim));
                }
            }
        }
        return Promise.all(promises).then(results => {
            return results.every(item => item === true);
        });
    }

    static isColumnTextsByLocator(locator: Locator,
                                  column: number,
                                  texts: string[],
                                  ascendent: boolean = true,
                                  trim: boolean = false) {
        return this.isColumnTextsByElement(this.getElementByLocator(locator), column, texts, ascendent, trim);
    }

    static isColumnTextsByLocatorSpan(locator: Locator,
                                  column: number,
                                  texts: string[],
                                  ascendent: boolean = true,
                                  trim: boolean = false) {
        return this.isColumnTextsByElementSpan(this.getElementByLocator(locator), column, texts, ascendent, trim);
    }

    static isColumnTextsByElementSpan(elementFinder: ElementFinder,
                                  column: number,
                                  texts: string[],
                                  ascendent: boolean = true,
                                  trim: boolean = false) {
        const promises = [];
        if (ascendent) {
            for (let i = 0; i < texts.length; i++) {
                if (texts[i] !== null) {
                    promises.push(PrimengDataTable.isCellTextByElement1(elementFinder, texts[i], (i + 1), column, trim));
                }
            }
        } else {
            let j: number;
            for (let i = 0; i < texts.length; i++) {
                if (texts[i] !== null) {
                    j = (texts.length - 1) - i;
                    promises.push(PrimengDataTable.isCellTextByElement1(elementFinder, texts[j], (i + 1), column, trim));
                }
            }
        }
        return Promise.all(promises).then(results => {
            return results.every(item => item === true);
        });
    }

    static isColumnTextsByElement(elementFinder: ElementFinder,
                                  column: number,
                                  texts: string[],
                                  ascendent: boolean = true,
                                  trim: boolean = false) {
        const promises = [];
        if (ascendent) {
            for (let i = 0; i < texts.length; i++) {
                if (texts[i] !== null) {
                    promises.push(PrimengDataTable.isCellTextByElement(elementFinder, texts[i], (i + 1), column, trim));
                }
            }
        } else {
            let j: number;
            for (let i = 0; i < texts.length; i++) {
                if (texts[i] !== null) {
                    j = (texts.length - 1) - i;
                    promises.push(PrimengDataTable.isCellTextByElement(elementFinder, texts[j], (i + 1), column, trim));
                }
            }
        }
        return Promise.all(promises).then(results => {
            return results.every(item => item === true);
        });
    }

    static filterColumnByLocator(locator: Locator, column: number, text: string) {
        this.filterColumnByElement(this.getElementByLocator(locator), column, text);
    }

    static filterColumnByElement(elementFinder: ElementFinder, column: number, text: string) {
        let css: string;
        let finished: boolean[];
        let counter: number;
        let timeout: number;

        finished = [false, false, false, false];
        counter = 0;
        timeout = 30000;
        this.waitToBePresentByElement(elementFinder);
        css = `table > thead > tr > th:nth-of-type(${column}) > input`;
        elementFinder.all(by.css(css)).then(elements => {
            if (elements.length === 1) {
                this.waitToBePresentByElement(elements[0]);
                PrimengInputText.clearAndFillTextByElement(elements[0], text);
                elements[0].sendKeys(protractor.Key.ENTER);
                PrimengBlockUi.waitBlockUi(timeout);
            }
            counter = counter + elements.length;
            finished[0] = true;
        });
        css = `table > thead > tr > th:nth-of-type(${column}) > app-input-text-sisgcorp > input`;
        elementFinder.all(by.css(css)).then(elements => {
            if (elements.length === 1) {
                this.waitToBePresentByElement(elements[0]);
                PrimengInputText.clearAndFillTextByElement(elements[0], text);
                elements[0].sendKeys(protractor.Key.ENTER);
                PrimengBlockUi.waitBlockUi(timeout);
            }
            counter = counter + elements.length;
            finished[1] = true;
        });
        css = `table > thead > tr > th:nth-of-type(${column}) > p-inputmask`;
        elementFinder.all(by.css(css)).then(elements => {
            if (elements.length === 1) {
                this.waitToBePresentByElement(elements[0]);
                PrimengInputMask.clearAndFillTextByElement(elements[0], text);
                browser.actions().sendKeys(protractor.Key.ENTER).perform();
                PrimengBlockUi.waitBlockUi(timeout);
            }
            counter = counter + elements.length;
            finished[2] = true;
        });
        css = `table > thead > tr > th:nth-of-type(${column}) > p-dropdown`;
        elementFinder.all(by.css(css)).then(elements => {
            if (elements.length === 1) {
                if (text === '') {
                    PrimengDropdown.clearValueByElement(elements[0]);
                } else {
                    PrimengDropdown.selectValueByElement(elements[0], text);
                }
                PrimengBlockUi.waitBlockUi(timeout);
            }
            counter = counter + elements.length;
            finished[3] = true;
        });
    }

    static isCellTextByLocator(locator: Locator, text: string, row: number, column: number, trim: boolean = false) {
        return this.isCellTextByElement(this.getElementByLocator(locator), text, row, column, trim);
    }

    static isCellTextByElement(elementFinder: ElementFinder, text: string, row: number, column: number, trim: boolean = false) {
        const css = `table > tbody > tr:nth-child(${row}) > td:nth-child(${column}) > span`;
        return this.isPresentByElement(elementFinder.element(by.cssContainingText(css, text)));
    }

    static isCellTextByElement1(elementFinder: ElementFinder, text: string, row: number, column: number, trim: boolean = false) {
        const css = `table > tbody > tr:nth-child(${row}) > td:nth-child(${column})`;
        return this.isPresentByElement(elementFinder.element(by.cssContainingText(css, text)));
    }

    static isCellContainingTextByLocator(locator: Locator, text: string, row: number, column: number) {
        return this.isCellContainingTextByElement(this.getElementByLocator(locator), text, row, column);
    }

    static isCellContainingTextByElement(elementFinder: ElementFinder, text: string, row: number, column: number) {
        const css = `table > tbody > tr:nth-of-type(${row}) > td:nth-of-type(${column})  > span`;
        return this.isPresentByElement(elementFinder.element(by.cssContainingText(css, text)));
    }

    static clickCellByLocator(locator: Locator, row: number, column: number) {
        this.clickCellByElement(this.getElementByLocator(locator), row, column);
    }

    static clickCellByElement(elementFinder: ElementFinder, row: number, column: number) {
        const css = `table > tbody > tr:nth-of-type(${row}) > td:nth-of-type(${column})  > span.ui-cell-data`;
        this.waitToBePresentByElement(elementFinder.element(by.css(css)));
        this.clickByElement(elementFinder.element(by.css(css)));
    }

    static clickCellTextByLocator(locator: Locator, text: string) {
        this.clickCellTextByElement(this.getElementByLocator(locator), text);
    }

    static clickCellTextByElement(elementFinder: ElementFinder, text: string) {
        const css = `table > tbody > tr > td > span`;
        this.waitToBePresentByElement(elementFinder.element(by.cssContainingText(css, text)));
        this.clickByElement(elementFinder.element(by.cssContainingText(css, text)));
    }

    // static clickRowTextsByLocator(locator: Locator, texts: string[], trim: boolean = false) {
    //     this.clickRowTextsByElement(this.getElementByLocator(locator), texts, trim);
    // }

    static clickRowTextsByElement(elementFinder: ElementFinder, texts: string[], trim: boolean = false) {
        let css: string;
        PrimengBlockUi.waitBlockUi(20000);
        this.waitToBePresentByElement(elementFinder);
        css = `table > tbody > tr`;
        elementFinder.all(by.css(css)).then(rows => {
            for (const row of rows) {
                this.clickRowByElement(row, texts, trim);
            }
        });
    }

    private static clickRowByElement(elementFinder: ElementFinder, texts: string[], trim: boolean = false) {
        let css: string;
        const promises = [];
        for (let i = 0; i < texts.length; i++) {
            if (texts[i] !== null) {
                css = `td:nth-of-type(${i + 1}) > span`;
                promises.push(this.isPresentByElement(elementFinder.element(by.cssContainingText(css, texts[i].toString()))));
            }
        }
        Promise.all(promises).then(results => {
            if (results.every(item => item === true)) {
                this.clickByElement(elementFinder);
            }
        });
    }

    static isCellTextHighlightedByLocator(locator: Locator, text: string) {
        return this.isCellTextHighlightedByElement(this.getElementByLocator(locator), text);
    }

    static isCellTextHighlightedByElement(elementFinder: ElementFinder, text: string) {
        const css = `table > tbody > tr.ui-state-highlight > td > span`;
        return this.isPresentByElement(elementFinder.element(by.cssContainingText(css, text)));
    }

    static clickCellContainingTextByLocator(locator: Locator, text: string) {
        this.clickCellContainingTextByElement(this.getElementByLocator(locator), text);
    }

    static clickCellContainingTextByElement(elementFinder: ElementFinder, text: string) {
        const css = `table > tbody > tr > td > span`;
        this.waitToBePresentByElement(elementFinder.element(by.cssContainingText(css, text)));
        this.clickByElement(elementFinder.element(by.cssContainingText(css, text)));
    }

    private static searchRowByElement(elementFinder: ElementFinder, texts: string[], trim: boolean = false) {
        let css: string;
        const promises = [];
        for (let i = 0; i < texts.length; i++) {
             if (texts[i] !== null) {
                css = `td:nth-of-type(${i + 1}) > span`;
                promises.push(this.isPresentByElement(elementFinder.element(by.cssContainingText(css, texts[i].toString()))));
            }
        }
        return Promise.all(promises).then(results => {
            return results.every(item => item === true);
        });
    }

    static isEmptyMessageByLocator(locator: Locator, text: string) {
        return this.isEmptyMessageByElement(this.getElementByLocator(locator), text);
    }

    static isEmptyMessageByElement(elementFinder: ElementFinder, text: string) {
        const css = 'table > tbody > tr:nth-of-type(1) > td:nth-of-type(1)';
        return this.isPresentByElement(elementFinder.element(by.cssContainingText(css, text)));
    }

    static isFooterStateByLocator(locator: Locator, first: number, last: number, total: number) {
        return this.isFooterStateByElement(this.getElementByLocator(locator), first, last, total);
    }

    static isFooterStateByElement(elementFinder: ElementFinder, first: number, last: number, total: number) {
        const css = 'p-footer';
        const promises = [];
        let text: string;

        PrimengBlockUi.waitBlockUi(20000);
        PrimengComponent.waitToBePresentByElement(elementFinder.element(by.css(css)));
        text = `${first} a `;
        if (first !== null) {
            promises.push(PrimengComponent.isPresentByElement(elementFinder.element(by.cssContainingText(css, text))));
        }
        text = ` a ${last} de `;
        if (first !== null) {
            promises.push(PrimengComponent.isPresentByElement(elementFinder.element(by.cssContainingText(css, text))));
        }
        text = ` de ${total}`;
        if (first !== null) {
            promises.push(PrimengComponent.isPresentByElement(elementFinder.element(by.cssContainingText(css, text))));
        }
        return Promise.all(promises).then(results => {
            return results.every(result => result === true);
        });
    }

    static clickRowCheckboxByLocator(locator: Locator, row: number) {
        this.clickRowCheckboxByElement(this.getElementByLocator(locator), row);
    }

    static clickRowCheckboxByElement(elementFinder: ElementFinder, row: number) {
        const css = `table > tbody > tr:nth-of-type(${row}) > td:nth-of-type(1) p-dtcheckbox div.ui-chkbox-box`;
        this.waitToBeClickableByElement(elementFinder.element(by.css(css)));
        PrimengComponent.clickByElement(elementFinder.element(by.css(css)));
    }

    static clickAllActiveCheckboxByLocator(locator: Locator) {
        this.clickAllActiveCheckboxByElement(this.getElementByLocator(locator));
    }

    static clickAllActiveCheckboxByElement(elementFinder: ElementFinder) {
        let css: string;

        PrimengBlockUi.waitBlockUi(20000);
        PrimengComponent.waitToBePresentByElement(elementFinder);
        css = `tbody > tr > td p-dtcheckbox div.ui-chkbox-box.ui-state-active`;
        elementFinder.all(by.css(css)).then(results => {
            for (let i = 0; i < results.length; i++) {
                PrimengCheckbox.clickByElement(results[i]);
            }
        });
    }

    static clickAllDisabledCheckboxByLocator(locator: Locator) {
        this.clickAllDisabledCheckboxByElement(this.getElementByLocator(locator));
    }

    static clickAllDisabledCheckboxByElement(elementFinder: ElementFinder) {
        let css: string;

        PrimengBlockUi.waitBlockUi(20000);
        PrimengComponent.waitToBePresentByElement(elementFinder);
        css = `tbody > tr > td p-dtcheckbox div:not(.ui-state-active).ui-chkbox-box`;
        elementFinder.all(by.css(css)).then(results => {
            for (let i = 0; i < results.length; i++) {
                PrimengCheckbox.clickByElement(results[i]);
            }
        });
    }

    static clickRowButtonByLocator(locator: Locator, row: number, text: string) {
        this.clickRowButtonByElement(this.getElementByLocator(locator), row, text);
    }

    static clickRowButtonByElement(elementFinder: ElementFinder, row: number, text: string) {
        let css: string;
        css = `tbody > tr:nth-of-type(${row}) > td button[label="${text}"]`;
        elementFinder.all(by.css(css)).then(elements1 => {
            if (elements1.length === 1) {
                PrimengButton.clickByElement(elements1[0]);
            } else {
                css = `tbody > tr:nth-of-type(${row}) > td button[title="${text}"]`;
                elementFinder.all(by.css(css)).then(elements2 => {
                    if (elements2.length === 1) {
                        PrimengButton.clickByElement(elements2[0]);
                    }
                });
            }
        });
    }

}
