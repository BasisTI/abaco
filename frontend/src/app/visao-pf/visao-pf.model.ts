export class Visaopf{
    showProcess:boolean = true
    atualizar:boolean
    processosContagem:any
    qtdFinalizados:number = 0
    tela: Tela = new Tela()
    telaResult:any
    uuidProcesso:any
    tiposComponents:Array<any>
    canvasWidth=1300
    canvasHeight=550
    proporcaoW: any
    proporcaoH: any
    componentTooltip:any
    tooltip: HTMLElement
    cenario: Cenario = new Cenario()
}

export class Cenario{
    public id: string
    public analise:any
    public nome:string
    public telas: Array<Tela> = []
    public telasResult: Array<any> = []
    public itenContagem: Array<any>
}

export class Tela{
    public id: string
    public originalImageName:string
    public tipo:string
    public imagem: File
    public size:any
    public bucketName: any
    public dataUrl:any
    public componentes: Array<Componente> = []
}

export class Componente{
    public id: string
    public nome:string
    public descricao: string
    public tipo: string
    public score:number
    public color: string
    public coordenada=new Coordenada()
}

export class Coordenada{
    public id: string
    public xmin:number
    public xmax: number
    public ymin: number
    public ymax:number

    setCoordenadas(xmin, ymin, xmax, ymax ){
        this.xmin=parseInt(xmin)
        this.ymin=parseInt(ymin)
        this.xmax=parseInt(xmax)
        this.ymax=parseInt(ymax)
    }
}

