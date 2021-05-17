export class ModeloTreinadoView {
    uuid:any
    dataTreinamento:any
    totalLoss:number
    stepsTreinamento:number
    bucket:string
    constructor(uuid:any, bucket:string, dataTreinamento:any, totalLoss:number, stepsTreinamento:number){
        this.uuid = uuid
        this.bucket = bucket
        this.dataTreinamento = dataTreinamento
        this.totalLoss = totalLoss
        this.stepsTreinamento = stepsTreinamento
    }
}
