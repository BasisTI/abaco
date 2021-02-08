import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ExportacaoUtilService } from './export-button.service';

@Component({
    selector: 'app-export-button',
    templateUrl: './export-button.component.html',
    styleUrls: ['./export-button.component.css']
})
export class ExportButtonComponent {

    @Input() resourceName: string;

    @Input() filter: any;

    tiposExportacao = [
        {
            label: 'PDF', icon: '', command: () => {
                switch(this.router.url){
                    case '/admin/user':
                        this.exportarUsuario("pdf");
                        break;
                }
                this.exportar(ExportacaoUtilService.PDF);
            }
        },
        {
            label: 'EXCEL', icon: '', command: () => {
                switch(this.router.url){
                    case '/admin/user':
                        this.exportarUsuario("excel");
                        break;
                }
                this.exportar(ExportacaoUtilService.EXCEL);
            }
        },
        {
            label: 'IMPRIMIR', icon: '', command: () => {
                switch(this.router.url){
                    case '/admin/user':
                        this.imprimirUsuario();
                        break;
                }
                this.imprimir(ExportacaoUtilService.PDF);
            }
        },
    ];

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    exportarUsuario(tipoRelatorio: string){
        ExportacaoUtilService.exportReport(tipoRelatorio, this.http, "users", null, null)
                        .subscribe(response => {
                            const file = new Blob([response], { type: tipoRelatorio });
                            const url = URL.createObjectURL(file);
                            const anchor = document.createElement('a');
                            let extensao = tipoRelatorio == 'pdf' ? '.pdf' : '.xlsx';
                            anchor.download = 'Usuario' + extensao;
                            anchor.href = url;
                            document.body.appendChild(anchor);
                            anchor.click();
                        });

    }

    imprimirUsuario(){
        window.open(`${environment.apiUrl}/users/exportacao-arquivo`)
    }


    exportar(tipoRelatorio: string) {

        // this.exibirBlockUi(GeneralConstants.generate_report);
        // ExportacaoUtilService.exportReport(tipoRelatorio, this.http, this.resourceName, this.dataTable, this.filter)
        //     .subscribe((res: Blob) => {
        //         const file = new Blob([res], { type: tipoRelatorio });
        //         const url = URL.createObjectURL(file);
        //         ExportacaoUtil.download(url, this.resourceName + ExportacaoUtilService.getExtension(tipoRelatorio));
        //     });
    }

    imprimir(tipoRelatorio: string) {

        // this.exibirBlockUi(GeneralConstants.generate_report);
        // ExportacaoUtilService.exportReport(tipoRelatorio, this.http, this.resourceName, this.dataTable, this.filter)
        // .subscribe( downloadUrl =>  ExportacaoUtil.imprimir(downloadUrl)) ;
    }

    exibirBlockUi(menssagem: string) {
    }

}
