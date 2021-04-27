import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AutoCompleteMultipleComponent } from '@nuvem/primeng-components';
import { AutoCompleteCustomComponent } from '@nuvem/primeng-components/lib/crud/components/auto-complete/auto-complete-custom.component';
import { AutoComplete } from 'primeng';
import { AlrService } from 'src/app/alr/alr.service';
import { DerService } from 'src/app/der/der.service';
import { FuncaoDados } from 'src/app/funcao-dados';
import { FuncaoDadosService } from 'src/app/funcao-dados/funcao-dados.service';
import { FuncaoTransacao } from 'src/app/funcao-transacao';
import { FuncaoTransacaoService } from 'src/app/funcao-transacao/funcao-transacao.service';
import { RlrService } from 'src/app/rlr/rlr.service';
import { Der } from '../../der/der.model';
import { DerTextParser, ParseResult } from '../der-text/der-text-parser';
import { DuplicatesResult, StringArrayDuplicatesFinder } from '../string-array-duplicates-finder';
import { DerChipItem } from './der-chip-item';


@Component({
    selector: 'app-analise-der-chips',
    templateUrl: './der-chips.component.html'
})
export class DerChipsComponent implements OnChanges, OnInit {

    @Input()
    values: DerChipItem[] = [];

    @Input()
    relacionarDers = false;

    @Input()
    tipoFuncao: string;

    @Input()
    tipoChip: string;

    @Input()
    idSistema: number;

    @Output()
    valuesChange: EventEmitter<DerChipItem[]> = new EventEmitter<DerChipItem[]>();

    @Output()
    dersReferenciadosEvent: EventEmitter<Der[]> = new EventEmitter<Der[]>();

    duplicatesResult: DuplicatesResult;
    mostrarDialogAddMultiplos = false;
    addMultiplosTexto = '';

    validaMultiplos = false;
    validaMultiplosRegistrados = false;
    funcaoTransacao: FuncaoTransacao;
    tamanhoChip = false;
    chipRepetido = false;

    mostrarDialogEdicao = false;
    textoEdicao = '';
    indexChipEmEdicao: number;

    options: DerChipItem[] = [];
    listOptions: DerChipItem[] = [];
    listFuncoesDados: FuncaoDados[] = [];
    listFuncoesTransacoes: FuncaoTransacao[] = [];

    canEnter: boolean;

    @ViewChild(AutoComplete) component: AutoComplete;


    constructor(
        private derService: DerService,
        private rlrService: RlrService,
        private alrService: AlrService
    ) { }

    ngOnInit() {
    }

