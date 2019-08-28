import { Pageable } from './../../util/pageable.util';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
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

    // novo método que irá substituir o exportarRelatorio ao fim da refatoração
    static exportReport(tipoRelatorio: string, http: HttpClient, resourceName: string, params: Pageable, filter: any): Observable<Blob> {
        return ExportacaoUtilService.generate(
            `${this.resourceUrl}/${resourceName}/exportacao/${tipoRelatorio}`,
            http,
            params,
            filter
        );
    }

    static generate(endpoint: string, http: HttpClient, pageable: Pageable, filter: any): Observable<Blob> {
        let body = {};
        body = Object.assign(body, filter);
        return http.post(endpoint + pageable.toParams(), body, {responseType: 'blob'} );
    }

    static getExtension(tipoRelatorio: string): string {
        if (tipoRelatorio === this.PDF) {
            return '.pdf';
        }
        if (tipoRelatorio === this.EXCEL) {
            return '.xls';
        }
        if (tipoRelatorio === this.CSV) {
            return '.csv';
        }
        return null;
    }
}
