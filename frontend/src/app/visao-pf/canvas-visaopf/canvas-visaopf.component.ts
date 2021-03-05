import {Component, Input, ViewChild, OnInit, Renderer2, ElementRef } from '@angular/core'
import { fromEvent } from 'rxjs'
import { Message } from 'primeng/api'
import { switchMap, takeUntil, pairwise } from 'rxjs/operators'
import {Componente} from './canvas-visaopf.model'
import {CanvasService} from './canvas-visaopf.service'

@Component({
    selector: 'app-canvas-visaopf',
    templateUrl: './canvas-visaopf.component.html',
    styleUrls: ['./canvas-visaopf.component.scss'],
})

export class CanvasVisaopfComponent implements OnInit {
    @ViewChild('canvas', { static: true }) canvas: any
    @Input() imageUrl:any
    @Input() imageHeight:any
    @Input() imageWidth:any
    @Input() canvasWidth:any
    @Input() canvasHeight:any
    @Input() toolbar=false
    @Input() components: Array<Componente>
    @Input() tipos: Array<any>
    @Input() telaID:string


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
    static readonly TIMEOUTCANVAS = 1500

    constructor(private service:CanvasService, private renderer: Renderer2, private elementRef: ElementRef ){

    }

    ngOnInit(): void {
        this.startCanvas()
        this.getEventClickPosition()
    }

    tooltipPosition(comp){
        this.componentTooltip = comp
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

    clickInComponente(initPos){
        this.msgs = []
        var comp = this.findComponenteByPosition(initPos)
        console.log(comp)
        if(comp){
            this.componente = comp
            this.dialogComponent = true
        }
    }

    findComponenteByPosition(clickposition):any{
        return this.components.filter(component => this.isClickInsideComponent(component, clickposition))[0]
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
            this.saveNewComponent()
        }else{
            this.updateComponent()
        }
        this.draw()
        setTimeout(e => this.dialogComponent=false, 850)

    }

    updateComponent(){
        if(this.componente){
            this.service.updateComponent(this.componente).subscribe( () => {
                this.showSucessMsg('Atualizado')
            })
        }
    }

    cancelMark(){
        this.draw()
        this.componente = new Componente()
    }

    removeComponent(componente){
        const index = this.components.indexOf(componente)
        if(index !=-1){
            this.components.splice(index, 1)
            this.service.deleteComponent(this.telaID,componente.id).subscribe( (resp:any) =>{
                this.components=resp.componentes
                this.showSucessMsg('Componente removido!')
            })
        }

        this.dialogComponent = false
        this.draw()
        this.componente = new Componente()
    }

    saveNewComponent(){
        if(this.componente.coordenada.xmax == undefined){ this.showErrorMsg('É necessário marcar o Componente!');  return}
        if(this.componente.tipo == undefined){ this.showErrorMsg('É necessário informar o Tipo do Componente!');  return}
        if(this.componente.nome == undefined){this.showErrorMsg('É necessário informar o Nome para o Componente!');  return}
        if(this.componente.descricao == undefined){this.showErrorMsg('É necessário informar uma descrição para o Componente!');  return}

        this.dialogComponent = false
        this.markDisable = false
        this.service.setComponenteTela(this.telaID, this.componente).subscribe( (resp:any) => {
            this.components=resp.componentes
            this.draw()
        })

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
        this.canvas = this.canvas.nativeElement
        this.ctx = this.canvas.getContext('2d')
        this.image = new Image(this.canvasWidth, this.canvasHeight)
        this.image.onload = setTimeout(e => this.draw(), CanvasVisaopfComponent.TIMEOUTCANVAS)
        this.image.src = this.imageUrl
        this.proporcaoW = this.imageWidth/this.canvasWidth
        this.proporcaoH = this.imageHeight/this.canvasHeight
    }

    draw(){
        this.ctx.drawImage(this.image, 0, 0, this.canvasWidth, this.canvasHeight)
        this.drawComponents()
    }

    drawComponents(){
        this.ctx.fillStyle = "transparent"
        this.ctx.lineWidth = 5
        for(var comp of this.components){
            this.ctx.strokeStyle = this.colorByTipo(comp.tipo)
            this.ctx.strokeRect(comp.coordenada.xmin/this.proporcaoW, comp.coordenada.ymin /this.proporcaoH, (comp.coordenada.xmax - comp.coordenada.xmin )/this.proporcaoW , (comp.coordenada.ymax - comp.coordenada.ymin)/this.proporcaoH)
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

