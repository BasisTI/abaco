import {PrimengInputText} from '../../componentes/primeng-inputtext';
import {browser, by} from 'protractor';
import {PrimengButton} from '../../componentes/primeng-button';
import {PrimengGrowl} from '../../componentes/primeng-growl';
import {PrimengComponent} from '../../componentes/primeng-component';

export class LoginPage {
    private promises = [];


    login(username: string, password: string) {
        PrimengInputText.clearAndFillTextByLocator(by.name('username'), username);
        PrimengInputText.clearAndFillTextByLocator(by.name('password'), password);
        PrimengButton.clickByLocator(by.css('.ui-button'));
    }

    verificarMensagem(aviso: string) {
        this.promises = [];
        this.promises.push(PrimengGrowl.isWarningMessage(aviso));
        PrimengGrowl.closeWarningMessage();
        return Promise.all(this.promises).then(resultados => {
            switch (false) {
                case resultados[0]:
                    return `Mensagem de aviso "${aviso}" não foi exibida.`;
                default:
                    return 'OK';
            }
        });
    }

    verificarPreenchimentoObrigatório() {
        this.promises = [];

        PrimengInputText.clearAndFillTextByLocator(by.name('username'), '');
        PrimengInputText.clearAndFillTextByLocator(by.name('password'), '');
        PrimengButton.clickByLocator(by.css('.ui-button'));
        this.promises.push(PrimengGrowl.isWarningMessage('Por favor preencher campos obrigatórios'));
        PrimengGrowl.closeWarningMessage();

        PrimengInputText.clearAndFillTextByLocator(by.name('username'), 'admin');
        PrimengInputText.clearAndFillTextByLocator(by.name('password'), '');
        PrimengButton.clickByLocator(by.css('.ui-button'));
        this.promises.push(PrimengGrowl.isWarningMessage('Por favor preencher campos obrigatórios'));
        PrimengGrowl.closeWarningMessage();


        PrimengInputText.clearAndFillTextByLocator(by.name('username'), '');
        PrimengInputText.clearAndFillTextByLocator(by.name('password'), 'admin');
        PrimengButton.clickByLocator(by.css('.ui-button'));
        this.promises.push(PrimengGrowl.isWarningMessage('Por favor preencher campos obrigatórios'));
        PrimengGrowl.closeWarningMessage();

        return Promise.all(this.promises).then(resultados => {
            switch (false) {
                case resultados[0]:
                    return `Mensagem de Campo Obrigatório não encontrada`;
                default:
                    return 'OK';
            }
        });
    }
}
