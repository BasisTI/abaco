import {Component, Input, ViewChild, OnInit, Renderer2, ElementRef } from '@angular/core'
import { fromEvent, interval, from } from 'rxjs'
import { Message } from 'primeng/api'
import { switchMap, takeUntil, pairwise, takeWhile } from 'rxjs/operators'
import {Componente} from './canvas-visaopf.model'
import {CanvasService} from './canvas-visaopf.service'

@Component({
    selector: 'app-canvas-visaopf',
    templateUrl: './canvas-visaopf.component.html',
    styleUrls: ['./canvas-visaopf.component.scss'],
})

export class CanvasVisaopfComponent implements OnInit {
    @ViewChild('canvas', { static: true }) canvas: any

    @Input() telasResult:Array<any>
    @Input() canvasWidth:any
    @Input() canvasHeight:any
    @Input() toolbar=false
    @Input() tipos: Array<any>

    tela:any
    imageName: string
    private ctx: CanvasRenderingContext2D
    markDisable=false
    image:any
    componente = new Componente()
    componentTooltip:any
    clickPosition:any
    proporcaoW:number
    proporcaoH:number
    dialogComponent=false
    showTooltip=false
    msgs: Message[] = []
    dialogRLR=false
    isRLR:boolean
    static readonly TIMEOUTCANVAS = 1500

    constructor(private service:CanvasService, private renderer: Renderer2, private elementRef: ElementRef ){

    }

    ngOnInit(): void {
        this.canvas = this.canvas.nativeElement
        this.ctx = this.canvas.getContext('2d')
        this.tela = this.telasResult[0]
        this.tela.rlrName = undefined
        this.imageName=this.tela.originalImageName.split("@")[1]
        this.startCanvas()
        this.getEventClickPosition()
    }

    sendComponentOCR(){
        this.showInfoMsg("Iniciando extração de texto.")
        this.service.sendOCR(this.componente.coordenada, this.tela.bucketName, this.tela.originalImageName).subscribe(idProcesso =>{
            if(idProcesso){
                this.componente.nome = undefined
                this.updateProcessos(idProcesso)
            }
        })
    }

    sendRLRtoOCR(){
        if(this.markDisable ){
            this.tela.rlrCoordenada = this.componente.coordenada
        }
        if(this.tela.rlrCoordenada == undefined){ this.showErrorMsg('É necessário marcar o RLR(TR)!');  return}
        this.showInfoMsg("Iniciando extração de texto.")
        this.service.sendOCR(this.tela.rlrCoordenada, this.tela.bucketName, this.tela.originalImageName).subscribe(idProcesso =>{
            if(idProcesso){
                this.tela.rlrName = undefined
                this.updateProcessos(idProcesso)
            }
        })
    }

    realizaOCR(isRLR){
        this.isRLR = isRLR
        if(isRLR){
            this.sendRLRtoOCR()
        }else{
            this.sendComponentOCR()
        }

    }

    updateProcessos(idProcesso){
        interval(2100).pipe(
            switchMap(() => from(this.service.getProcessoOCR(idProcesso))),
            takeWhile(((processo: any ) => {
                if(processo.dataFim != null ){
                    if(this.isRLR){
                        this.tela.rlrName = processo.resultadoOCR
                    }else{
                        this.componente.nome = processo.resultadoOCR
                    }
                    this.showSucessMsg('Texto Extraído.')
                    return false
                }
                return true
            }))
        ).subscribe( (response:any) => {})
    }

    tooltipPosition(comp){
        this.componentTooltip = comp
    }

    paginatorCanvas(event){
        this.tela = this.telasResult[event.page]
        this.imageName=this.tela.originalImageName.split("@")[1]
        this.startCanvas()
    }

