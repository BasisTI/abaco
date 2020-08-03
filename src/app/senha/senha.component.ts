import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { SenhaService } from './senha.service';
import { Router, UrlSegment, ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { LoginService } from '../login';

@Component({
  selector: 'app-senha',
  templateUrl: './senha.component.html',
  providers:[LoginService],
  
})
export class SenhaComponent implements OnInit, OnDestroy {

  authenticated = false;
  urlEdit = '/senha/edit/';
  url: string;
  urlSub: Subscription;
  login: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private senhaService: SenhaService,
  ) { }

  ngOnInit() {
    this.senhaService.getLogin().subscribe(response => {
      this.router.navigate([this.urlEdit, response]);
    });
  }

  ngOnDestroy() {
  }
}
