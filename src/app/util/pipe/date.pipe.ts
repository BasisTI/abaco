import {Pipe, PipeTransform} from '@angular/core';
import { Analise } from '../../analise';
@Pipe({
    name: 'datePipe'
})
export class DatePipe implements PipeTransform {
    transform(analise: any): number {
        if (analise.dataHomologacao){
            let dataHoje: any = new Date();
            let dataHomologacao: any = new Date();
            dataHomologacao.setMonth(parseInt(analise.dataHomologacao.substring(5,7)) - 1);
            dataHomologacao.setDate(parseInt(analise.dataHomologacao.substring(8,10)));
            dataHomologacao.setFullYear(parseInt(analise.dataHomologacao.substring(0,4)));

            let garantia: any = analise.contrato.diasDeGarantia * 86400000;
            let result = Math.floor(((garantia - (dataHoje - dataHomologacao)) / 86400000));
            if (result < 0  || !analise.baselineImediatamente){
                result = 0
                return result;
            }

            return result;
        } else {
            return 0}
    }
}