import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Visaopf, Tela } from './visao-pf.model'
import { VisaoPfService } from "../visao-pf/visao-pf.service"
import { switchMap,takeWhile } from 'rxjs/operators'
import { interval, from } from 'rxjs';
import { Message } from 'primeng/api'


@Component({
  selector: 'app-visao-pf',
  templateUrl: './visao-pf.component.html',
  styleUrls: ['./visao-pf.component.scss']
})
export class VisaoPfComponent implements OnInit {


    msgs: Message[] = []
    visaopf: Visaopf = new Visaopf();
    routeState:any
    data:any
    idTela:any

    constructor(private activedRoute: ActivatedRoute, private router: Router, private visaoPfService: VisaoPfService) {
        this.idTela = this.activedRoute.snapshot.paramMap.get('idTela')
        if(this.idTela){
            this.visaopf.telaResult = this.visaoPfService.getTela(this.idTela).subscribe( resp => {
                this.visaopf.telaResult = resp

            })
        }

        if (this.router.getCurrentNavigation().extras.state) {
            this.routeState = this.router.getCurrentNavigation().extras.state;
        }

    }

    ngOnInit(): void {
        this.getTipos()
    }

    continuarContagem(){
        this.visaoPfService.getTela(this.visaopf.telaResult.id).subscribe((resp:any) => {
            if(resp){
                this.router.navigate([`analise/${this.routeState.idAnalise}/funcao-dados`], {
                    state: {
                        isEdit : this.routeState.isEdit,
                        idAnalise : this.routeState.idAnalise,
                        seletedFuncaoDados : this.routeState.seletedFuncaoDados,
                        telaResult : JSON.stringify(resp),
                        dataUrl : JSON.stringify(this.visaopf.cenario.telas[0].dataUrl),
                        telasResult: JSON.stringify(this.visaopf.cenario.telasResult),
                    }

                })
            }
        })
    }

    detectarComponentes(){

        if(this.visaopf.tela == undefined ){ this.showErrorMsg('É necessário imagens para a detecção de componentes!'); return}

        this.visaoPfService.sendComponentDetection(this.visaopf).subscribe(uuid =>{
            if(uuid){
                this.updateProcessos(uuid)
                this.visaopf.showProcess = false
            }
        })
    }

    updateProcessos(uuidProcesso){
        var qtd=0
        var qtdAux=0
        interval(2100).pipe(
            switchMap(() => from(this.visaoPfService.getProcessoContagem(uuidProcesso))),
            takeWhile(((response: any ) => {
                this.visaopf.atualizar = false
                if(response){
                    this.showInfoMsg('Atualizando...')
                    this.visaopf.processosContagem = response
                    qtd=0
                    for(const processo of response){
                        if((processo.dataFim == null) ){
                            this.visaopf.atualizar = true
                        }else{
                            qtd++
                            if(qtd > qtdAux ){
                                qtdAux = qtd
                                this.visaopf.qtdFinalizados = Math.trunc( (qtd*100)/response.length )
                                this.visaopf.uuidProcesso =processo.uuidProcesso
                                this.visaoPfService.getTelaByUuid(processo.uuidImagem).subscribe((res:any) => {
                                    this.visaopf.telaResult = res
                                    this.visaopf.cenario.telasResult.push(res)
                                })
                            }
                        }
                    }

                    if(this.visaopf.atualizar==false){
                        this.showSucessMsg('Contagem concluída.')
                    }
                    return this.visaopf.atualizar
                }
            }))
        ).subscribe( (response:any) => {})
    }

    addTela(event){
        if(this.visaopf.cenario.telas.length==0){
            var tela
            for(let file of event.files){
                let fileReader = new FileReader()
                fileReader.readAsDataURL(file)
                fileReader.onload = (reader:any) => {
                    tela = new Tela()
                    tela.originalImageName=file.name
                    tela.size= file.size
                    tela.imagem = file
                    tela.dataUrl = fileReader.result
                    this.visaopf.cenario.telas.push(tela)
                }
            }
        }else{
            var newtela
            for(const file of event.files){
                let index = this.visaopf.cenario.telas.map( tela => tela['originalImageName']).indexOf(file.name)
                if(index === -1){
                    let fileReader = new FileReader()
                    fileReader.readAsDataURL(file)
                    fileReader.onload = (reader:any) => {
                        newtela = new Tela()
                        newtela.originalImageName=file.name
                        newtela.size= file.size
                        newtela.imagem = file
                        newtela.dataUrl = fileReader.result
                        this.visaopf.cenario.telas.push(newtela)
                    }
                }
            }
        }
    }

    getTipos(){
        this.visaoPfService.getTiposComponent().subscribe( (resp:any) => {
            const tipos = new Array<any>()
            for(let x=0; x< resp.length; x+=1){
                tipos.push( {label: resp[x], value: resp[x].toLowerCase() } )
            }
            this.visaopf.tiposComponents = tipos
        })
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
