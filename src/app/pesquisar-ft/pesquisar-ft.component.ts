import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pesquisar-ft',
  templateUrl: './pesquisar-ft.component.html',
})
export class PesquisarFtComponent implements OnInit {
  
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

}
