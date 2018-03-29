import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
import { UploadService } from '../upload/upload.service';
import {FileUpload} from 'primeng/primeng';

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
  uploadUrl = environment.apiUrl + '/upload';
  mostrarDialogCadastroContrato = false;
  mostrarDialogEdicaoContrato = false;
  novoContrato: Contrato = new Contrato();
  logo: File;
  contratoEmEdicao: Contrato = new Contrato();
  cnpjMask = [/\d/, /\d/, '.' , /\d/, /\d/,/\d/, '.', /\d/, /\d/, /\d/,'/', /\d/,/\d/,/\d/,/\d/,'-', /\d/, /\d/];
  invalidFields: Array<string> = [];
  imageUrl: any;

  @ViewChild('fileInput') fileInput: FileUpload;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private organizacaoService: OrganizacaoService,
    private contratoService: ContratoService,
    private manualService: ManualService,
    private confirmationService: ConfirmationService,
    private pageNotificationService: PageNotificationService,
    private uploadService: UploadService
  ) { }

  ngOnInit() {
    this.isSaving = false;
    this.manualService.query().subscribe((res: ResponseWrapper) => {
      this.manuais = res.json;
    });
    this.routeSub = this.route.params.subscribe(params => {
      this.organizacao = new Organizacao();
      if (params['id']) {
        this.organizacaoService.find(params['id']).subscribe(organizacao => {
          this.organizacao = organizacao;
          this.getFile();
        });
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
      this.organizacaoService.find(this.organizacao.id).subscribe(response => {

        if(this.logo !== undefined) {
          this.uploadService.uploadFile(this.logo).subscribe(response => {
            this.organizacao.logoId = JSON.parse(response["_body"]).id;
            this.subscribeToSaveResponse(this.organizacaoService.update(this.organizacao));
          })
        } else {
            this.subscribeToSaveResponse(this.organizacaoService.update(this.organizacao));
        }
      })
    } else {
      if(this.logo !== undefined) {
        if(this.checkRequiredFields()) {
          this.uploadService.uploadFile(this.logo).subscribe(response => {
            this.organizacao.logoId = JSON.parse(response["_body"]).id;
            this.subscribeToSaveResponse(this.organizacaoService.create(this.organizacao));
          })
        } else {
          this.pageNotificationService.addErrorMsg('Campos Inválidos:' + this.getInvalidFieldsString());
        }
      } else {
        this.pageNotificationService.addErrorMsg('Campo Logo está inválido!');
      }
    }
  }

  private checkRequiredFields(): boolean {
      let isFieldsValid = false;

      if ( this.organizacao.nome === undefined || this.organizacao.nome === '' || this.organizacao.nome === null) (this.invalidFields.push('Nome'));
      if ( this.organizacao.cnpj === undefined || this.organizacao.cnpj === '' || this.organizacao.cnpj === null) (this.invalidFields.push('CNPJ'));
      if ( this.organizacao.numeroOcorrencia === undefined || this.organizacao.numeroOcorrencia === '' || this.organizacao.numeroOcorrencia === null) (this.invalidFields.push('Numero Ocorrencia'));
      if ( this.organizacao.ativo === undefined) (this.invalidFields.push('Ativo'));

      isFieldsValid = (this.invalidFields.length === 0);

      return isFieldsValid;
  }

  private getInvalidFieldsString(): string {
    let invalidFieldsString = "";
    this.invalidFields.forEach(invalidField => {
      if(invalidField === this.invalidFields[this.invalidFields.length-1]) {
        invalidFieldsString = invalidFieldsString + invalidField;
      } else {
        invalidFieldsString = invalidFieldsString + invalidField + ', ';
      }
    });

    return invalidFieldsString;
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
  }

  getFile() {
    this.uploadService.getFile(this.organizacao.logoId).subscribe(response => {

      let fileInfo;
      this.uploadService.getFileInfo(this.organizacao.logoId).subscribe(response => {
        fileInfo = response;

        this.fileInput.files.push(new File([response["_body"]], fileInfo["originalName"]));
      });
    });
  }

  getFileInfo() {
    return this.uploadService.getFile(this.organizacao.logoId).subscribe(response => {
      console.log(response);
      return response;
    });
  }
}
