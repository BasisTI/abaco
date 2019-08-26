import { Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { HttpService } from '@basis/angular-components';
import { environment } from '../../../environments/environment.prod';
import { Pageable } from '../pageable.util';

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

    private static getOptions(): RequestOptions {
        const headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');

        /* headers.append('Authorization', AutenticacaoService.AUTORIZATION()); */
        const options: RequestOptions = new RequestOptions({ headers: headers });
        options.responseType = ResponseContentType.Blob;
        return options;
    }

    // novo método que irá substituir o exportarRelatorio ao fim da refatoração
    static exportReport(tipoRelatorio: string, http: HttpService, resourceName: string, params: Pageable, filter: any) {
        return ExportacaoUtilService.generate(
            `${this.resourceUrl}/${resourceName}/exportacao/${tipoRelatorio}`,
            ExportacaoUtilService.getContentType(tipoRelatorio),
            http,
            params,
            filter
        );
    }

    static exportarRelatorio(tipoRelatorio: string, resourceUrl: string, http: HttpService, query: string) {
        if(query == undefined){
            query = '?query=' + "*";
        } else if (resourceUrl == '/api/analise' || resourceUrl == '/api/sistema' || resourceUrl == '/api/users'){
            query = '?query=' + query;
        } else {
            query = '?query=' + "*" + query +"*";
        } 
        
        return ExportacaoUtilService.gerar(
            `${resourceUrl}/exportacao/` + tipoRelatorio + query,
            ExportacaoUtilService.getContentType(tipoRelatorio),
            http
        );
    }

    static generate(endpoint: string, tipo: string, http: HttpService, pageable: Pageable, filter: any): any {
        const options = ExportacaoUtilService.getOptions();
        options.body = pageable
        return http.post(endpoint, filter, options )
            .map((res: any) => {
                    const file = new Blob([res._body], { type: tipo });
                    return URL.createObjectURL(file);
                }
            );
    }

    static gerar(endpoint: string, tipo: string, http: HttpService): any {
        return http.get(endpoint, ExportacaoUtilService.getOptions())
            .map((res: any) => {
                const file = new Blob([res.blob()], { type: tipo });
                return URL.createObjectURL(file);
            });
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
