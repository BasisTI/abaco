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
