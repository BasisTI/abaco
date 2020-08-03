import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-submit-button',
  templateUrl: './submit-button.component.html',
  styleUrls: ['./submit-button.component.css']
})
export class SubmitButtonComponent implements OnInit {

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
