import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';
import { DatatableClickEvent } from '@basis/angular-components';

import { Sistema } from './sistema.model';
import { SistemaService } from './sistema.service';
import { Organizacao, OrganizacaoService } from '../organizacao';
import { Modulo, ModuloService } from '../modulo';
import { Funcionalidade, FuncionalidadeService } from '../funcionalidade';
import { ResponseWrapper } from '../shared';

@Component({
  selector: 'jhi-sistema-form',
  templateUrl: './sistema-form.component.html'
})
export class SistemaFormComponent implements OnInit, OnDestroy {

  organizacaos: Organizacao[];
  sistema: Sistema;
  isSaving: boolean;

  mostrarDialogModulo: boolean = false;
  novoModulo: Modulo = new Modulo();

  mostrarDialogFuncionalidade: boolean = false;
  novaFuncionalidade: Funcionalidade = new Funcionalidade();

  private routeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sistemaService: SistemaService,
    private organizacaoService: OrganizacaoService,
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.organizacaoService.query().subscribe((res: ResponseWrapper) => {
      this.organizacaos = res.json;
    });
    this.routeSub = this.route.params.subscribe(params => {
      this.sistema = new Sistema();
      if (params['id']) {
        this.sistemaService.find(params['id']).subscribe(sistema => this.sistema = sistema);
      }
    });
  }

  datatableClick(event: DatatableClickEvent) {
    if (!event.selection) {
      return;
    }
    switch (event.button) {
      case 'edit':
        console.log('edit');
        console.log(event.selection);
        break;
      case 'delete':
        console.log('delete');
        console.log(event.selection);
        break;
    }
  }

  abrirDialogModulo() {
    this.mostrarDialogModulo = true;
  }

  fecharDialogModulo() {
    this.doFecharDialogModulo();
  }

  private doFecharDialogModulo() {
    this.mostrarDialogModulo = false;
    this.novoModulo = new Modulo();
  }

  adicionarModulo() {
    this.sistema.addModulo(this.novoModulo);
    this.doFecharDialogModulo();
  }

  abrirDialogFuncionalidade() {
    this.mostrarDialogFuncionalidade = true;
  }

  fecharDialogFuncionalidade() {
    this.doFecharDialogFuncionalidade();
  }

  private doFecharDialogFuncionalidade() {
    this.mostrarDialogFuncionalidade = false;
    this.novaFuncionalidade = new Funcionalidade();
  }

  adicionarFuncionalidade() {
    this.sistema.addFuncionalidade(this.novaFuncionalidade);
    this.doFecharDialogFuncionalidade();
  }

  save() {
    this.isSaving = true;
    if (this.sistema.id !== undefined) {
      this.subscribeToSaveResponse(this.sistemaService.update(this.sistema));
    } else {
      this.subscribeToSaveResponse(this.sistemaService.create(this.sistema));
    }
  }

  private subscribeToSaveResponse(result: Observable<Sistema>) {
    result.subscribe((res: Sistema) => {
      this.isSaving = false;
      this.router.navigate(['/sistema']);
    }, (res: Response) => {
      this.isSaving = false;
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
