import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { SenhaService } from './senha.service';
import { Router, UrlSegment, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-senha',
  templateUrl: './senha.component.html',
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
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.senhaService.getLogin().subscribe(response => {
      this.router.navigate([this.urlEdit, response.text()]);
    });
  }

  ngOnDestroy() {
  }
}
