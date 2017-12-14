import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Organizacao } from './organizacao.model';
import { OrganizacaoService } from './organizacao.service';

@Component({
  selector: 'jhi-organizacao-detail',
  templateUrl: './organizacao-detail.component.html'
})
export class OrganizacaoDetailComponent implements OnInit, OnDestroy {

  organizacao: Organizacao;
  private subscription: Subscription;

  constructor(
    private organizacaoService: OrganizacaoService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params) => {
      this.load(params['id']);
    });
  }

  load(id) {
    this.organizacaoService.find(id).subscribe((organizacao) => {
      this.organizacao = organizacao;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
