import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';
import { SelectItem } from 'primeng/primeng';

import { Manual } from './manual.model';
import { ManualService } from './manual.service';
import { EsforcoFaseService } from '../esforco-fase/esforco-fase.service';
import { ResponseWrapper } from '../shared';
import { EsforcoFase } from '../esforco-fase/esforco-fase.model';
import { TipoFaseService } from '../tipo-fase/tipo-fase.service';
import { TipoFase } from '../tipo-fase/tipo-fase.model';
import { DatatableClickEvent } from '@basis/angular-components';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { FatorAjuste, TipoFatorAjuste } from '../fator-ajuste/fator-ajuste.model';
import { PageNotificationService } from '../shared/page-notification.service';
import { UploadService } from '../upload/upload.service';
import { FileUpload } from 'primeng/primeng';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-manual-form',
  templateUrl: './manual-form.component.html',
})
export class ManualFormComponent implements OnInit, OnDestroy {
  manual: Manual;
  isSaving: boolean;
  loading: boolean;
  private routeSub: Subscription;
  arquivoManual: File;
  esforcoFases: Array<EsforcoFase>;
  showDialogPhaseEffort = false;
  showDialogEditPhaseEffort = false;
  showDialogCreateAdjustFactor = false;
  showDialogEditAdjustFactor = false;
  tipoFases: Array<TipoFase> = [];
  percentual: number;
  newPhaseEffort: EsforcoFase = new EsforcoFase();
  editedPhaseEffort: EsforcoFase = new EsforcoFase();
  newAdjustFactor: FatorAjuste = new FatorAjuste();
  editedAdjustFactor: FatorAjuste = new FatorAjuste();

  adjustTypes: Array<any> = [
    { label: 'Percentual', value: 'PERCENTUAL', },
    { label: 'Unitário', value: 'UNITARIO', },
  ];

  invalidFields: Array<string> = [];

  @ViewChild('fileInput') fileInput: FileUpload;

