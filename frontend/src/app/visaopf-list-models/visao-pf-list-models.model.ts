export class ModeloTreinadoView {
    uuid:any
    dataTreinamento:any
    totalLoss:number
    stepsTreinamento:number
    bucket:string
    id:number
    constructor(uuid:any, bucket:string, dataTreinamento:any, totalLoss:number, stepsTreinamento:number, id:number){
        this.uuid = uuid
        this.bucket = bucket
        this.dataTreinamento = dataTreinamento
        this.totalLoss = totalLoss
        this.stepsTreinamento = stepsTreinamento
        this.id = id
    }
}
