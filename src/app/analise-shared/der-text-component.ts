import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { ParseResult, DerTextParser } from './der-text-parser';

@Component({
  selector: 'app-analise-der-text',
  templateUrl: './der-text.component.html'
})
export class DerTextComponent {

  @Input()
  // analisar esse value
  value: any;

  @Input()
  label: string;

  parseResult: ParseResult;

  text: string;

  constructor() { }

  textChanged() {
    this.parseResult = DerTextParser.parse(this.text);
  }

  showTotal(): string {
    const parseResult = this.parseResult;
    return parseResult ? parseResult.showTotal() : '0';
  }
}
