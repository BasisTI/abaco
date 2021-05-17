import { Component, OnInit } from '@angular/core';
import { VisaoPfListModelsService } from './visao-pf-list-models.service';
import { ModeloTreinadoView } from './visao-pf-list-models.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-visaopf-list-models',
  templateUrl: './visao-pf-list-models.component.html',
  styleUrls: ['./visao-pf-list-models.component.scss']
})
export class VisaopfListModelsComponent implements OnInit {

    modelosTreinados:any
    modelosTreinadosView:Array<ModeloTreinadoView> = []

    constructor(private visaopfListModelsService: VisaoPfListModelsService, private router: Router,) { }

    ngOnInit(): void {
        this.getModelosTreinados()
    }

    selectModel(event){
        var modelSelect = event.selection
        this.router.navigate([`/visaopf/model/byuuid/${modelSelect.uuid}`])
    }

    getModelosTreinados(){
        this.visaopfListModelsService.getAllModels().subscribe((result: any)  => {
            this.modelosTreinados = result

            for(var modelo of this.modelosTreinados){
                this.modelosTreinadosView.push( new ModeloTreinadoView(modelo.uuid, modelo.bucketModel ,modelo.processoTreinamento.dataFim, modelo.metricasTreinamento[modelo.metricasTreinamento.length - 1].totalLoss, modelo.metricasTreinamento[modelo.metricasTreinamento.length - 1].step ))
            }
        })

    }

    vizualizarModelo(modelSelect){
        if(modelSelect){
            this.router.navigate([`/visaopf/model/byuuid/${modelSelect.uuid}`])
        }
    }
}
