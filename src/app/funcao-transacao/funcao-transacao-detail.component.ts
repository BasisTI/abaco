import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { FuncaoTransacao } from './funcao-transacao.model';
import { FuncaoTransacaoService } from './funcao-transacao.service';

@Component({
  selector: 'jhi-funcao-transacao-detail',
  templateUrl: './funcao-transacao-detail.component.html'
})
export class FuncaoTransacaoDetailComponent implements OnInit, OnDestroy {

  funcaoTransacao: FuncaoTransacao;
  private subscription: Subscription;

  constructor(
    private funcaoTransacaoService: FuncaoTransacaoService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params) => {
      this.load(params['id']);
    });
  }

  load(id) {
    this.funcaoTransacaoService.find(id).subscribe((funcaoTransacao) => {
      this.funcaoTransacao = funcaoTransacao;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
