import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';
import { SelectItem } from 'primeng/primeng';

import { FuncaoTransacao } from './funcao-transacao.model';
import { FuncaoTransacaoService } from './funcao-transacao.service';
import { Analise, AnaliseService } from '../analise';
import { FatorAjuste, FatorAjusteService } from '../fator-ajuste';
import { ResponseWrapper } from '../shared';

@Component({
  selector: 'jhi-funcao-transacao-form',
  templateUrl: './funcao-transacao-form.component.html'
})
export class FuncaoTransacaoFormComponent implements OnInit, OnDestroy {

  dropdownTipoFuncaoTransacao: SelectItem[] = [
    { label: 'EE', value: 'EE' },
    { label: 'SE', value: 'SE' },
    { label: 'CE', value: 'CE' }
  ];

  dropdownComplexidade: SelectItem[] = [
    { label: 'BAIXA', value: 'BAIXA' },
    { label: 'MEDIA', value: 'MEDIA' },
    { label: 'ALTA', value: 'ALTA' }
  ];

  analises: Analise[];

  fatorajustes: FatorAjuste[];
  funcaoTransacao: FuncaoTransacao;
  isSaving: boolean;
  private routeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private funcaoTransacaoService: FuncaoTransacaoService,
    private analiseService: AnaliseService,
    private fatorAjusteService: FatorAjusteService,
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.analiseService.query().subscribe((res: ResponseWrapper) => {
      this.analises = res.json;
    });
    this.fatorAjusteService.query().subscribe((res: ResponseWrapper) => {
      this.fatorajustes = res.json;
    });
    this.routeSub = this.route.params.subscribe(params => {
      this.funcaoTransacao = new FuncaoTransacao();
      if (params['id']) {
        this.funcaoTransacaoService.find(params['id']).subscribe(funcaoTransacao => this.funcaoTransacao = funcaoTransacao);
      }
    });
  }

  save() {
    this.isSaving = true;
    if (this.funcaoTransacao.id !== undefined) {
      this.subscribeToSaveResponse(this.funcaoTransacaoService.update(this.funcaoTransacao));
    } else {
      this.subscribeToSaveResponse(this.funcaoTransacaoService.create(this.funcaoTransacao));
    }
  }

  private subscribeToSaveResponse(result: Observable<FuncaoTransacao>) {
    result.subscribe((res: FuncaoTransacao) => {
      this.isSaving = false;
      this.router.navigate(['/funcaoTransacao']);
    }, (res: Response) => {
      this.isSaving = false;
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
