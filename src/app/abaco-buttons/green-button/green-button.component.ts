import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-green-button',
  templateUrl: './green-button.component.html',
  styleUrls: ['./green-button.component.css']
})
export class GreenButtonComponent implements OnInit {

  @Input()
  public buttonLabel: string;
  @Input()
  public buttonIcon: string;

  constructor() { }

  ngOnInit() {

  }

}
