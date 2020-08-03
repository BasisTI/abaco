import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-gray-button',
  templateUrl: './gray-button.component.html',
  styleUrls: ['./gray-button.component.css']
})
export class GrayButtonComponent implements OnInit {

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
