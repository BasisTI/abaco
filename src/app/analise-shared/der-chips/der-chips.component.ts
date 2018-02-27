import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { DerChipItem } from './der-chip-item';
import { DerChipConverter } from './der-chip-converter';
import { DuplicatesResult, StringArrayDuplicatesFinder } from '..';

@Component({
  selector: 'app-analise-der-chips',
  templateUrl: './der-chips.component.html'
})
export class DerChipsComponent implements OnChanges {

  @Input()
  values: DerChipItem[] = [];

  @Output()
  valuesChange: EventEmitter<DerChipItem[]> = new EventEmitter<DerChipItem[]>();

  duplicatesResult: DuplicatesResult;

  ngOnChanges(changes: SimpleChanges) {
    // TODO precisa?
  }

  onAddValue(value: string) {
    // removendo o adicionado pelo primeng no keydown de enter
    this.values.pop();
    this.values.push(new DerChipItem(undefined, value));
    this.recalculaDuplicatas();
    this.valuesChange.emit(this.values);
  }

  private recalculaDuplicatas() {
    const valores: string[] = this.values.map(chipItem => chipItem.text);
    this.duplicatesResult = StringArrayDuplicatesFinder.find(valores);
  }

  onRemove(value: string) {
    this.recalculaDuplicatas();
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

}
