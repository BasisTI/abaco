import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { DerChipItem } from './der-chip-item';

@Component({
  selector: 'app-analise-der-chips',
  templateUrl: './der-chips.component.html'
})
export class DerChipsComponent implements OnChanges {

  @Input()
  values: DerChipItem[];

  @Input()
  label: string;

  ngOnChanges(changes: SimpleChanges) {
    // TODO precisa?
  }

  onAddValue(value: string) {
    // removendo o adicionado pelo primeng no keydown de enter
    this.values.pop();
    this.values.push(new DerChipItem(undefined, value));
  }

}