  /**
   *
  */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private manualService: ManualService,
    private esforcoFaseService: EsforcoFaseService,
    private tipoFaseService: TipoFaseService,
    private confirmationService: ConfirmationService,
    private pageNotificationService: PageNotificationService,
    private uploadService: UploadService,
    private translate: TranslateService
  ) {
    translate.setDefaultLang('pt');
    translate.use(sessionStorage.getItem('language'));
  }

  /**
   *
  */
  ngOnInit() {
    this.isSaving = false;
    this.routeSub = this.route.params.subscribe(params => {
      this.manual = new Manual();
      if (params['id']) {
        this.manualService.find(params['id']).subscribe(manual => {
          this.manual = manual;
          this.getFile();
        });
      }
    });

    this.tipoFaseService.query().subscribe((response: ResponseWrapper) => {
      this.tipoFases = response.json;
    });
    this.manual.versaoCPM = 421;
  }

  /**
   *
  */
  save(form) {
    if (!form.valid) {
      this.pageNotificationService.addErrorMsg('Favor preencher os campos obrigatórios!');
      return;
    }

    this.isSaving = true;

    if (this.manual.id !== undefined) {
      this.editar();
    } else {
      this.novo();
    }
  }

  /**
   *
  */
  private editar() {
    this.manualService.find(this.manual.id).subscribe(response => {
      if (this.checkRequiredFields()) {
        if (this.arquivoManual !== undefined) {
          // tslint:disable-next-line:no-shadowed-variable
          this.uploadService.uploadFile(this.arquivoManual).subscribe(response => {
            this.manual.arquivoManualId = JSON.parse(response['_body']).id;
            this.subscribeToSaveResponse(this.manualService.update(this.manual));
          });
        } else {
          this.subscribeToSaveResponse(this.manualService.update(this.manual));
        }
      } else {
        this.privateExibirMensagemCamposInvalidos(1);
      }
    });
  }

  /**
   *
  */
  private novo() {
    if (this.arquivoManual !== undefined) {
      if (this.checkRequiredFields()) {
        this.definirValorpadrao();
        this.uploadService.uploadFile(this.arquivoManual).subscribe(response => {
        this.manual.arquivoManualId = JSON.parse(response['_body']).id;
        this.subscribeToSaveResponse(this.manualService.create(this.manual));
        });
      } else {
        this.privateExibirMensagemCamposInvalidos(1);
      }
    } else {
      this.privateExibirMensagemCamposInvalidos(2);
    }
  }

  /**
   *
  */
  private checkRequiredFields(): boolean {
      let isFieldsValid = false;

      if (!this.manual.valorVariacaoEstimada || this.manual.valorVariacaoEstimada === undefined) {
        this.invalidFields.push('Valor Variação Estimada');
      }
      if (!this.manual.valorVariacaoIndicativa || this.manual.valorVariacaoIndicativa === undefined) {
        this.invalidFields.push('Valor Variação Indicativa');
      }
      if (!this.manual.nome || this.manual.nome === undefined) {
        this.invalidFields.push('Nome');
      }
      if (!this.manual.parametroInclusao || this.manual.parametroInclusao === undefined) {
        this.invalidFields.push('Inclusão');
      }
      if (!this.manual.parametroAlteracao || this.manual.parametroAlteracao === undefined) {
        this.invalidFields.push('Alteração');
      }
      if (!this.manual.parametroExclusao || this.manual.parametroExclusao === undefined) {
        this.invalidFields.push('Exclusão');
      }
      if (!this.manual.parametroConversao || this.manual.parametroConversao === undefined) {
        this.invalidFields.push('Conversão');
      }

      isFieldsValid = (this.invalidFields.length === 0);

      return isFieldsValid;
  }

  /**
   *
  */
  privateExibirMensagemCamposInvalidos(codErro: number) {
    switch (codErro) {
      case 1:
        this.pageNotificationService.addErrorMsg('Campos inválidos: ' + this.getInvalidFieldsString());
        this.invalidFields = [];
        return;
      case 2:
        this.pageNotificationService.addErrorMsg('Campo Arquivo Manual está inválido!');
        return;

    }
  }

  /**
   *
  */
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
  */
  private definirValorpadrao() {
    this.manual.versaoCPM = 1;
  }

  /**
   *
  */
  private subscribeToSaveResponse(result: Observable<Manual>) {
    result.subscribe((res: Manual) => {
      this.isSaving = false;
      this.router.navigate(['/manual']);
      this.pageNotificationService.addCreateMsg();
    }, (error: Response) => {
      alert(error);
      this.isSaving = false;
      switch (error.status) {
        case 400: {
          let invalidFieldNamesString = '';
          const fieldErrors = JSON.parse(error['_body']).fieldErrors;
          invalidFieldNamesString = this.pageNotificationService.getInvalidFields(fieldErrors);
          this.pageNotificationService.addErrorMsg('Campos inválidos: ' + invalidFieldNamesString);
        }
      }
    });
  }

  /**
   *
  */
  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  /**
   *
  */
  uploadFile(event) {
    this.arquivoManual = event.files[0];
  }

  /**
   *
  */
  datatableClick(event: DatatableClickEvent) {
    if (!event.selection) {
      return;
    }
    console.log(event.selection);
    switch (event.button) {
      case 'edit':
        this.editedPhaseEffort = event.selection.clone();
        this.openDialogEditPhaseEffort();
        break;
      case 'delete':
        console.log(event.selection);
        this.editedPhaseEffort = event.selection.clone();
        this.confirmDeletePhaseEffort();
    }
  }

  /**
   *
  */
  adjustFactorDatatableClick(event: DatatableClickEvent) {
    if (!event.selection) {
      return;
    }
    switch (event.button) {
      case 'edit':
        this.editedAdjustFactor = event.selection.clone();
        (this.editedAdjustFactor.fator > 0 && this.editedAdjustFactor.fator < 1) ?
          (this.editedAdjustFactor.fator = this.editedAdjustFactor.fator) : (this.editedAdjustFactor = this.editedAdjustFactor);
        this.openDialogEditAdjustFactor();
        break;
      case 'delete':
        console.log(event.selection);
        this.editedAdjustFactor = event.selection.clone();
        this.confirmDeleteAdjustFactor();
    }
  }

  /**
   *
  */
  isPercentualEnum(value: TipoFatorAjuste) {

    return (value !== undefined) ? (value.toString() === 'PERCENTUAL') : (false);
  }

  /**
   *
  */
  isUnitaryEnum(value: TipoFatorAjuste) {
    return (value !== undefined) ? (value.toString() === 'UNITARIO') : (false);
  }

  /**
   *
  */
  confirmDeletePhaseEffort() {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir o Esforço por fase ' + this.editedPhaseEffort.fase.nome + '?',
      accept: () => {
        this.manual.deleteEsforcoFase(this.editedPhaseEffort);
        this.pageNotificationService.addDeleteMsg();
        this.editedPhaseEffort = new EsforcoFase();
      }
    });
  }

  /**
   *
  */
  confirmDeleteAdjustFactor() {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir o Fator de Ajuste ' + this.editedAdjustFactor.nome + '?',
      accept: () => {
        this.manual.deleteFatoresAjuste(this.editedAdjustFactor);
        this.pageNotificationService.addDeleteMsg();
        this.editedAdjustFactor = new FatorAjuste();
      }
    });
  }

  /**
   *
  */
  openDialogPhaseEffort() {
    this.newPhaseEffort = new EsforcoFase();
    this.showDialogPhaseEffort = true;
  }

  /**
   *
  */
  openDialogEditPhaseEffort() {
      this.showDialogEditPhaseEffort = true;
  }

  /**
   *
  */
  editPhaseEffort() {
    if (this.checkPhaseEffortRequiredFields(this.editedPhaseEffort)) {
      this.manual.updateEsforcoFases(this.editedPhaseEffort);
      this.pageNotificationService.addUpdateMsg();
      this.closeDialogEditPhaseEffort();
    } else {
      this.pageNotificationService.addErrorMsg('Favor, preencher os campos obrigatórios!');
    }
  }

  /**
   *
  */
  editAdjustFactor() {
    if (this.checkAdjustFactorRequiredFields(this.editedAdjustFactor)) {
      this.manual.updateFatoresAjuste(this.editedAdjustFactor);
      this.pageNotificationService.addUpdateMsg();
      this.closeDialogEditAdjustFactor();
    } else {

    }
  }

  /**
   *
  */
  closeDialogPhaseEffort() {
    this.newPhaseEffort = new EsforcoFase();
    this.showDialogPhaseEffort = false;
  }

  /**
   *
  */
  closeDialogEditPhaseEffort() {
    this.editedPhaseEffort = new EsforcoFase();
    this.showDialogEditPhaseEffort = false;
  }

  /**
   *
  */
  addPhaseEffort() {
    this.newPhaseEffort.esforco = this.newPhaseEffort.esforco;
    if (this.checkPhaseEffortRequiredFields(this.newPhaseEffort)) {
      this.manual.addEsforcoFases(this.newPhaseEffort);
      this.pageNotificationService.addCreateMsg();
      this.closeDialogPhaseEffort();
    } else {
      this.pageNotificationService.addErrorMsg('Favor, preencher os campos obrigatórios!');
    }
  }

  /**
   *
  */
  private resetMarkedFieldsPhaseEffort() {
    document.getElementById('esforco').setAttribute('style', 'border-bottom: solid; border-bottom-color: #bdbdbd;');
    document.getElementById('nome_fase').setAttribute('style', 'border-bottom: solid; border-bottom-color: #bdbdbd;');
  }

  /**
   *
  */
  private checkPhaseEffortRequiredFields(phaseEffort: EsforcoFase): boolean {
    let isPhaseNameValid = false;
    let isPhaseEffortValid = false;
    let isEffortValid = false;

    this.resetMarkedFieldsPhaseEffort();
    (phaseEffort.fase !== undefined) ? (isPhaseNameValid = true) : (isPhaseNameValid = false);

    if (phaseEffort.fase !== undefined)  {
      isPhaseNameValid = true;
    } else {
      isPhaseNameValid = false;
      document.getElementById('nome_fase').setAttribute('style', 'border-bottom: solid; border-bottom-color: red;');
      document.getElementById('nome_fase_edit').setAttribute('style', 'border-bottom: solid; border-bottom-color: red;');
    }

    if (phaseEffort.esforco !== undefined && phaseEffort.esforco !== 0) {
      isEffortValid = true;
    } else {
      isEffortValid = false;
      document.getElementById('esforco').setAttribute('style', 'border-bottom: solid; border-bottom-color: red;');
      document.getElementById('esforco_edit').setAttribute('style', 'border-bottom: solid; border-bottom-color: red;');
      console.log(phaseEffort.esforco);
    }

    (isPhaseNameValid && isEffortValid) ? (isPhaseEffortValid = true) : (isPhaseEffortValid = false);

    return isPhaseEffortValid;
  }

  /**
   *
  */
  getPhaseEffortTotalPercentual() {
    let total = 0;
    this.manual.esforcoFases.forEach(each => {
      (each.esforco !== undefined) ? (total = total + each.esforcoFormatado) : (total = total);
    });

    return total;
  }

  /**
   *
  */
  openDialogCreateAdjustFactor() {
    this.showDialogCreateAdjustFactor = true;
  }

  /**
   *
  */
  closeDialogCreateAdjustFactor() {
    this.showDialogCreateAdjustFactor = false;
    this.newAdjustFactor = new FatorAjuste();
  }

  /**
   *
  */
  openDialogEditAdjustFactor() {
    this.showDialogEditAdjustFactor = true;
  }

  /**
   *
  */
  closeDialogEditAdjustFactor() {
      this.showDialogEditAdjustFactor = false;
      this.editedAdjustFactor = new FatorAjuste();
  }

  /**
   *
  */
  addAdjustFactor() {
    this.newAdjustFactor.ativo = true;
    if (this.checkAdjustFactorRequiredFields(this.newAdjustFactor)) {
      this.manual.addFatoresAjuste(this.newAdjustFactor);
      this.pageNotificationService.addCreateMsg('Registro incluído com sucesso!');
      this.closeDialogCreateAdjustFactor();
    } else {
      this.pageNotificationService.addErrorMsg('Favor, preencher os campos obrigatórios!');
    }
  }

  /**
   *
  */
  private checkAdjustFactorRequiredFields(adjustFactor: FatorAjuste): boolean {
    let isNameValid = false;
    let isAdjustTypeValid = false;
    let isFactorValid = false;

    this.resetMarkedFieldsAdjustFactor();
    isNameValid = this.checkRequiredField(adjustFactor.nome);
    isAdjustTypeValid = this.checkRequiredField(adjustFactor.tipoAjuste);
    isFactorValid = this.checkRequiredField(adjustFactor.fator);

    this.markFieldsAdjustFactor(isNameValid, isAdjustTypeValid, isFactorValid);
    return (isNameValid && isAdjustTypeValid && isFactorValid);
  }

  /**
   *
  */
  private checkRequiredField(field: any) {
    let isValid = false;

    (field !== undefined && field !== '' && field !== null) ? (isValid = true) : (isValid = false);

    return isValid;
  }

  /**
   *
  */
 private markFieldsAdjustFactor(
   isNameValid: boolean,
   isAdjustTypeValid: boolean,
   isFactorValid: boolean) {
     (!isNameValid) ? (document.getElementById('nome_fator_ajuste')
        .setAttribute('style', 'border-color: red;')) : (this);
      (!isAdjustTypeValid) ? (document.getElementById('tipo_ajuste')
        .setAttribute('style', 'border-bottom: solid; border-bottom-color: red;')) : (this);
      (!isFactorValid) ? (document.getElementById('valor_fator')
        .setAttribute('style', 'border-bottom: solid; border-bottom-color: red;')) : (this);
  }

  /**
   *
  */
  private resetMarkedFieldsAdjustFactor() {
    document.getElementById('nome_fator_ajuste').setAttribute('style', 'border-color: #bdbdbd;');
    document.getElementById('tipo_ajuste').setAttribute('style', 'border-bottom: solid; border-bottom-color: #bdbdbd;');
    document.getElementById('valor_fator').setAttribute('style', 'border-color: #bdbdbd;');
    document.getElementById('codigo_fator').setAttribute('style', 'border-color: #bdbdbd;');
    document.getElementById('origem_fator').setAttribute('style', 'border-color: #bdbdbd;');
  }

  /**
   *
  */
  getFile() {
    this.loading = true;
    this.uploadService.getFile(this.manual.arquivoManualId).subscribe(response => {

      let fileInfo;
      // tslint:disable-next-line:no-shadowed-variable
      this.uploadService.getFileInfo(this.manual.arquivoManualId).subscribe(response => {
        fileInfo = response;

        this.fileInput.files.push(new File([response['_body']], fileInfo['originalName']));
        this.loading = false;
      });
    });
  }

  /**
   *
  */
  getFileInfo() {
    return this.uploadService.getFile(this.manual.arquivoManualId).subscribe(response => {
      return response;
    });
  }

  /**
   *
  */
  public habilitarDeflator(): boolean {
    if (this.newAdjustFactor.tipoAjuste !== undefined) {
      return false;
    }
    if (this.editedAdjustFactor.tipoAjuste !== undefined) {
      return false;
    }
    return true;
  }

}
