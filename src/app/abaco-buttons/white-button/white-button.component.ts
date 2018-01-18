import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-white-button',
  templateUrl: './white-button.component.html',
  styleUrls: ['./white-button.component.css']
})
export class WhiteButtonComponent implements OnInit {

  @Input()
  public buttonLabel: string;
  @Input()
  public buttonIcon: string;
  constructor() { }

  ngOnInit() {
  }

}
