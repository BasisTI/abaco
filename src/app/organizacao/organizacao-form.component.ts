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
import {NgxMaskModule} from 'ngx-mask';
import { ValidacaoUtil } from '../util/validacao.util';
import { ValueTransformer } from '@angular/compiler/src/util';
import { Upload } from '../upload/upload.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'jhi-organizacao-form',
  templateUrl: './organizacao-form.component.html'
})
export class OrganizacaoFormComponent implements OnInit, OnDestroy {

  private routeSub: Subscription;

  contratos: Contrato[] = [];
  organizacao: Organizacao;
  isSaving; manualInvalido; numeroContratoInvalido; isEdit: boolean;
  cnpjValido: boolean;
  manuais: Manual[];
  uploadUrl = environment.apiUrl + '/upload';
  mostrarDialogCadastroContrato = false;
  mostrarDialogEdicaoContrato = false;
  novoContrato: Contrato = new Contrato();
  logo: File;
  newLogo: File;
  contratoEmEdicao: Contrato = new Contrato();
  invalidFields: Array<string> = [];
  imageUrl: any;
  upload: Upload;
  alterouLogo: boolean;

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

  /**
   *
   * */
  ngOnInit() {
    this.isEdit = false;
    this.cnpjValido = false;
    this.isSaving = false;
    this.manualService.query().subscribe((res: ResponseWrapper) => {
      this.manuais = res.json;
    });
    this.routeSub = this.route.params.subscribe(params => {
      this.organizacao = new Organizacao();
      if (params['id']) {
       
        this.organizacaoService.find(params['id']).subscribe(organizacao => {
          this.organizacao = organizacao;
          if (this.organizacao.logoId != undefined && this.organizacao.logoId != null)
            this.uploadService.getLogo(organizacao.logoId).subscribe(response => {
            this.logo = response.logo
         })
          // this.getFile();
        });
      }
    });
    this.organizacao.ativo = true;
  }

  /**
   *
   * */
  abrirDialogCadastroContrato() {
    this.mostrarDialogCadastroContrato = true;
    this.novoContrato.ativo = true;
    this.numeroContratoInvalido = false;
  }

  /**
   *
   * */
  fecharDialogCadastroContrato() {
    this.doFecharDialogCadastroContrato();
  }

  /**
   *
   * */
  validarManual() {
    this.manualInvalido = false;
    this.numeroContratoInvalido = false;
  }

  validarDataInicio() {
    if (!(this.novoContrato.dataInicioValida()) || !(this.contratoEmEdicao.dataInicioValida())){
      this.pageNotificationService.addErrorMsg('A data de início da vigência não pode ser posterior à data de término da vigência!');
      //document.getElementById('login').setAttribute('style', 'border-color: red;');
    }
  }

  /**
   *
   * */
  private doFecharDialogCadastroContrato() {
    this.mostrarDialogCadastroContrato = false;
    this.novoContrato = new Contrato();
  }

  validaCamposContrato(contrato: Contrato) {
    const regra: RegExp = /^\S+(\s{1}\S+)*$/;
    if (!regra.test(contrato.numeroContrato)) {
      this.pageNotificationService.addErrorMsg('Número do Contrato contém espaços! Favor verificar.');
      //document.getElementById('login').setAttribute('style', 'border-color: red;');
      return false;
    }
    if (contrato.dataInicioVigencia != null) {
      if (!regra.test(contrato.dataInicioVigencia.toString())) {
        this.pageNotificationService.addErrorMsg('Data de Início da Vigência não contém uma data válida! Favor verificar.');
        //document.getElementById('login').setAttribute('style', 'border-color: red;');
        return false;
      }
    }
    if (contrato.dataFimVigencia != null) {
      if (!regra.test(contrato.dataFimVigencia.toString())) {
        this.pageNotificationService.addErrorMsg('Data Final da Vigência não contém uma data válida! Favor verificar.');
        //document.getElementById('login').setAttribute('style', 'border-color: red;');
        return false;
      }
    }
    if (isNaN(contrato.diasDeGarantia)) {
      this.pageNotificationService.addErrorMsg('Dias de garantia deve conter apenas dígitos!');
      //document.getElementById('login').setAttribute('style', 'border-color: red;');
      return false;
    }
    return true;
  }

