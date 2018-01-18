import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-blue-button',
  templateUrl: './blue-button.component.html',
  styleUrls: ['./blue-button.component.css']
})
export class BlueButtonComponent implements OnInit {

  @Input()
  public buttonLabel: string;
  @Input()
  public buttonIcon: string;

  constructor() { }

  ngOnInit() {
  }

}
