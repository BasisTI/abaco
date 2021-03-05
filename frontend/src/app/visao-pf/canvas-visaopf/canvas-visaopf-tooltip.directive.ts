import { Directive, Input, ElementRef, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[tooltip]'
})

export class CanvasVisaopfTooltipDirective implements OnInit{
    @Input() component:any
    @Input() proporcaoW: number
    @Input() proporcaoH: number
    imgPos: any
    tooltip: HTMLElement;
    position: any

    constructor(private el: ElementRef, private renderer: Renderer2) {}

    ngOnInit() {
        if(this.component != undefined){
            this.imgPos = this.getImagePos()
            this.position = this.component.coordenada
            this.show()
        }
        this.hide()
    }

    show() {
        this.create();
        this.setPosition();
    }

    hide() {
        if(this.tooltip){
            this.renderer.removeClass(this.tooltip, 'tooltip')
            window.setTimeout(() => {
                this.renderer.removeChild(document.body, this.tooltip)
                this.tooltip = null
            }, 500)
        }
    }

    create() {
        this.hide()
        this.tooltip = this.renderer.createElement('span')
        this.renderer.addClass(this.tooltip, 'tooltip')
    }

    setPosition() {
        var clickPosition = [ (this.position.xmin/this.proporcaoW)+ this.imgPos[0] , (this.position.ymin/this.proporcaoH)+ this.imgPos[1] ]
        this.renderer.appendChild(this.el.nativeElement, this.tooltip)
        let present = this.el.nativeElement.classList.contains('tooltip');
        if(present){
            var left = clickPosition[0]
            var top = clickPosition[1]
            this.renderer.setStyle(this.el.nativeElement, 'left', `${left}px`)
            this.renderer.setStyle(this.el.nativeElement, 'top', `${top}px`)
        }
    }

    getImagePos():Array<number>{
        return this.findPosition(document.getElementById("canvas"))
    }

    findPosition(oElement):Array<number>{
        var elementPosition
        if( typeof( oElement.offsetParent ) != "undefined" ){
            for( var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent ){
                posX += oElement.offsetLeft;
                posY += oElement.offsetTop;
            }
            elementPosition = [ posX, posY ];
        }else {
            elementPosition = [ oElement.x, oElement.y ];
        }
        return elementPosition
    }
}
