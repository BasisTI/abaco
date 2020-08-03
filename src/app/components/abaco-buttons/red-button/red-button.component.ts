import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-red-button',
  templateUrl: './red-button.component.html',
  styleUrls: ['./red-button.component.css']
})
export class RedButtonComponent implements OnInit {

  @Input()
  public buttonLabel: string;
  @Input()
  public buttonIcon: string;

  @Input()
  public isDisabled: boolean;

  constructor() { }

  ngOnInit() {
    (this.isDisabled === undefined) ? (this.isDisabled = false) : (this.isDisabled = this.isDisabled);
  }

}