    getEventClickPosition(){
        fromEvent(this.canvas, 'mousedown').subscribe( res => {
            this.clickPosition = res
            const rect = this.canvas.getBoundingClientRect()
            const initPos = {
                x: this.clickPosition.clientX - rect.left,
                y: this.clickPosition.clientY - rect.top
            }
            if(!this.markDisable){
                this.clickInComponente(initPos)
                this.clickInRlr(initPos)
            }
        })

        fromEvent(this.canvas, 'mousemove').subscribe( res =>{
            if(!this.markDisable){
                this.showTooltip = false
                this.clickPosition = res
                const rect = this.canvas.getBoundingClientRect()
                const initPos = {
                    x: this.clickPosition.clientX - rect.left,
                    y: this.clickPosition.clientY - rect.top
                }
                if(!this.dialogComponent){
                    this.showTooltip = true
                    var comp = this.findComponenteByPosition(initPos)
                    this.tooltipPosition(comp)
                }
            }
        })
    }

    clickInRlr(initPos){
        this.msgs = []
        if(this.tela.rlrCoordenada){
            var rlr = this.isClickInsideRlr(initPos, this.tela.rlrCoordenada)
            if(rlr){
                this.dialogRLR = true
            }
        }
    }

    clickInComponente(initPos){
        this.msgs = []
        var comp = this.findComponenteByPosition(initPos)
        if(comp){
            this.componente = comp
            this.dialogComponent = true
        }
    }

    findComponenteByPosition(clickposition):any{
        return this.tela.componentes.filter(component => this.isClickInsideComponent(component, clickposition))[0]
    }

    isClickInsideRlr(position, coordenada){
        if( (position.x*this.proporcaoW ) >= coordenada.xmin && (position.x*this.proporcaoW ) <=  coordenada.xmax && (position.y*this.proporcaoH) >= coordenada.ymin && (position.y*this.proporcaoH) <=  coordenada.ymax){
            return true
        }
        return false
    }

    isClickInsideComponent(component, position): any{
        if( (position.x*this.proporcaoW ) >= component.coordenada.xmin && (position.x*this.proporcaoW ) <=  component.coordenada.xmax && (position.y*this.proporcaoH) >= component.coordenada.ymin && (position.y*this.proporcaoH) <=  component.coordenada.ymax){
            return component
        }
        return undefined
    }

    saveComponent(){
        this.msgs=[]
        if(this.markDisable){

            if(this.saveNewComponent()){
                this.showSucessMsg("Componente salvo. ")
                setTimeout(e => this.dialogComponent=false, 850)
            }
        }else{
            if(this.updateComponent()){
                this.showSucessMsg("Componente atualizado. ")
                setTimeout(e => this.dialogComponent=false, 850)
            }
        }
        this.draw()
    }

    updateComponent(){
        var updated = false
        if(this.componente){
            this.service.updateComponent(this.componente).subscribe( () => {
                this.showSucessMsg('Atualizado')
            })
            updated = true
        }
        return updated
    }

    cancelMark(){
        this.draw()
        this.componente = new Componente()
    }

    removeComponent(componente){
        const index = this.tela.componentes.indexOf(componente)
        if(index !=-1){
            this.tela.componentes.splice(index, 1)
            this.service.deleteComponent(this.tela.id,componente.id).subscribe( (resp:any) =>{
                this.tela.componentes=resp.componentes
                this.showSucessMsg('Componente removido!')
            })
        }
        this.dialogComponent = false
        this.draw()
        this.componente = new Componente()
    }

    saveNewComponent(){
        var saved = false
        if(this.componente.coordenada.xmax == undefined){ this.showErrorMsg('É necessário marcar o Componente!');  return saved}
        if(this.componente.tipo == undefined){ this.showErrorMsg('É necessário informar o Tipo do Componente!');  return saved}
        if(this.componente.nome == undefined && (!(this.componente.tipo in ["visualizar" , "incluir" , "editar" , "excluir"]) )) {this.showErrorMsg('É necessário informar o Nome para o Componente!');  return saved}
        this.markDisable = false
        this.service.setComponenteTela(this.tela.id, this.componente).subscribe( (resp:any) => {
            this.tela.componentes=resp.componentes
            this.draw()
        })
        saved=true
        return saved
    }

    removeRLR(){
        this.tela.rlrCoordenada = undefined
        this.tela.rlrName = undefined
        this.dialogRLR = false
        this.draw()
    }

