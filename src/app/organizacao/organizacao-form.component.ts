import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';
import { SelectItem } from 'primeng/primeng';

import { Organizacao } from './organizacao.model';
import { OrganizacaoService } from './organizacao.service';
import { Contrato, ContratoService } from '../contrato';
import { Manual, ManualService } from '../manual';
import { ResponseWrapper } from '../shared';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { DatatableClickEvent } from '@basis/angular-components';
import { environment } from '../../environments/environment';
import { PageNotificationService } from '../shared/page-notification.service';

@Component({
  selector: 'jhi-organizacao-form',
  templateUrl: './organizacao-form.component.html'
})
export class OrganizacaoFormComponent implements OnInit, OnDestroy {

  private routeSub: Subscription;

  contratos: Contrato[] = [];
  organizacao: Organizacao;
  isSaving: boolean;
  manuais: Manual[];
  uploadUrl = environment.apiUrl + '/upload'

  mostrarDialogCadastroContrato = false;
  mostrarDialogEdicaoContrato = false;
  novoContrato: Contrato = new Contrato();
  logo: File;
  contratoEmEdicao: Contrato = new Contrato();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private organizacaoService: OrganizacaoService,
    private contratoService: ContratoService,
    private manualService: ManualService,
    private confirmationService: ConfirmationService,
    private pageNotificationService: PageNotificationService
  ) { }

  ngOnInit() {
    this.isSaving = false;
    this.manualService.query().subscribe((res: ResponseWrapper) => {
      this.manuais = res.json;
    });
    this.routeSub = this.route.params.subscribe(params => {
      this.organizacao = new Organizacao();
      if (params['id']) {
        this.organizacaoService.find(params['id']).subscribe(organizacao => this.organizacao = organizacao);
      }
    });
  }

  abrirDialogCadastroContrato() {
    this.mostrarDialogCadastroContrato = true;
  }

  fecharDialogCadastroContrato() {
    this.doFecharDialogCadastroContrato();
  }

  private doFecharDialogCadastroContrato() {
    this.mostrarDialogCadastroContrato = false;
    this.novoContrato = new Contrato();
  }

  adicionarContrato() {
    this.organizacao.addContrato(this.novoContrato);
    this.doFecharDialogCadastroContrato();
  }

  datatableClick(event: DatatableClickEvent) {
    if (!event.selection) {
      return;
    }
    switch (event.button) {
      case 'edit':
        this.contratoEmEdicao = event.selection.clone();
        this.abrirDialogEditarContrato();
        break;
      case 'delete':
        this.contratoEmEdicao = event.selection.clone();
        this.confirmDeleteContrato();
    }
  }

  abrirDialogEditarContrato() {
    this.mostrarDialogEdicaoContrato = true;
  }

  fecharDialogEditarContrato() {
    this.contratoEmEdicao = new Contrato();
    this.mostrarDialogEdicaoContrato = false;
  }

  editarContrato() {
    this.organizacao.updateContrato(this.contratoEmEdicao);
    this.fecharDialogEditarContrato();
  }

  confirmDeleteContrato() {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o contrato '${this.contratoEmEdicao.numeroContrato}'
        e todas as suas funcionalidades?`,
      accept: () => {
        this.organizacao.deleteContrato(this.contratoEmEdicao);
        this.contratoEmEdicao = new Contrato();
      }
    });
  }

  save() {
    this.isSaving = true;
    if (this.organizacao.id !== undefined) {
      this.subscribeToSaveResponse(this.organizacaoService.update(this.organizacao));
    } else {
      if(this.logo !== undefined) {
        this.subscribeToSaveResponse(this.organizacaoService.create(this.organizacao, this.logo));
      } else {
        this.pageNotificationService.addErrorMsg('Campo Logo está inválido!');
      }
    }
  }

  private subscribeToSaveResponse(result: Observable<any>) {
    result.subscribe((res: Organizacao) => {
      this.isSaving = false;
      this.router.navigate(['/organizacao']);
      this.pageNotificationService.addCreateMsg();
    }, (error: Response) => {
      this.isSaving = false;

      switch(error.status) {
        case 400: {
          let invalidFieldNamesString = "";
          const fieldErrors = JSON.parse(error["_body"]).fieldErrors;
          invalidFieldNamesString = this.pageNotificationService.getInvalidFields(fieldErrors);
          this.pageNotificationService.addErrorMsg("Campos inválidos: " + invalidFieldNamesString);
        }
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  fileUpload(event: any) {
    this.logo = event.files[0];
    console.log(this.logo);
    // this.logo = event.target.files[0];

  }
}