  /**
   *
   * */
  adicionarContrato() {
    if (this.novoContrato.manual === null || this.novoContrato.manual === undefined) {
      this.manualInvalido = true;
      this.pageNotificationService.addErrorMsg('Selecione um manual');
      return;
    }
      if (this.novoContrato.numeroContrato === null || this.novoContrato.numeroContrato === undefined) {
        this.numeroContratoInvalido = true;
        this.pageNotificationService.addErrorMsg('Favor preencher o campo obrigatório!');
        return;
      }
    if (!(this.novoContrato.dataInicioValida())) {
      this.pageNotificationService.addErrorMsg('A data de início da vigência não pode ser posterior à data de término da vigência!');
      return;
    }
    if (this.validaCamposContrato(this.novoContrato)) {
      document.getElementById('tabela-contrato').removeAttribute('style');
      this.organizacao.addContrato(this.novoContrato);
      this.doFecharDialogCadastroContrato();
    }

  }

  /**
   *
   * */
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

  /**
   *
   * */
  abrirDialogEditarContrato() {
    this.mostrarDialogEdicaoContrato = true;
  }

  /**
   *
   * */
  fecharDialogEditarContrato() {
    this.contratoEmEdicao = new Contrato();
    this.mostrarDialogEdicaoContrato = false;
  }

  /**
   *
   * */
  editarContrato() {
    this.organizacao.updateContrato(this.contratoEmEdicao);
    this.fecharDialogEditarContrato();
    this.novoContrato.diasDeGarantia = undefined;
  }

  /**
   *
   * */
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

  /**
   *
   * */
  save(form) {
    this.cnpjValido = false;
    if (!this.organizacao.nome) {
      this.pageNotificationService.addErrorMsg('O campo Nome é obrigatório!');
      return;
    }

    if (!this.organizacao.sigla) {
      return this.pageNotificationService.addErrorMsg('O campo Sigla é obrigatório!');
       }

    this.isSaving = true;
    if (this.organizacao.cnpj === '') {
      this.organizacao.cnpj = undefined;
    }

     if (this.organizacao.cnpj !== undefined && this.organizacao.cnpj !== ' ') {
      if (this.organizacao.cnpj) {
      if (!ValidacaoUtil.validarCNPJ(this.organizacao.cnpj)) {
        this.cnpjValido = true;
        this.pageNotificationService.addErrorMsg('CNPJ inválido');
        return;
      }
    }
  }

  if (this.organizacao.contracts.length === 0 || this.organizacao.contracts === undefined) {
    document.getElementById('tabela-contrato').setAttribute('style', 'border: 1px dotted red;');
    this.pageNotificationService.addErrorMsg('Pelo menos 1 contrato é obrigatório por organização.');
    return;
  }

  this.organizacaoService.query().subscribe(response => {
    const todasOrganizacoes = response;

    if (!this.checkIfOrganizacaoAlreadyExists(todasOrganizacoes.json)) {
      if (this.organizacao.id !== undefined) {
        this.editar();
      } else {
        this.novo();
      }
    }
  });
 }

mudouLogo(imagem: File): boolean {
  this.alterouLogo = this.logo != imagem;
  return this.alterouLogo;
}

editar() {
   this.organizacaoService.find(this.organizacao.id).subscribe(response => {
    if (this.alterouLogo) {
      this.uploadService.uploadLogo(this.newLogo).subscribe((response: any) => {
        this.organizacao.logoId = response.id;
        this.logo = response.logo;
        this.isEdit = true;
        this.subscribeToSaveResponse(this.organizacaoService.update(this.organizacao));      

      });  

      this.uploadService.saveFile(this.newLogo).subscribe(response => {
        });
    } else {
      this.isEdit = true;
      this.subscribeToSaveResponse(this.organizacaoService.update(this.organizacao));
    }
   });
 }

 novo() {
     if (this.newLogo != undefined && this.newLogo != null) {

      this.uploadService.uploadLogo(this.newLogo).subscribe((response: any) => {
        this.organizacao.logoId = response.id;
       this.subscribeToSaveResponse(this.organizacaoService.create(this.organizacao));
         });
     } else {
       this.subscribeToSaveResponse(this.organizacaoService.create(this.organizacao));
       }
   }

