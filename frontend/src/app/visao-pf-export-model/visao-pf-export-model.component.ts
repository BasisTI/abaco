import { Component, OnInit } from '@angular/core';
import { VisaoPfExportModelService } from './visao-pf-export-model.service';
import { ModeloTreinadoView } from '../visaopf-list-models/visao-pf-list-models.model';
import {MessageService} from 'primeng/api';

@Component({
    selector: 'app-visao-pf-export-model',
    templateUrl: './visao-pf-export-model.component.html',
    styleUrls: ['./visao-pf-export-model.component.scss']
})
export class VisaoPfExportModelComponent implements OnInit {

    modelos:Array<any> = []

    constructor(private visaopfExportModelService: VisaoPfExportModelService, private messageService: MessageService) { }

    ngOnInit(): void {
        this.getModelosTreinados()
    }

    exportModel(modelo){
        this.visaopfExportModelService.sendExportModel(modelo).subscribe((result: any)  => {
            if(result == 0){
                this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Modelo Exportado'});
                this.visaopfExportModelService.updateModelPredict(modelo.uuid).subscribe((result: any)  => {
                    if (result = true){
                        this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Modelo pronto para uso!'});
                    }
                })
            }
        })
    }

    getModelosTreinados(){
        this.visaopfExportModelService.getAllModels().subscribe((result: any)  => {
            var modelos = result
            var modelTrain
            for(var modelo of modelos){
                modelTrain = new ModeloTreinadoView(modelo.uuid, modelo.bucketModel, modelo.processoTreinamento.dataFim, modelo.metricasTreinamento[modelo.metricasTreinamento.length - 1].totalLoss, modelo.metricasTreinamento[modelo.metricasTreinamento.length - 1].step )
                this.modelos.push( {label: modelTrain.uuid, value: modelTrain} )
            }
        })
    }
}
