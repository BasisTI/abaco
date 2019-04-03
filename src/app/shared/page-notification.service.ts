import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';

@Injectable()
export class PageNotificationService {

    constructor(private messageService: MessageService, private translate: TranslateService) { }

    private readonly successSeverity = 'success';
    private readonly infoSeverity = 'info';
    private readonly warnSeverity = 'warn';
    private readonly errorSeverity = 'error';

    private readonly createMsg = 'Registro incluído com sucesso!';

    private readonly updateMsg = 'Dados alterados com sucesso!';

    private readonly deleteMsg = 'Registro excluído com sucesso!';

    private readonly errorMsg = 'Erro!';

    getLabel(label) {
        let str: any;
        this.translate.get(label).subscribe((res: string) => {
            str = res;
        }).unsubscribe();
        return str;
    }

    private addMsg(severity: string, msg: string, title?: string) {
        this.messageService.add({
            severity: severity,
            summary: title,
            detail: msg
        });
    }
    
    addCreateMsg(title?: string) {
        this.addMsg(this.successSeverity, this.getLabel('Global.Mensagens.RegistroIncluidoComSucesso'), title);
    }

    addCreateMsgWithName(name: string, title?: string) {
        const msg = `${this.getLabel('Global.Mensagens.Registro')} ${name} ${this.getLabel('Global.Mensagens.IncluidoComSucesso')}`;
        this.addMsg(this.successSeverity, msg, title);
    }

    addSuccessMsg(msg: string, title?: string) {
        this.addMsg(this.successSeverity, msg, title);
    }

    addInfoMsg(msg: string, title?: string) {
        this.addMsg(this.infoSeverity, msg, title);
    }

    addUpdateMsg(title?: string) {
        this.addMsg(this.successSeverity, this.getLabel('Global.Mensagens.DadosAlteradosComSucesso'), title);
    }

    addDeleteMsg(title?: string) {
        this.addMsg(this.successSeverity, this.getLabel('Global.Mensagens.RegistroExcluidoComSucesso'), title);
    }

    addDeleteMsgWithName(name: string, title?: string) {
        const msg = `${this.getLabel('Global.Mensagens.Registro')} ${name} ${this.getLabel('Global.Mensagens.ExcluidoComSucesso')}`;
        this.addMsg(this.successSeverity, msg, title);
    }

    addBlockMsgWithName(name: string, title?: string) {
        const msg = `${this.getLabel('Global.Mensagens.RegistroBloqueadoComSucesso')}`;
        this.addMsg(this.successSeverity, msg, title);
    }

    addUnblockMsgWithName(title?: string) {
        const msg = `${this.getLabel('Global.Mensagens.RegistroDesbloqueadoComSucesso')}`;
        this.addMsg(this.successSeverity, msg, title);
    }

    addErrorMsg(message?: string) {
        this.addMsg(this.errorSeverity, message, this.getLabel('Global.Mensagens.Erro'));
    }

    getInvalidFields(invalidFields: Array<any>) {
        let invalidFieldNamesString = '';

        if (invalidFields) {
            invalidFields.forEach(each => {
                if (each === invalidFields[invalidFields.length - 1]) {
                    invalidFieldNamesString = invalidFieldNamesString + each.field;
                } else {
                    invalidFieldNamesString = invalidFieldNamesString + ', ';
                }
            });
        }

        return invalidFieldNamesString;
    }

}