      checkIfOrganizacaoAlreadyExists(organizacoesRegistradas: Array<Organizacao>): boolean {
        let isAlreadyRegistered = false;
        organizacoesRegistradas.forEach(each => {
          if (each.nome.toUpperCase() === this.organizacao.nome.toUpperCase() && each.id !== this.organizacao.id) {
            isAlreadyRegistered = true;
            this.pageNotificationService.addErrorMsg('Já existe uma Organização registrada com este nome!');
          }
        });
        return isAlreadyRegistered;
  }

  /**
  * Método responsável por recuperar as organizações pelo id.
  * */
  private recupeprarOrganizacoes(id: number): Observable<Organizacao> {
    return this.organizacaoService.find(id);
  }

  /**
   *
   * */
  private getInvalidFieldsString(): string {
    let invalidFieldsString = '';
    this.invalidFields.forEach(invalidField => {
      if (invalidField === this.invalidFields[this.invalidFields.length - 1]) {
        invalidFieldsString = invalidFieldsString + invalidField;
      } else {
        invalidFieldsString = invalidFieldsString + invalidField + ', ';
      }
    });

    return invalidFieldsString;
  }

  /**
   *
   * */
  private subscribeToSaveResponse(result: Observable<any>) {
    result.subscribe((res: Organizacao) => {
      this.isSaving = false;
      this.router.navigate(['/organizacao']);

      this.isEdit ? this.pageNotificationService.addUpdateMsg() :  this.pageNotificationService.addCreateMsg();
    }, (error: Response) => {
      this.isSaving = false;
      if (error.status === 400) {
        const errorType: string = error.headers.toJSON()['x-abacoapp-error'][0];

        switch (errorType) {
          case 'error.orgNomeInvalido' : {
            this.pageNotificationService.addErrorMsg('O campo "Nome" possui carcteres inválidos! '
                + 'Verifique se há espaços no início, no final ou mais de um espaço entre palavras.');
            //document.getElementById('login').setAttribute('style', 'border-color: red;');
            break;
          }
          case 'error.orgCnpjInvalido' : {
            this.pageNotificationService.addErrorMsg('O campo "CNPJ" possui carcteres inválidos! '
                + 'Verifique se há espaços no início ou no final.');
            //document.getElementById('login').setAttribute('style', 'border-color: red;');
            break;
          }
          case 'error.orgSiglaInvalido' : {
            this.pageNotificationService.addErrorMsg('O campo "Sigla" possui carcteres inválidos! '
                + 'Verifique se há espaços no início ou no final.');
            //document.getElementById('login').setAttribute('style', 'border-color: red;');
            break;
          }
          case 'error.orgNumOcorInvalido' : {
            this.pageNotificationService.addErrorMsg('O campo "Número da Ocorrência" possui carcteres inválidos! '
                + 'Verifique se há espaços no início ou no final.');
            //document.getElementById('login').setAttribute('style', 'border-color: red;');
            break;
          }
          case 'error.organizacaoexists' : {
            this.pageNotificationService.addErrorMsg('Já existe organização cadastrada com mesmo nome!');
            //document.getElementById('login').setAttribute('style', 'border-color: red;');
            break;
          }
          case 'error.cnpjexists' : {
            this.pageNotificationService.addErrorMsg('Já existe organização cadastrada com mesmo CNPJ!');
            //document.getElementById('login').setAttribute('style', 'border-color: red;');
            break;
          }
          case 'error.beggindateGTenddate' : {
            this.pageNotificationService.addErrorMsg('"Início Vigência" não pode ser posterior a "Final Vigência"');
            //document.getElementById('login').setAttribute('style', 'border-color: red;');
            break;
          }
        }
        let invalidFieldNamesString = '';
        const fieldErrors = JSON.parse(error['_body']).fieldErrors;
        invalidFieldNamesString = this.pageNotificationService.getInvalidFields(fieldErrors);
        this.pageNotificationService.addErrorMsg('Campos inválidos: ' + invalidFieldNamesString);
      }
    });
  }

  /**
   *
   * */
  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  /**
   *Método de upload de foto 
   * */
  fileUpload(event: any) {
    let imagem = event.files[0];
    if (this.mudouLogo(imagem)) {
      this.newLogo = imagem;
    }
  }

  /**
   *
   * */


  /**
   *
   * */
  getFileInfo() {
    return this.uploadService.getFile(this.organizacao.logoId).subscribe(response => {
      return response;
    });
  }
}
