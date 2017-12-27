import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';
import { SelectItem } from 'primeng/primeng';

import { Funcionalidade } from './funcionalidade.model';
import { FuncionalidadeService } from './funcionalidade.service';
import { Modulo, ModuloService } from '../modulo';
// import { FuncaoDados, FuncaoDadosService } from '../funcao-dados';
import { FuncaoTransacao, FuncaoTransacaoService } from '../funcao-transacao';
import { ResponseWrapper } from '../shared';

@Component({
  selector: 'jhi-funcionalidade-form',
  templateUrl: './funcionalidade-form.component.html'
})
export class FuncionalidadeFormComponent implements OnInit, OnDestroy {

  modulos: Modulo[];

  // funcaodados: FuncaoDados[];

  funcaotransacaos: FuncaoTransacao[];
  funcionalidade: Funcionalidade;
  isSaving: boolean;
  private routeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private funcionalidadeService: FuncionalidadeService,
    private moduloService: ModuloService,
    // private funcaoDadosService: FuncaoDadosService,
    private funcaoTransacaoService: FuncaoTransacaoService,
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.moduloService.query().subscribe((res: ResponseWrapper) => {
      this.modulos = res.json;
    });
    // this.funcaoDadosService.query().subscribe((res: ResponseWrapper) => {
    //   this.funcaodados = res.json;
    // });
    this.funcaoTransacaoService.query().subscribe((res: ResponseWrapper) => {
      this.funcaotransacaos = res.json;
    });
    this.routeSub = this.route.params.subscribe(params => {
      this.funcionalidade = new Funcionalidade();
      if (params['id']) {
        this.funcionalidadeService.find(params['id']).subscribe(funcionalidade => this.funcionalidade = funcionalidade);
      }
    });
  }

  save() {
    this.isSaving = true;
    if (this.funcionalidade.id !== undefined) {
      this.subscribeToSaveResponse(this.funcionalidadeService.update(this.funcionalidade));
    } else {
      this.subscribeToSaveResponse(this.funcionalidadeService.create(this.funcionalidade));
    }
  }

  private subscribeToSaveResponse(result: Observable<Funcionalidade>) {
    result.subscribe((res: Funcionalidade) => {
      this.isSaving = false;
      this.router.navigate(['/funcionalidade']);
    }, (res: Response) => {
      this.isSaving = false;
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
