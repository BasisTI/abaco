import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges
} from '@angular/core';

import {DerChipItem} from './der-chip-item';
import {DerChipConverter} from './der-chip-converter';

import {DerTextParser, ParseResult} from '../der-text/der-text-parser';

import {
    DuplicatesResult,
    StringArrayDuplicatesFinder
} from '../string-array-duplicates-finder';
import {Der} from '../../der/der.model';

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

    mostrarDialogEdicao = false;
    textoEdicao = '';
    indexChipEmEdicao: number;

    ngOnChanges(changes: SimpleChanges) {
        // TODO precisa?
    }

    onAddValue(value: string) {
        // removendo o adicionado pelo primeng no keydown de enter
        this.values.pop();
        this.addItem(new DerChipItem(undefined, value));
    }

    private addItem(derChipItem: DerChipItem) {

        const valores: string[] = this.values.map(chipItem => chipItem.text);

        if (valores.indexOf(derChipItem.text) == -1) {
            this.values.push(derChipItem);
            this.valuesChanged();
        }
    }

    private valuesChanged() {
        this.recalculaDuplicatas();
        this.valuesChange.emit(this.values);
    }

    private recalculaDuplicatas() {
        const valores: string[] = this.values.map(chipItem => chipItem.text);
        this.duplicatesResult = StringArrayDuplicatesFinder.find(valores);
    }

    onRemove(value: string) {
        this.valuesChanged();
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
        this.values = this.values.concat(this.converteMultiplos());
        this.valuesChanged();
        this.fecharDialogAddMultiplos();
    }

    /**
     *
     */
    limparMultiplos() {
        this.values = [];
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
