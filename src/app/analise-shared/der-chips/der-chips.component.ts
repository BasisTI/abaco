import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { DerChipItem } from './der-chip-item';
import { DerTextParser, ParseResult } from '../der-text/der-text-parser';
import { DuplicatesResult, StringArrayDuplicatesFinder } from '../string-array-duplicates-finder';
import { Der } from '../../der/der.model';
import { FuncaoTransacao } from 'src/app/funcao-transacao';


@Component({
    selector: 'app-analise-der-chips',
    templateUrl: './der-chips.component.html'
})
export class DerChipsComponent implements OnChanges {

    @Input()
    values: DerChipItem[] = [];

    @Input()
    relacionarDers = false;

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

    mostrarDialogEdicao = false;
    textoEdicao = '';
    indexChipEmEdicao: number;

    constructor(
    ){}
    
    getLabel(label) {
        return label;
    }

    ngOnChanges(changes: SimpleChanges) {
        // TODO precisa?
    }

    onAddValue(value: string) {
        // removendo o adicionado pelo primeng no keydown de enter
        this.values.pop();
        this.addItem(new DerChipItem(undefined, value));
    }

    private addItem(derChipItem: DerChipItem) {
        if (this.values !== undefined && this.values.length <= 255) {
            const valores: string[] = this.values.map(chipItem => chipItem.text);
            if (valores.indexOf(derChipItem.text) === -1 && derChipItem.text.length <= 50) {
                this.values.push(derChipItem);
                this.valuesChange.emit(this.values);;
                this.tamanhoChip = false;
            }else {
                this.tamanhoChip = true;
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
