/**
 * Documentação Allure: https://www.npmjs.com/package/jasmine-allure-reporter
 * Documentação Beautiful Reporter: https://www.npmjs.com/package/protractor-beautiful-reporter
 */

exports.config = {
    allScriptsTimeout: 11000,
    specs: [
        './e2e/configuracao/reindexar/reindexar.e2e-spec.ts',
        './e2e/configuracao/alterar-senha/alterar-senha.e2e-spec.ts',
        './e2e/login/login.e2e-spec.ts',
        './e2e/cadastros/fase/fase.e2e-spec.ts',
        './e2e/cadastros/manual/manual.e2e-spec.ts',
    ],

    /**
     * Configurações para testes com o Chrome. Apenas um navegador deve ser configurado em cada execução.
     */
    capabilities: {
        'browserName': 'chrome',
        'chromeOptions': {
            args: ['--no-sandbox', '--test-type=browser'],
            prefs: {
                'download': {
                    'prompt_for_download': false,
                    'directory_upgrade': true,
                    'default_directory': __dirname + '/e2e/downloads',
                }
            }
        }
    },

    /**
     * Configurações para testes com o Firefox. Apenas um navegador deve ser configurado em cada execução.
     */
    // capabilities: {
    //     'browserName': 'firefox',
    //     'moz:firefoxOptions': {
    //         args: [],
    //         prefs: {
    //             'browser.download.folderList': 2,
    //             'browser.download.dir': __dirname + '/e2e/downloads',
    //             'services.sync.prefs.sync.browser.download.useDownloadDir': true,
    //             'browser.download.useDownloadDir': true,
    //             'browser.download.manager.alertOnEXEOpen': false,
    //             'browser.download.manager.closeWhenDone': true,
    //             'browser.download.manager.focusWhenStarting': false,
    //             'browser.download.manager.showWhenStarting': false,
    //             'browser.helperApps.alwaysAsk.force': false,
    //             'browser.download.manager.showAlertOnComplete': false,
    //             'browser.download.manager.useWindow': false,
    //             // List of Firefox MIME Types: https://www.freeformatter.com/mime-types-list.html
    //             'browser.helperApps.neverAsk.saveToDisk': 'text/plain;text/csv,application/csv;text/comma-separat‌​ed-values;application/excel;application/octet-stream;application/xlsx;application/xls;application/vnd.ms-excel;application/vnd.ms-excel.addin.macroenabled.12;application/vnd.ms-excel.sheet.binary.macroenabled.12;application/vnd.ms-excel.template.macroenabled.12;application/vnd.ms-excel.sheet.macroenabled.12;application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //         }
    //     }
    // },

    directConnect: true,
    baseUrl: 'http://localhost:4200',
    framework: 'jasmine2',
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000,
        print: function () {
        }
    },
    onPrepare() {
        require('ts-node').register({
            project: 'e2e/tsconfig.e2e.json'
        });
        browser.waitForAngularEnabled(false);

        // Allure Reporter Screenshots Configuration
        var originalAddExpectationResult = jasmine.Spec.prototype.addExpectationResult;
        jasmine.Spec.prototype.addExpectationResult = function () {
            browser.takeScreenshot().then(function (png) {
                allure.createAttachment('Screenshot', function () {
                    return new Buffer(png, 'base64')
                }, 'image/png')();
            });
            return originalAddExpectationResult.apply(this, arguments);
        };

        // Allure Reporter Configuration
        var AllureReporter = require('jasmine-allure-reporter');
        var today = new Date();
        var date = today.getFullYear() + '.' + (today.getMonth() < 9 ? '0' : '') + (today.getMonth() + 1) + '.' + (today.getDate() < 10 ? '0' : '') + today.getDate();
        var time = '-' + (today.getHours() < 10 ? '0' : '') + today.getHours() + ":" + (today.getMinutes() < 10 ? '0' : '') + today.getMinutes() + ':' + (today.getSeconds() < 10 ? '0' : '') + today.getSeconds();
        var allureReporter = new AllureReporter({
            resultsDir: __dirname + '/test-reports/'+ date + time
        });
        jasmine.getEnv().addReporter(allureReporter);

        // Protractor Beautiful Reporter Configuration
        var HtmlReporter = require('protractor-beautiful-reporter');
        var reporter = new HtmlReporter({
            baseDirectory: 'test-results',
            screenshotsSubfolder: 'images',
            jsonsSubfolder: 'jsons'
        });
        jasmine.getEnv().addReporter(reporter.getJasmine2Reporter());
    }

};
