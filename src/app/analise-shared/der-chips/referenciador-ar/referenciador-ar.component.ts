import { TranslateService } from '@ngx-translate/core';
import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnDestroy,
} from '@angular/core';

import {AnaliseSharedDataService} from '../../../shared/analise-shared-data.service';
import {Analise} from '../../../analise/analise.model';
import { AnaliseService } from './../../../analise/analise.service';
import {FuncaoDados} from '../../../funcao-dados/funcao-dados.model';
import {Der} from '../../../der/der.model';
import {Subscription} from 'rxjs/Subscription';
import {ResponseWrapper} from '../../../shared';
import {BaselineService} from '../../../baseline';

@Component({
    selector: 'app-analise-referenciador-ar',
    templateUrl: './referenciador-ar.component.html'
})
export class ReferenciadorArComponent implements OnInit, OnDestroy {

    @Output()
    dersReferenciadosEvent: EventEmitter<Der[]> = new EventEmitter<Der[]>();

    @Output()
    funcaoDadosReferenciadaEvent: EventEmitter<string> = new EventEmitter<string>();

    private subscriptionAnaliseCarregada: Subscription;

    funcoesDados: FuncaoDados[] = [];

    funcoesDadosCache: FuncaoDados[] = [];

    ders: Der[] = [];

    idAnalise: number;

    mostrarDialog = false;

    funcaoDadosSelecionada: FuncaoDados;

    dersReferenciados: Der[] = [];

    valorVariavel: string;

    constructor(
        private analiseSharedDataService: AnaliseSharedDataService,
        private analiseService: AnaliseService,
        private baselineService: BaselineService,
        private translate: TranslateService
    ) {
    }

    getLabel(label) {
        let str: any;
        this.translate.get(label).subscribe((res: string) => {
            str = res;
        }).unsubscribe();
        return str;
    }

    ngOnInit() {
        // TODO quais eventos observar?
        // precisa de um evento de funcaoDados adicionada  
        this.subscribeAnaliseCarregada();     
    }

    private getFuncoesDados(): FuncaoDados[] {
        return this.analise.funcaoDados;
    }

    private get analise(): Analise {
        return this.analiseSharedDataService.analise;
    }

    private getAnalisesBaseline() {
        this.analiseService.findAllBaseline().subscribe(res => {
            let analises = this.analiseService.convertJsonToAnalise(res);
            this.carregarFuncaoDadosBaseline(analises);
        });
    }

    public carregarFuncaoDadosBaseline(analises: Analise[]) {

        let funcoesDadosBaseline: FuncaoDados[] = [];

        for (let analise of analises) {
            let fds: FuncaoDados[] = analise.funcaoDados;
            
            for (let fd of fds) {
                funcoesDadosBaseline.push(fd);
            }
        }

        this.funcoesDados = this.funcoesDados.concat(funcoesDadosBaseline);
        //this.funcoesDados = funcoesDadosBaseline;

    }

    private subscribeAnaliseCarregada() {
        
        this.subscriptionAnaliseCarregada = this.analiseSharedDataService.getLoadSubject().subscribe(() => {
            
            this.funcoesDadosCache = this.analiseSharedDataService.analise.funcaoDados;

            this.baselineService.analiticosFuncaoDados(
                this.analiseSharedDataService.analise.sistema.id).subscribe((res: ResponseWrapper) => {
                this.funcoesDados = res.json;

                this.funcoesDados.concat(this.funcoesDadosCache);
                if (this.funcoesDados.length !== 0) {
                    for (const funcoes of this.funcoesDadosCache) {
                        if (this.funcoesDados.indexOf(funcoes) === -1) {
                            this.funcoesDados.push(funcoes);
                        }
                    }
                } else {
                    this.funcoesDados = this.funcoesDadosCache;
                }
            });
        });
    }


    findIndexToUpdate(newItem) {
        return newItem.id === this;
    }

    abrirDialog() {
        this.funcoesDados = [];
        this.funcoesDados = this.getFuncoesDados();
        this.getAnalisesBaseline();
        //if (this.habilitarBotaoAbrirDialog()) {
        this.subscribeAnaliseCarregada();
        this.mostrarDialog = true;
        //}
    }

    habilitarBotaoAbrirDialog(): boolean {
        /*if (!this.funcoesDados) {
            return false;
        }
        return this.funcoesDados.length > 0;*/
        return true;
    }

    funcoesDadosDropdownPlaceholder(): string {
        return this.getLabel('Analise.Analise.Mensagens.msgSelecioneFuncaoDados');
    }

    funcaoDadosSelected(fd: FuncaoDados) {
        this.funcaoDadosSelecionada = fd;
        this.ders = fd.ders;
    }

    dersMultiSelectedPlaceholder(): string {
        if (!this.funcaoDadosSelecionada) {
            return this.getLabel('Analise.Analise.Mensagens.msgSelecioneFuncaoDadosParaSelecionarDERsReferenciar');
        } else if (this.funcaoDadosSelecionada) {
            return this.getLabel('Analise.Analise.Mensagens.msgSelecioneQuaisDERsReferenciar');
        }
    }

    relacionar() {
        if (this.dersReferenciados) {
            this.dersReferenciados.forEach(der => {
                der.id = undefined;
            });
        }
        this.dersReferenciadosEvent.emit(this.dersReferenciados);
        // XXX vai precisar relacionar qual funcao de dados foi relacionada?
        this.funcaoDadosReferenciadaEvent.emit(this.funcaoDadosSelecionada.name);
        this.fecharDialog();
    }

    fecharDialog() {
        this.resetarCampos();
        this.mostrarDialog = false;
    }

    private resetarCampos() {
        this.funcaoDadosSelecionada = undefined;
        this.ders = [];
        this.dersReferenciados = [];
    }

    ngOnDestroy() {

    }

}
