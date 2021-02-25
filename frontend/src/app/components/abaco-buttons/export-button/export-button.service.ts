import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.prod';
import { Observable } from 'rxjs';

export class ExportacaoUtilService {

    static CONTENT_TYPE_PDF = 'application/pdf';
    static CONTENT_TYPE_CSV = 'text/csv';
    static CONTENT_TYPE_EXCEL = 'application/vnd.ms-excel';
    static PDF = 'pdf';
    static EXCEL = 'xls';
    static CSV = 'csv';

    static resourceUrl = environment.apiUrl;

    static getContentType(tipoRelatorio: string): any {
        if (tipoRelatorio === this.PDF) {
            return ExportacaoUtilService.CONTENT_TYPE_PDF;
        }
        if (tipoRelatorio === this.EXCEL) {
            return ExportacaoUtilService.CONTENT_TYPE_EXCEL;
        }
        if (tipoRelatorio === this.CSV) {
            return ExportacaoUtilService.CONTENT_TYPE_CSV;
        }
        return null;
    }

    static exportReport(tipoRelatorio: string, http: HttpClient, resourceName: string, params: any, filter: any): Observable<Blob> {
        return ExportacaoUtilService.generate(
            `${this.resourceUrl}/${resourceName}/exportacao/${tipoRelatorio}`,
            http,
            params,
            filter
        );
    }

    static imprimir(http: HttpClient, resourceName: string, params: any, filter: any) {
        return ExportacaoUtilService.generateImprimir(
            `${this.resourceUrl}/${resourceName}/exportacao-arquivo/`,
            http,
            params,
            filter
        );
    }

    static generate(endpoint: string, http: HttpClient, datatable: any, filter: any): Observable<Blob> {
        return http.post(endpoint, filter, {responseType: 'blob', params: datatable });
    }

    static generateImprimir(endpoint: string, http: HttpClient, datatable: any, filter: any) {
        return http.post(endpoint, filter, {responseType: 'arraybuffer', params: datatable });
    }

    static getExtension(tipoRelatorio: string): string {
        switch(tipoRelatorio) {
            case this.PDF: return `.${this.PDF}`;
            case this.EXCEL: return `.${this.EXCEL}`;
            case this.CSV: return `.${this.CSV}`;
            default: return `.${this.PDF}`; 
        }
    }
}