    getLabel(label) {
        return label;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.values) {
            this.values.sort((a, b) => a.id - b.id);
        }
    }


    onAddValue(value: string) {
        // removendo o adicionado pelo primeng no keydown de enter
        this.values.pop();
        this.addItem(new DerChipItem(undefined, value));
    }

    pressEnter(event) {
        if (event.code === "Enter" || event.code === "NumpadEnter") {
            if (this.canEnter) {
                if (event.target.value.length > 0) {
                    const valores: string[] = this.values.map(item => item.text.toLowerCase());
                    if (event.target.value.length >= 50) {
                        this.chipRepetido = false;
                        return this.tamanhoChip = true;
                    }
                    if (valores.indexOf(event.target.value.toLowerCase()) === -1) {
                        this.values.push(new DerChipItem(undefined, event.target.value));
                        this.valuesChange.emit(this.values);
                        event.target.value = "";
                        this.chipRepetido = false;
                        this.tamanhoChip = false;
                    } else {
                        this.tamanhoChip = false;
                        this.chipRepetido = true;
                    }
                }
            }
        }
    }

    search(event) {
        this.canEnter = true;
        switch(this.tipoChip){
            case 'DER':
                switch(this.tipoFuncao){
                    case 'FD':
                        this.derService.getDersFuncaoDadosByNomeSistema(event.query, this.idSistema).subscribe(response => {
                            this.listOptions = response.map(item => new DerChipItem(undefined, item.nome));
                            this.options = this.listOptions.filter(item =>{
                                return this.values.find(value => value.text === item.text) === undefined;
                            });
                        });

                        break;
                    case 'FT':
                        this.derService.getDersFuncaoTransacaoByNomeSistema(event.query, this.idSistema).subscribe(response => {
                            this.listOptions = response.map(item => new DerChipItem(undefined, item.nome));
                            this.options = this.listOptions.filter(item =>{
                                return this.values.find(value => value.text === item.text) === undefined;
                            });
                        })
                        break;
                }
                break;
            case 'RLR':
                this.rlrService.getRlrsByNomeSistema(event.query, this.idSistema).subscribe(response => {
                    this.listOptions = response.map(item => new DerChipItem(undefined, item.nome));
                    this.options = this.listOptions.filter(item => {
                        return this.values.find(value => value.text === item.text) === undefined;
                    });
                })
                break;
            case 'ALR':
                this.alrService.getAlrsByNomeSistema(event.query, this.idSistema).subscribe(response => {
                    this.listOptions = response.map(item => new DerChipItem(undefined, item.nome));
                    this.options = this.listOptions.filter(item => {
                        return this.values.find(value => value.text === item.text) === undefined;
                    });
                })
                break;
        }
    }

    limparCampo(event) {
        event.target.value = "";
        this.chipRepetido = false;
        this.tamanhoChip = false;
    }

    selecionar(object) {
        this.canEnter = false;
        this.valuesChange.emit(this.values);
        this.chipRepetido = false;
        this.tamanhoChip = false;
    }

    deselecionar(object) {
        this.valuesChange.emit(this.values);
    }

    private addItem(derChipItem: DerChipItem) {
        if (this.values !== undefined && this.values.length <= 255) {
            const valores: string[] = this.values.map(chipItem => chipItem.text);
            if (derChipItem.text.length >= 50) {
                this.chipRepetido = false;
                return this.tamanhoChip = true;
            }
            if (valores.indexOf(derChipItem.text) === -1) {
                this.values.push(derChipItem);
                this.valuesChange.emit(this.values);;
                this.tamanhoChip = false;
                this.chipRepetido = false;
            } else {
                this.tamanhoChip = false;
                this.chipRepetido = true;
            }
        }
    }

    private recalculaDuplicatas() {
        const valores: string[] = this.values.map(chipItem => chipItem.text);
        this.duplicatesResult = StringArrayDuplicatesFinder.find(valores);
    }

    onRemove(value: string) {
        this.valuesChange.emit(this.values);
    }

    showTotal(): string {
        let total = 0;
        if (this.values) {
            if (this.values.length === 1 && !isNaN(this.values[0].text as any)) {
                total = Number(this.values[0].text);
            } else {
                total = this.values.length;
            }
        }
        return 'Total: ' + total;
    }

    deveMostrarDuplicatas(): boolean {
        if (!this.duplicatesResult) {
            return false;
        }
        return this.duplicatesResult.temDuplicatas();
    }

    abrirDialogAddMultiplos() {
        this.mostrarDialogAddMultiplos = true;
    }

    adicionarMultiplos() {
        this.validaMultiplos = false;
        this.validaMultiplosRegistrados = false;

        if (this.verificaMultiplosDuplicados(this.addMultiplosTexto)) {
            if (this.verificaMultiplosCadastrados(this.addMultiplosTexto)) {
                this.values = this.values.concat(this.converteMultiplos());
                this.valuesChange.emit(this.values);
                this.fecharDialogAddMultiplos();
                this.validaMultiplos = false;
                this.validaMultiplosRegistrados = false;
            } else {
                this.validaMultiplosRegistrados = true;
            }
        } else {
            this.validaMultiplos = true;
        }
    }

    /**
     *
     */
    limparMultiplos() {
        this.values = [];
    }

    private verificaMultiplosDuplicados(texto: string): boolean {
        if (this.values === undefined) {
            this.values = [];
        }

        let splitString: string[] = texto.split('\n');
        let recebeSplit = {};
        let result = [];

        if (splitString) {
            splitString.forEach(item => {
                if (!recebeSplit[item]) {
                    recebeSplit[item] = 0;
                }
                recebeSplit[item] += 1;
            });

            for (let prop in recebeSplit) {
                if (recebeSplit[prop] >= 2) {
                    result.push(prop);
                }
            }
        }

        if (!result.length) {
            return true;
        } else {
            return false;
        }
    }

    verificaMultiplosCadastrados(nome: string): boolean {
        if (this.values === undefined) {
            this.values = [];
        }

        let splitString: string[] = nome.split('\n');
        let controle = true;

        for (let indexValues = 0; indexValues < this.values.length; indexValues++) {
            for (let indexSplitString = 0; indexSplitString < splitString.length; indexSplitString++) {
                if (this.values[indexValues].text === splitString[indexSplitString]) {
                    controle = false;
                }
            }
        }
        return controle;
    }

    private converteMultiplos(): DerChipItem[] {
        const parseResult: ParseResult = DerTextParser.parse(this.addMultiplosTexto);
        if (parseResult.textos) {
            return parseResult.textos.map(txt => new DerChipItem(undefined, txt));
        } else {
            return [new DerChipItem(undefined, parseResult.numero.toString())];
        }
    }

    fecharDialogAddMultiplos() {
        this.validaMultiplos = false;
        this.validaMultiplosRegistrados = false;
        this.mostrarDialogAddMultiplos = false;
        this.addMultiplosTexto = '';
    }

    doubleClickChip(chipClicado: DerChipItem) {
        this.indexChipEmEdicao = this.values.indexOf(chipClicado);
        this.textoEdicao = this.cloneString(chipClicado.text);
        this.mostrarDialogEdicao = true;
    }

    private cloneString(str: string): string {
        return (' ' + str).slice(1);
    }

    editarChip() {
        const chipEmEdicao: DerChipItem = this.values[this.indexChipEmEdicao];
        chipEmEdicao.text = this.textoEdicao;
        this.fecharDialogEdicao();
    }

    fecharDialogEdicao() {
        this.textoEdicao = '';
        this.mostrarDialogEdicao = false;
    }

    funcaoDadosReferenciada(name: string) {
        this.addItem(new DerChipItem(undefined, name));
    }

    dersReferenciados(ders: Der[]) {
        this.dersReferenciadosEvent.emit(ders);
    }

}


// <p-chips id="chips"
// [(ngModel)]="values"
// addOnTab="true"
// addOnBlur="true"
// (onAdd)="onAddValue($event.value)"
// (onRemove)="onRemove($event.value)">

// <ng-template let-item pTemplate="item">
//     <span class="ui-chips-token-label ng-star-inserted" (dblclick)="doubleClickChip(item)">
//         {{ item.text }}
//     </span>
// </ng-template>
// </p-chips>


