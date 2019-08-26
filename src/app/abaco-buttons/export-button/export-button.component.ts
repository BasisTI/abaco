import { MessageUtil } from '../../util/message.util';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { PageNotificationService, HttpService } from '@basis/angular-components';
import { Component, Input } from '@angular/core';
import { ExportacaoUtil } from '../../util/exportacao.util'
import { ExportacaoUtilService } from '../../util/service/exportacao-util.service';
import { DataTable } from 'primeng/primeng';
import { Pageable } from '../../util/pageable.util';
import errorConstants from '../../shared/constants/errorConstants';

@Component({
    selector: 'app-export-button',
    templateUrl: './export-button.component.html',
    styleUrls: ['./export-button.component.css']
})
export class ExportButtonComponent {

    @BlockUI() blockUI: NgBlockUI;

    @Input() resourceName: string;

    @Input() dataTable: DataTable;

    @Input() filter: any;

    tiposExportacao = [
        {
            label: 'PDF', icon: '', command: () => {
                this.exportar(ExportacaoUtilService.PDF);
            }
        },
        {
            label: 'EXCEL', icon: '', command: () => {
                this.exportar(ExportacaoUtilService.EXCEL);
            }
        },
        {
            label: 'IMPRIMIR', icon: '', command: () => {
                this.imprimir(ExportacaoUtilService.PDF);
            }
        },
    ];

    constructor(
        private pageNotificationService: PageNotificationService,
        private http: HttpService
    ) { }

    exportar(tipoRelatorio: string) {

        this.blockUI.start(MessageUtil.BLOCKUI_RELATORIO);
        ExportacaoUtilService.exportReport(tipoRelatorio, this.http, this.resourceName, this.getParams(), this.filter).subscribe(
            downloadUrl => {
                ExportacaoUtil.download(downloadUrl, this.resourceName + ExportacaoUtilService.getExtension(tipoRelatorio));
                this.blockUI.stop();
            }, (responseError) => {
                this.hanlderResponseError(responseError);
            }
        );

    }

    hanlderResponseError(response) {
        const [status, _body] = response;
        const message = JSON.parse(_body).message;
        if (status == 400 && message == errorConstants.ERROR_RELATORIO) {
            this.pageNotificationService.addErrorMessage(MessageUtil.ERRO_RELATORIO);
            this.blockUI.stop();
        }
    }

    imprimir(tipoRelatorio: string) {

        this.blockUI.start(MessageUtil.BLOCKUI_RELATORIO);
        ExportacaoUtilService.exportReport(tipoRelatorio, this.http, this.resourceName, this.getParams(), this.filter).subscribe(
            downloadUrl => {
                ExportacaoUtil.imprimir(downloadUrl);
                this.blockUI.stop();
            }, () => {
                this.pageNotificationService.addErrorMessage(MessageUtil.ERRO_RELATORIO);
                this.blockUI.stop();
            }
        );

    }

    private getParams(): Pageable{
        const pageable = new Pageable(this.dataTable.page, this.dataTable.rows);
        pageable.setSort(this.dataTable.sortOrder, this.dataTable.sortField);
        return pageable;
      }
}
