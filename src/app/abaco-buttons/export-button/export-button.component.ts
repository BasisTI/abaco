import { HttpClient } from '@angular/common/http';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Component, Input } from '@angular/core';
import { ExportacaoUtil } from '../../util/exportacao.util'
import { ExportacaoUtilService } from './export-button.service';
import { DataTable } from 'primeng/primeng';
import { GeneralConstants } from '../../shared';

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

    constructor( private http: HttpClient ) { }

    exportar(tipoRelatorio: string) {

        this.blockUI.start(GeneralConstants.generate_report);
        ExportacaoUtilService.exportReport(tipoRelatorio, this.http, this.resourceName, this.dataTable, this.filter)
            .finally( () => this.blockUI.stop())
            .subscribe((res: Blob) => {
                const file = new Blob([res], { type: tipoRelatorio });
                const url = URL.createObjectURL(file);
                ExportacaoUtil.download(url, this.resourceName + ExportacaoUtilService.getExtension(tipoRelatorio));
            });
    }

    imprimir(tipoRelatorio: string) {

        this.blockUI.start(GeneralConstants.generate_report);
        ExportacaoUtilService.exportReport(tipoRelatorio, this.http, this.resourceName, this.dataTable, this.filter)
        .finally(() => this.blockUI.stop())
        .subscribe( downloadUrl =>  ExportacaoUtil.imprimir(downloadUrl)) ;
    }

}
