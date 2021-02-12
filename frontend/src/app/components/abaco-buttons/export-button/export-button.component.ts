import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ExportacaoUtilService } from './export-button.service';
import { ExportacaoUtil } from './export-button.util';

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
private http: HttpClient,
) { }



exportar(tipoRelatorio: string) {
ExportacaoUtilService.exportReport(tipoRelatorio, this.http, this.resourceName, null, this.filter)
.subscribe((res: Blob) => {
const file = new Blob([res], { type: tipoRelatorio });
const url = URL.createObjectURL(file);
ExportacaoUtil.download(url, this.resourceName + ExportacaoUtilService.getExtension(tipoRelatorio));
});
}

imprimir(tipoRelatorio: string) {
window.open(`${environment.apiUrl}/${this.resourceName}/exportacao-arquivo`);
}

exibirBlockUi(menssagem: string) {
}

}
