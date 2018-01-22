import { Injectable } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';

@Injectable()
export class PageNotificationService {

    constructor(private messageService: MessageService) { }

    private readonly createMsg = 'Registro incluído com sucesso!';

    private readonly updateMsg = 'Dados alterados com sucesso!';

    private readonly deleteMsg = 'Registro excluído com sucesso!';

    private readonly errorMsg = 'Erro!';

    addCreateMsg(title?: string) {
        this.addInfoMsg('success', this.createMsg, title);
    }

    private addInfoMsg(severity: string, msg: string, title?: string) {
        this.messageService.add({
            severity: severity,
            summary: title,
            detail: msg
        });
    }

    addUpdateMsg(title?: string) {
        this.addInfoMsg('success', this.updateMsg, title);
    }

    addDeleteMsg(title?: string) {
        this.addInfoMsg('success', this.deleteMsg, title);
    }

    addErrorMsg(message?: string) {
      this.addInfoMsg('error', message, this.errorMsg);
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
