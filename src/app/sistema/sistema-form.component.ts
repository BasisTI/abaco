import { ConfirmationService } from 'primeng/primeng';
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

  readonly editModuloEventName = 'editModulo';
  readonly deleteModuloEventName = 'deleteModulo';
  readonly editFuncionalidadeEventName = 'editFuncionalidade';
  readonly deleteFuncionalidadeEventName = 'deleteFuncionalidade';

  organizacaos: Organizacao[];
  sistema: Sistema;
  isSaving: boolean;

  mostrarDialogModulo = false;
  mostrarDialogEditarModulo = false;
  novoModulo: Modulo = new Modulo();
  moduloEmEdicao: Modulo = new Modulo();

  mostrarDialogFuncionalidade = false;
  mostrarDialogEditarFuncionalidade = false;
  novaFuncionalidade: Funcionalidade = new Funcionalidade();
  oldFuncionalidade: Funcionalidade;
  funcionalidadeEmEdicao: Funcionalidade = new Funcionalidade();

  private routeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sistemaService: SistemaService,
    private organizacaoService: OrganizacaoService,
    private confirmationService: ConfirmationService,
  ) { }

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
      case this.editModuloEventName:
        this.moduloEmEdicao = event.selection.clone();
        this.abrirDialogEditarModulo();
        break;
      case this.deleteModuloEventName:
        this.moduloEmEdicao = event.selection.clone();
        this.confirmDeleteModulo();
        break;
      case this.editFuncionalidadeEventName:
        this.oldFuncionalidade = event.selection.clone();
        this.funcionalidadeEmEdicao = event.selection.clone();
        this.abrirDialogEditarFuncionalidade();
        break;
      case this.deleteFuncionalidadeEventName:
        this.funcionalidadeEmEdicao = event.selection.clone();
        this.confirmDeleteFuncionalidade();
    }
  }

  abrirDialogEditarModulo() {
    this.mostrarDialogEditarModulo = true;
  }

  fecharDialogEditarModulo() {
    this.moduloEmEdicao = new Modulo();
    this.mostrarDialogEditarModulo = false;
  }

  editarModulo() {
    // update funciona pois a cópia possui o mesmo artificialId
    this.sistema.updateModulo(this.moduloEmEdicao);
    this.fecharDialogEditarModulo();
  }

  confirmDeleteModulo() {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o módulo '${this.moduloEmEdicao.nome}'
        e todas as suas funcionalidades?`,
      accept: () => {
        this.sistema.deleteModulo(this.moduloEmEdicao);
        this.moduloEmEdicao = new Modulo();
      }
    });
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

  abrirDialogEditarFuncionalidade() {
    this.mostrarDialogEditarFuncionalidade = true;
  }

  fecharDialogEditarFuncionalidade() {
    this.funcionalidadeEmEdicao = new Modulo();
    this.mostrarDialogEditarFuncionalidade = false;
  }

  editarFuncionalidade() {
    // update funciona pois a cópia possui o mesmo artificialId
    this.sistema.updateFuncionalidade(this.funcionalidadeEmEdicao, this.oldFuncionalidade);
    this.fecharDialogEditarFuncionalidade();
  }

  confirmDeleteFuncionalidade() {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir a funcionalidade '${this.funcionalidadeEmEdicao.nome}'
        do módulo '${this.funcionalidadeEmEdicao.modulo.nome}'?`,
      accept: () => {
        this.sistema.deleteFuncionalidade(this.funcionalidadeEmEdicao);
        this.moduloEmEdicao = new Modulo();
      }
    });
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