    saveRLR(){
        if(this.markDisable){
            this.tela.rlrCoordenada = this.componente.coordenada
            this.componente= new Componente()
        }
        if(this.tela.rlrCoordenada == undefined){ this.showErrorMsg('É necessário marcar o RLR(TR)!');  return}
        if(this.tela.rlrName == undefined){this.showErrorMsg('É necessário informar o nome RLR(TR)!');  return }
        this.markDisable = false
        this.dialogRLR = false
        this.draw()
    }

    buttonSaveRLR(){
        this.msgs=[]
        this.dialogRLR = true
    }

    saveMark(){
        this.msgs=[]
        this.dialogComponent = true
    }

    markComponent(){
        this.componente = new Componente()
        this.captureEvents(this.canvas)
    }

    captureEvents(canvasEl: HTMLCanvasElement) {
        fromEvent(canvasEl, 'mousedown').pipe( switchMap((e) => {
            this.clickPosition = e
            return fromEvent(canvasEl, 'mousemove').pipe(
                            takeUntil(fromEvent(canvasEl, 'mouseup')),
                            takeUntil(fromEvent(canvasEl, 'mouseleave')),
                            pairwise()
            )})

        ).subscribe((res: [MouseEvent, MouseEvent]) => {
            const rect = canvasEl.getBoundingClientRect()
            const initPos = {
                x: this.clickPosition.clientX - rect.left,
                y: this.clickPosition.clientY - rect.top
            }
            const currentPos = {
                x: res[1].clientX - rect.left,
                y: res[1].clientY - rect.top
            }

            if(this.markDisable){
                this.drawOnCanvas(initPos, currentPos)
            }
        })
    }

    drawOnCanvas(initPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
        if (!this.ctx) { return  }
        this.ctx.beginPath()
        if (initPos) {
            this.draw()
            this.ctx.strokeStyle = 'black'
            this.ctx.strokeRect(initPos.x, initPos.y,  (initPos.x-currentPos.x)*-1, (initPos.y-currentPos.y)*-1 )
            this.componente.coordenada.setCoordenadas(initPos.x*this.proporcaoW, initPos.y*this.proporcaoH , currentPos.x*this.proporcaoW , currentPos.y*this.proporcaoH)
        }
    }

    startCanvas(){
        this.image = new Image(this.canvasWidth, this.canvasHeight)
        this.image.onload = setTimeout(e => this.draw(), CanvasVisaopfComponent.TIMEOUTCANVAS)
        this.image.src = `/visaopf/component/detection/image/${this.tela.bucketName}/${this.tela.originalImageName}`
        this.proporcaoW = this.tela.width/this.canvasWidth
        this.proporcaoH = this.tela.height/this.canvasHeight

    }

    draw(){
        this.ctx.drawImage(this.image, 0, 0, this.canvasWidth, this.canvasHeight)
        this.drawComponents()
        this.tela.dataUrlResult = this.canvas.toDataURL()
    }

    drawComponents(){
        this.ctx.fillStyle = "transparent"
        this.ctx.lineWidth = 2.5
        for(var comp of this.tela.componentes){
            this.ctx.strokeStyle = this.colorByTipo(comp.tipo)
            this.ctx.strokeRect(comp.coordenada.xmin/this.proporcaoW, comp.coordenada.ymin /this.proporcaoH, (comp.coordenada.xmax - comp.coordenada.xmin )/this.proporcaoW , (comp.coordenada.ymax - comp.coordenada.ymin)/this.proporcaoH)
        }

        if(this.tela.rlrCoordenada){
            this.ctx.strokeStyle = "#FF5722"
            this.ctx.strokeRect(this.tela.rlrCoordenada.xmin/this.proporcaoW, this.tela.rlrCoordenada.ymin /this.proporcaoH, (this.tela.rlrCoordenada.xmax - this.tela.rlrCoordenada.xmin )/this.proporcaoW , (this.tela.rlrCoordenada.ymax - this.tela.rlrCoordenada.ymin)/this.proporcaoH)
        }
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

