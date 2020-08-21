import {PrimengInputText} from '../../componentes/primeng-inputtext';
import {by} from 'protractor';
import {PrimengComponent} from '../../componentes/primeng-component';
import {PrimengMenu} from '../../componentes/primeng-menu';
import {PrimengBlockUi} from '../../componentes/primeng-block-ui';
import {PrimengGrowl} from '../../componentes/primeng-growl';
import {PrimengButton} from '../../componentes/primeng-button';

export class AlterarSenhaPage {
    login() {
        const username = 'admin';
        const password = 'admin';
        PrimengInputText.clearAndFillTextByLocator(by.name('username'), username);
        PrimengInputText.clearAndFillTextByLocator(by.name('password'), password);
        PrimengComponent.clickByLocator(by.css('.ui-button'));
    }
    navegar() {
        PrimengMenu.clickByPath(['Configuração', 'Alterar Senha']);
        PrimengBlockUi.waitBlockUi(5000);
    }
    preencherSenhaInvalida() {
        PrimengInputText.clearAndFillTextByLocator(by.name('oldPassword'), 'sssss');
        PrimengInputText.clearAndFillTextByLocator(by.name('newPassword'), 'sssss');
        PrimengInputText.clearAndFillTextByLocator(by.name('newPasswordConfirm'), 'sssss');
        PrimengButton.clickByLocator(by.css('.ui-button'));
    }
    preencherSenhaConfirmacaoInvalida() {
        PrimengInputText.clearAndFillTextByLocator(by.name('oldPassword'), 'admin');
        PrimengInputText.clearAndFillTextByLocator(by.name('newPassword'), 'admin');
        PrimengInputText.clearAndFillTextByLocator(by.name('newPasswordConfirm'), '');
        PrimengButton.clickByLocator(by.css('.ui-button'));
    }
    preencherSenha() {
        PrimengInputText.clearAndFillTextByLocator(by.name('oldPassword'), 'admin');
        PrimengInputText.clearAndFillTextByLocator(by.name('newPassword'), 'admin');
        PrimengInputText.clearAndFillTextByLocator(by.name('newPasswordConfirm'), 'admin');
        PrimengButton.clickByLocator(by.css('.ui-button'));
    }
    verificarSenha(aviso: string) {
        const promises = [];
        promises.push(PrimengGrowl.isWarningMessage(aviso));
        return Promise.all(promises).then(resultados => {
            switch (false) {
                case resultados[0]:
                    return `Mensagem de aviso "${aviso}" não foi exibida.`;
                default:
                    return 'OK';
            }
        });
    }

}
