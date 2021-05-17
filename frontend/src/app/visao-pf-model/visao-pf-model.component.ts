import { Component, OnInit } from '@angular/core';
import { VisaoPfModelService } from './visao-pf-model.service';
import { Message } from 'primeng/api'
import { switchMap,takeWhile } from 'rxjs/operators'
import { interval, from } from 'rxjs'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-visao-pf-model',
  templateUrl: './visao-pf-model.component.html',
  styleUrls: ['./visao-pf-model.component.scss']
})
export class VisaoPfModelComponent implements OnInit {

    msgs: Message[] = []
    data:any
    dataLine:any
    datasetMetrica:any
    modeloMetrica:any
    processosTreinamento:Array<any> = []
    metricaSteps :Array<any> = []
    metricaTotalLoss :Array<any> = []
    metricaBoxClassificLoss :Array<any> = []
    metricaBoxLocLoss :Array<any> = []
    metricaObjRPNLoss :Array<any> = []
    metricaLocRPNLoss :Array<any> = []
    metricaCloneLoss :Array<any> = []


    constructor(private activedRoute: ActivatedRoute, private visaopfModelService: VisaoPfModelService) {
        var id_model = this.activedRoute.snapshot.paramMap.get('uuid')

        if(id_model){
            this.visaopfModelService.getModelTreinadoByUUID(id_model).subscribe((resp:any) =>{
                if(resp){
                    this.processosTreinamento.push(resp.processoTreinamento)
                    this.visaopfModelService.getDatasetByUUID(resp.dataset.uuid).subscribe((resp:any) =>{
                        this.updateDataset(resp)
                    })
                    this.modeloMetrica = resp.metricasTreinamento[ resp.metricasTreinamento.length-1 ]
                    this.upateMetricasTrain(resp.metricasTreinamento)
                }
            })
        }else{
            this.getMetricsDatasetTrain()
        }
    }

    ngOnInit(): void {


    }

    upateMetricasTrain(metricaTreinamento){
        for(var metrica of metricaTreinamento){
            this.metricaSteps.push(metrica.step)
            this.metricaTotalLoss.push(metrica.totalLoss)
            this.metricaBoxClassificLoss.push(metrica.classificationLoss)
            this.metricaBoxLocLoss.push(metrica.localizationBoxClassifierLoss)
            this.metricaObjRPNLoss.push(metrica.objectnessLoss)
            this.metricaLocRPNLoss.push(metrica.localizationRpnLoss)
            this.metricaCloneLoss.push(metrica.cloneLoss)
        }

        this.dataLine = {
            labels: this.metricaSteps,
            datasets: [
                {
                    label: 'Total Loss',
                    data: this.metricaTotalLoss,
                    fill: false,
                    borderColor: '#42A5F5'
                },
                {
                    label: 'Box Classification Loss',
                    data: this.metricaBoxClassificLoss,
                    fill: false,
                    borderColor: '#FFC107'
                },
                {
                    label: 'Box Localization Loss',
                    data: this.metricaBoxLocLoss,
                    fill: false,
                    borderColor: '#BDB76B'
                },
                {
                    label: 'Objectness RPN Loss',
                    data: this.metricaObjRPNLoss,
                    fill: false,
                    borderColor: '#008000'
                },
                {
                    label: 'Localization RPN Loss',
                    data: this.metricaLocRPNLoss,
                    fill: false,
                    borderColor: '#D2691E'
                }

            ]
        }

    }

    getModelTreinadoMetricas(uuid){
        this.visaopfModelService.getModelTreinadoByUUID(uuid).subscribe((resp:any) =>{
            if(resp){
                this.modeloMetrica = resp.metricasTreinamento[ resp.metricasTreinamento.length-1 ]
                this.upateMetricasTrain(resp.metricasTreinamento)
            }
        })
    }

    updateProcessoTreinamento(uuidProcesso){
        interval(2100).pipe(
            switchMap(() => from(this.visaopfModelService.getProcessoTreinamento(uuidProcesso))),
            takeWhile(((processos: any ) => {
                this.processosTreinamento = processos
                if(processos[0].dataFim != null ){
                    this.getModelTreinadoMetricas(processos[0].uuidModel)
                    return false
                }
                return true
            }))
        ).subscribe( (response:any) => {})
    }

    iniciarTreinamento(){

        this.visaopfModelService.startTrain().subscribe((resp:any) =>{
            if(resp){
                this.updateProcessoTreinamento(resp)

            }
        })

    }

    getMetricsDatasetTrain(){
        this.visaopfModelService.getDatasetMetrica().subscribe((resp:any) =>{
            if(resp){
                this.updateDataset(resp)
            }
        })
    }

    updateDataset(dataset){
        this.datasetMetrica = dataset.datasetMetricas
        var backgroudcolors = this.getBackgroudColorDataset(this.datasetMetrica.nomeComponentes)
        this.data = {
            labels: this.datasetMetrica.nomeComponentes,
            datasets: [{ data: this.datasetMetrica.qtdComponentes,
                         backgroundColor: backgroudcolors,
                         hoverBackgroundColor: backgroudcolors }]
        };
    }

    qtdTotalComponentes(){
        var total = 0
        for(var qtd of this.datasetMetrica.qtdComponentes){
            total += qtd
        }
        return total
    }

    getBackgroudColorDataset(nomesComponentes){
        var backgroudcolors = []
        for(var nome of nomesComponentes){
            backgroudcolors.push(this.colorByTipo(nome))
        }
        return backgroudcolors
    }


    colorByTipo(tipo){
        switch(tipo.toLowerCase()){
            case "campo":{
                return '#14f985'
            }
            case "dropdown":{
                return'#FFC107'
            }
            case "incluir":{
                return'#73D2FF'
            }
            case "editar":{
                return'#AD01C1'
            }
            case "excluir":{
                return'#D2691E'
            }
            case "visualizar":{
                return'#6495ED'
            }
            case "exportar":{
                return'#BDB76B'
            }
            case "radio button":{
                return'#91908d'
            }
            case "checkbox":{
                return "#EF7C8E"
            }

        }
    }


    showInfoMsg(msg):void{
        this.msgs = []
        this.msgs.push({ severity: 'info', summary: 'Info ', detail: msg })
    }

    showSucessMsg(msg):void{
        this.msgs = []
        this.msgs.push({ severity: 'success', summary: 'Sucessso ', detail: msg })
    }

    showErrorMsg(msg):void{
        this.msgs = []
        this.msgs.push({ severity: 'error', summary: 'Erro ', detail: msg })
    }
}
