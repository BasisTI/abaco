import * as fs from 'fs';

import {browser} from 'protractor';

export class Download {

    static checkDownload(path: string, timeout: number = 30000) {
        return browser.wait(function() {
            return fs.existsSync(path);
        }, timeout, `File "${path}" does not exists.`).catch(function() {
                return false;
        });
    }

    static removeDownload(path: string, timeout: number = 30000) {
        fs.unlinkSync(path);
    }

    static removeDownloadDirectory(path: string, timeout: number = 30000) {
        fs.rmdirSync(path);
    }

    static isDownload(path: string) {
        return fs.existsSync(path);
    }

}
