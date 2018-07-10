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
import { PageNotificationService } from '../shared/page-notification.service';

@Component({
  selector: 'jhi-sistema-form',
  templateUrl: './sistema-form.component.html'
})
export class SistemaFormComponent implements OnInit, OnDestroy {

  readonly editModuloEventName = 'editModulo';
  readonly deleteModuloEventName = 'deleteModulo';
  readonly editFuncionalidadeEventName = 'editFuncionalidade';
  readonly deleteFuncionalidadeEventName = 'deleteFuncionalidade';

  organizacaos: any[];
  sistema: Sistema;
  isSaving: boolean;

  mostrarDialogModulo = false;
  mostrarDialogEditarModulo = false;
  novoModulo: Modulo = new Modulo();
  moduloEmEdicao: Modulo = new Modulo();

  mostrarDialogFuncionalidade = false;
  valido = false;
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
    private pageNotificationService: PageNotificationService
  ) { }

  ngOnInit() {
    this.isSaving = false;
    this.organizacaoService.findActiveOrganizations().subscribe(response => {
      this.organizacaos = response;
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
    if (this.moduloEmEdicao.nome === undefined || this.moduloEmEdicao.nome.length === 0) {
      this.valido = true;
      this.pageNotificationService.addErrorMsg('Favor preencher o campo obrigatório!');
      return;
    }
    this.valido = false;
    this.sistema.updateModulo(this.moduloEmEdicao);
    this.fecharDialogEditarModulo();
  }

  confirmDeleteModulo() {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o módulo '${this.moduloEmEdicao.nome}' ?`,
      accept: () => {
        if (this.moduleCanBeDeleted()) {
          this.sistema.deleteModulo(this.moduloEmEdicao);
          this.moduloEmEdicao = new Modulo();
        } else {
          this.pageNotificationService.addErrorMsg('O módulo '
          + this.moduloEmEdicao.nome
          + ' não pode ser excluído porque existem funcionalidades atribuídas.');
        }
      }
    });
  }

  private moduleCanBeDeleted() {
    let isDeletationValid = true;

    this.sistema.funcionalidades.forEach(each => {
      if (each.modulo.nome === this.moduloEmEdicao.nome) {
        isDeletationValid = false;
      }
    });

    return isDeletationValid;
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
    if (this.novoModulo.nome === undefined) {
      this.valido = true;
      this.pageNotificationService.addErrorMsg('Favor preencher o campo obrigatório!');
      return;
    }
    this.valido = false;
    this.sistema.addModulo(this.novoModulo);
    this.doFecharDialogModulo();
  }

  deveDesabilitarBotaoNovaFuncionalidade(): boolean {
    return !this.sistema.modulos || this.sistema.modulos.length === 0;
  }

  abrirDialogFuncionalidade() {
    if (!this.deveDesabilitarBotaoNovaFuncionalidade()) {
      this.funcionalidadeEmEdicao.nome = undefined;
      this.funcionalidadeEmEdicao.modulo = undefined;
      this.mostrarDialogFuncionalidade = true;
    }
  }

  fecharDialogFuncionalidade() {
    this.doFecharDialogFuncionalidade();
  }

  private doFecharDialogFuncionalidade() {
    this.mostrarDialogFuncionalidade = false;
    this.novaFuncionalidade = new Funcionalidade();
  }

  adicionarFuncionalidade() {
    if (this.novaFuncionalidade.nome === undefined || this.novaFuncionalidade.modulo === undefined) {
      this.valido = true;
      this.pageNotificationService.addErrorMsg('Favor preencher o campo obrigatório!');
      return;
    }
    this.valido = false;
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
    if (this.funcionalidadeEmEdicao.nome === undefined || this.funcionalidadeEmEdicao.modulo === undefined || this.funcionalidadeEmEdicao.nome.length === 0) {
      this.valido = true;
      this.pageNotificationService.addErrorMsg('Favor preencher o campo obrigatório!');
      return;
    }
    this.valido = false;
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

  save(form) {
    // if (!form.valid) {
    //   this.pageNotificationService.addErrorMsg('Favor preencher o campo obrigatório!');
    //   return;
    // }
    this.isSaving = true;
    (this.sistema.modulos === undefined) ? (this.sistema.modulos = []) : (this.sistema);
    let sistemas: Array<Sistema>;
    this.sistemaService.query().subscribe(response => {
      sistemas = response.json;

      if (this.sistema.id !== undefined) {
        (this.checkRequiredFields() && !this.checkDuplicity(sistemas)
        && this.checkSystemName())
        ? (this.subscribeToSaveResponse(this.sistemaService.update(this.sistema))) : (this);
      } else {
        (this.checkRequiredFields() && !this.checkDuplicity(sistemas)
        && this.checkSystemName())
        ? (this.subscribeToSaveResponse(this.sistemaService.create(this.sistema))) : (this);
      }
    });
  }

  private checkDuplicity(sistemas: Array<Sistema>) {
    let isAlreadyRegistered: boolean;

    sistemas.forEach(each => {
      if (each.nome === this.sistema.nome && each.organizacao.id === this.sistema.organizacao.id && each.id !== this.sistema.id) {
        isAlreadyRegistered = true;
        this.pageNotificationService.addErrorMsg('O sistema ' + each.nome + ' já está cadastrado!');
      }
    });
    return isAlreadyRegistered;
  }

  private checkSystemInitials() {
      let exceedsMaximumValue = false;

      if (this.checkIfIsEmpty(this.sistema.sigla)) {
        if (this.sistema.sigla.length >= 20) {
          exceedsMaximumValue = true;
          this.pageNotificationService.addErrorMsg('O campo sigla excede o número de caracteres.');
        }
      }

      return exceedsMaximumValue;
  }

  private checkIfIsEmpty(field: string) {
    let isEmpty = false;

    if (field === undefined || field === null || field === '') {
        isEmpty = true;
    }

    return isEmpty;
  }

  private checkSystemName() {
    let isValid = true;

    if (this.checkIfIsEmpty(this.sistema.nome)) {
      if (this.sistema.nome.length >= 255) {
        isValid = false;
        this.pageNotificationService.addErrorMsg('O campo Nome excede o número de caracteres.');
      }
    }

    return isValid;
  }

  private checkRequiredFields() {
    let isNameValid = false;
    let isInitialsValid = false;
    let isOrganizationValid = false;
    let isRequiredFieldsValid = false;

    this.resetFocusFields();
    (!this.checkIfIsEmpty(this.sistema.nome))
      ? (isNameValid = true)
      : (document.getElementById('nome_sistema').setAttribute('style', 'border-color: red'));
    (!this.checkIfIsEmpty(this.sistema.sigla))
      ? (isInitialsValid = true)
      : (document.getElementById('sigla_sistema').setAttribute('style', 'border-color: red'));

    if (this.sistema.organizacao !== undefined) {
      isOrganizationValid = true;
    } else {
      document.getElementById('organizacao_sistema').setAttribute('style', 'border-bottom: solid; border-bottom-color: red;');
    }

    console.log(this.sistema.organizacao);
    (isNameValid
      && isInitialsValid
      && isOrganizationValid)
      ? (isRequiredFieldsValid = true)
      : (isRequiredFieldsValid = false);

    (!isRequiredFieldsValid)
      ? (this.pageNotificationService.addErrorMsg('Favor, preencher os campos obrigatórios!')) : (this);

    console.log(isNameValid);
    console.log(isInitialsValid);
    console.log(isRequiredFieldsValid);
    return isRequiredFieldsValid;
  }

  private resetFocusFields() {
    document.getElementById('nome_sistema').setAttribute('style', 'border-color: #bdbdbd');
    document.getElementById('sigla_sistema').setAttribute('style', 'border-color: #bdbdbd');
    document.getElementById('organizacao_sistema').setAttribute('style', 'border-bottom: none');
  }

  private notifyRequiredFields() {
      this.pageNotificationService.addErrorMsg('Favor, preencher os campos obrigatórios.');
      document.getElementById('sigla_sistema').setAttribute('style', 'border-color: red');
  }

  private subscribeToSaveResponse(result: Observable<Sistema>) {
    result.subscribe((res: Sistema) => {
      this.isSaving = false;
      this.pageNotificationService.addCreateMsg('Sistema cadastrado com sucesso!');
      this.router.navigate(['/sistema']);
    }, (error: Response) => {
      this.isSaving = false;

      switch (error.status) {
        case 404: {
          let invalidFieldNamesString = '';
          const fieldErrors = JSON.parse(error['body']).fieldErrors;
          invalidFieldNamesString = this.pageNotificationService.getInvalidFields(fieldErrors);
          this.pageNotificationService.addErrorMsg('Campos inválidos: ' + invalidFieldNamesString);
          break;
        }
        default: {
          this.pageNotificationService.addErrorMsg('Ocorreu um erro no sistema!');
          break;
        }
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
