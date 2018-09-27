import { Injectable } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';

@Injectable()
export class PageNotificationService {

    constructor(private messageService: MessageService) { }

    private readonly successSeverity = 'success';
    private readonly infoSeverity = 'info';
    private readonly warnSeverity = 'warn';
    private readonly errorSeverity = 'error';

    private readonly createMsg = 'Registro incluído com sucesso!';

    private readonly updateMsg = 'Dados alterados com sucesso!';

    private readonly deleteMsg = 'Registro excluído com sucesso!';

    private readonly errorMsg = 'Erro!';

    addCreateMsg(title?: string) {
        this.addMsg(this.successSeverity, this.createMsg, title);
    }

    private addMsg(severity: string, msg: string, title?: string) {
        this.messageService.add({
            severity: severity,
            summary: title,
            detail: msg
        });
    }

    addCreateMsgWithName(name: string, title?: string) {
        const msg = `Registro '${name}' incluído com sucesso!`;
        this.addMsg(this.successSeverity, msg, title);
    }

    addSuccessMsg(msg: string, title?: string) {
        this.addMsg(this.successSeverity, msg, title);
    }

    addInfoMsg(msg: string, title?: string) {
        this.addMsg(this.infoSeverity, msg, title);
    }

    addUpdateMsg(title?: string) {
        this.addMsg(this.successSeverity, this.updateMsg, title);
    }

    addDeleteMsg(title?: string) {
        this.addMsg(this.successSeverity, this.deleteMsg, title);
    }

    addDeleteMsgWithName(name: string, title?: string) {
        const msg = `Registro '${name}' excluído com sucesso!`;
        this.addMsg(this.successSeverity, msg, title);
    }

    addBlockMsgWithName(name: string, title?: string) {
        const msg = `Registro bloqueado com sucesso!`;
        this.addMsg(this.successSeverity, msg, title);
    }

    addUnblockMsgWithName(title?: string) {
        const msg = `Registro  desbloqueado com sucesso!`;
        this.addMsg(this.successSeverity, msg, title);
    }

    addErrorMsg(message?: string) {
      this.addMsg(this.errorSeverity, message, this.errorMsg);
    }

    getInvalidFields(invalidFields: Array<any>) {
      let invalidFieldNamesString = '';

      invalidFields.forEach(each => {
        if(each === invalidFields[invalidFields.length-1]) {
          invalidFieldNamesString = invalidFieldNamesString + each.field;
        } else {
          invalidFieldNamesString = invalidFieldNamesString + ', ';
        }
      });

      return invalidFieldNamesString;
    }

}
