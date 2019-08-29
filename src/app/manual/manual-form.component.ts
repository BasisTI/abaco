import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';

import { Manual } from './manual.model';
import { ManualService } from './manual.service';
import { EsforcoFaseService } from '../esforco-fase/esforco-fase.service';
import { ResponseWrapper } from '../shared';
import { EsforcoFase } from '../esforco-fase/esforco-fase.model';
import { FaseService, Fase } from '../fase';
import { DatatableClickEvent } from '@basis/angular-components';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { FatorAjuste, TipoFatorAjuste } from '../fator-ajuste/fator-ajuste.model';
import { PageNotificationService } from '../shared/page-notification.service';
import { UploadService } from '../upload/upload.service';
import { FileUpload } from 'primeng/primeng';

@Component({
    selector: 'jhi-manual-form',
    templateUrl: './manual-form.component.html',
})
export class ManualFormComponent implements OnInit, OnDestroy {
    manual: Manual;
    isSaving;
    isEdit; newUpload; validaEsforco; validaTipoFase; validaNomeDeflator; validaTipoDeflator; validaDeflator: boolean;
    private routeSub: Subscription;
    arquivoManual: File;
    esforcoFases: Array<EsforcoFase>;
    showDialogPhaseEffort = false;
    showDialogEditPhaseEffort = false;
    showDialogCreateAdjustFactor = false;
    showDialogEditAdjustFactor = false;
    fases: Fase[] = [];
    percentual: number;
    newPhaseEffort: EsforcoFase = new EsforcoFase();
    editedPhaseEffort: EsforcoFase = new EsforcoFase();
    newAdjustFactor: FatorAjuste = new FatorAjuste();
    editedAdjustFactor: FatorAjuste = new FatorAjuste();

    adjustTypes: Array<any> = [
        { label: 'Percentual', value: 'PERCENTUAL' },
        { label: 'Unitário', value: 'UNITARIO' }
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
        private tipoFaseService: FaseService,
        private confirmationService: ConfirmationService,
        private pageNotificationService: PageNotificationService,
        private uploadService: UploadService,
        private translate: TranslateService
    ) {
    }

    getLabel(label) {
        let str: any;
        this.translate.get(label).subscribe((res: string) => {
            str = res;
        }).unsubscribe();
        return str;
    }

    ngOnInit() {
        this.traduzirClassificacoes();
        this.newUpload = false;
        this.isSaving = false;
        this.routeSub = this.route.params.subscribe(params => {
            this.manual = new Manual();
            this.manual.fatoresAjuste = [];
            this.manual.esforcoFases = [];
            if (params['id']) {
                this.manualService.find(params['id']).subscribe(manual => {
                    this.manual = manual;
                    this.isEdit = true;
                    if (this.manual.arquivoManualId) {
                        this.getFile();
                    }
                });
            }
        });

        this.tipoFaseService.findDropdown().subscribe((fases: Fase[]) => {
            this.fases = fases;
        });
        this.manual.versaoCPM = 431;
    }

    /**
     *
     */
    save(form: any) {
        if (!this.checkRequiredFields()) {
            this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.FavorPreencherCamposObrigatorios'));
            return;
        }

        this.isSaving = true;
        this.manualService.query().subscribe(response => {
            const todosManuais = response;

            if (!this.checkIfManualAlreadyExists(todosManuais.json)) {
                if (this.manual.id !== undefined) {
                    this.editar();
                } else {
                    this.novo();
                }
            }
        });
    }

    /*
    *   Metodo responsavel por traduzir as adjustTypes
    */
    traduzirClassificacoes() {
        this.translate.stream(['Cadastros.Manual.Percentual', 'Cadastros.Manual.Unitario']).subscribe((traducao) => {
            this.adjustTypes = [
                { label: traducao['Cadastros.Manual.Percentual'], value: 'PERCENTUAL' },
                { label: traducao['Cadastros.Manual.Unitario'], value: 'UNITARIO' },
            ];
        })
    }

    private checkIfManualAlreadyExists(registeredPhases: Array<Fase>): boolean {
        let isAlreadyRegistered = false;
        if (registeredPhases) {
            registeredPhases.forEach(each => {
                if (each.nome === this.manual.nome && each.id !== this.manual.id) {
                    isAlreadyRegistered = true;
                    this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Manual.msgJaExisteUmManualRegistradoComEsteNome'));
                }
            });
        }
        return isAlreadyRegistered;
    }

    private editar() {
        this.manualService.find(this.manual.id).subscribe(() => {
            const oldId = this.manual.arquivoManualId;
            if (this.checkRequiredFields()) {
                if (this.newUpload) {
                    this.uploadService.uploadFile(this.arquivoManual).subscribe(response => {
                        this.manual.arquivoManualId = response.id;
                        this.isEdit = true;
                        this.uploadService.deleteFile(oldId);
                        this.subscribeToSaveResponse(this.manualService.update(this.manual));
                    });
                } else {
                    this.isEdit = true;
                    this.subscribeToSaveResponse(this.manualService.update(this.manual));
                }
            } else {
                this.privateExibirMensagemCamposInvalidos(1);
            }
        });
    }

    private novo() {

        if (this.arquivoManual) {
            if (this.checkRequiredFields()) {
                this.uploadService.uploadFile(this.arquivoManual).subscribe(response => {
                    this.manual.arquivoManualId = response.id;
                    this.subscribeToSaveResponse(this.manualService.create(this.manual));
                });
            } else {
                this.privateExibirMensagemCamposInvalidos(1);
            }
        } else if (this.checkRequiredFields()) {
            this.subscribeToSaveResponse(this.manualService.create(this.manual));
        } else {
            this.privateExibirMensagemCamposInvalidos(1);
        }
    }

    private checkRequiredFields(): boolean {
        this.invalidFields = [];
        let isFieldsValid = false;

        if (!this.manual.valorVariacaoEstimada || this.manual.valorVariacaoEstimada === undefined) {
            this.invalidFields.push(this.getLabel('Cadastros.Manual.ValorVariacaoEstimada'));
        }
        if (!this.manual.valorVariacaoIndicativa || this.manual.valorVariacaoIndicativa === undefined) {
            this.invalidFields.push(this.getLabel('Cadastros.Manual.ValorVariacaoIndicativa'));
        }
        if (!this.manual.nome || this.manual.nome === undefined) {
            this.invalidFields.push(this.getLabel('Cadastros.Manual.Nome'));
        }
        if (!this.manual.parametroInclusao || this.manual.parametroInclusao === undefined) {
            this.invalidFields.push(this.getLabel('Cadastros.Manual.Inclusao'));
        }
        if (!this.manual.parametroAlteracao || this.manual.parametroAlteracao === undefined) {
            this.invalidFields.push(this.getLabel('Cadastros.Manual.Alteracao'));
        }
        if (!this.manual.parametroExclusao || this.manual.parametroExclusao === undefined) {
            this.invalidFields.push(this.getLabel('Cadastros.Manual.Exclusao'));
        }
        if (!this.manual.parametroConversao || this.manual.parametroConversao === undefined) {
            this.invalidFields.push(this.getLabel('Cadastros.Manual.Conversao'));
        }

        if (this.manual.esforcoFases.length === 0 || this.manual.esforcoFases === undefined) {
            document.getElementById('tabela-tipo-fase').setAttribute('style', 'border: 1px dotted red;');
            this.invalidFields.push(this.getLabel('Cadastros.Manual.EsforcoFases'));
        }

        if (this.manual.fatoresAjuste.length === 0 || this.manual.fatoresAjuste === undefined) {
            document.getElementById('tabela-deflator').setAttribute('style', 'border: 1px dotted red;');
            this.invalidFields.push(this.getLabel('Cadastros.Manual.Deflator'));
        }

        isFieldsValid = (this.invalidFields.length === 0);

        return isFieldsValid;
    }

    privateExibirMensagemCamposInvalidos(codErro: number) {
        switch (codErro) {
            case 1:
                this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Manual.msgCamposInvalidos') + this.getInvalidFieldsString());
                this.invalidFields = [];
                return;
            case 2:
                this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Manual.msgCampoArquivoManualEstaInvalido'));
                return;
        }
    }

    private getInvalidFieldsString(): string {
        let invalidFieldsString = '';

        if (this.invalidFields) {
            this.invalidFields.forEach(invalidField => {
                if (invalidField === this.invalidFields[this.invalidFields.length - 1]) {
                    invalidFieldsString = invalidFieldsString + invalidField;
                } else {
                    invalidFieldsString = invalidFieldsString + invalidField + ', ';
                }
            });
        }

        return invalidFieldsString;
    }

    private subscribeToSaveResponse(result: Observable<Manual>) {
        result.subscribe((res: Manual) => {
            this.isSaving = false;
            this.router.navigate(['/manual']);
            this.isEdit ? this.pageNotificationService.addUpdateMsg() : this.pageNotificationService.addCreateMsg();
        },
            (error: Response) => {
                this.isSaving = false;

                if (error.headers.toJSON()['x-abacoapp-error'][0] === 'error.manualexists') {
                    this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Manual.msgJaExisteUmManualRegistradoComEsteNome'));
                    document.getElementById('nome_manual').setAttribute('style', 'border-color: red;');
                }
            });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }

    uploadFile(event: any) {
        this.arquivoManual = event.files[0];
        this.newUpload = true;
    }

    datatableClick(event: DatatableClickEvent) {
        if (!event.selection) {
            return;
        }
        switch (event.button) {
            case 'edit':
                this.editedPhaseEffort = event.selection.clone();
                this.openDialogEditPhaseEffort();
                break;
            case 'delete':
                this.editedPhaseEffort = event.selection.clone();
                this.confirmDeletePhaseEffort();
        }
    }

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
                this.editedAdjustFactor = event.selection.clone();
                this.confirmDeleteAdjustFactor();
        }
    }

    isPercentualEnum(value: TipoFatorAjuste) {
        return (value !== undefined) ? (value.toString() === 'PERCENTUAL') : (false);
    }

    isUnitaryEnum(value: TipoFatorAjuste) {
        return (value !== undefined) ? (value.toString() === 'UNITARIO') : (false);
    }

    confirmDeletePhaseEffort() {
        this.confirmationService.confirm({
            message: this.getLabel('Cadastros.Manual.Mensagens.msgTemCertezaQueDesejaExcluirEsforcoPorFase') + this.editedPhaseEffort.fase.nome + '?',
            accept: () => {
                this.manual.deleteEsforcoFase(this.editedPhaseEffort);
                this.pageNotificationService.addDeleteMsg();
                this.editedPhaseEffort = new EsforcoFase();
            }
        });
    }

    confirmDeleteAdjustFactor() {
        this.confirmationService.confirm({
            message: this.getLabel('Cadastros.Manual.Mensagens.msgTemCertezaQueDesejaExcluirFatorAjuste') + this.editedAdjustFactor.nome + '?',
            accept: () => {
                this.manual.deleteFatoresAjuste(this.editedAdjustFactor);
                this.pageNotificationService.addDeleteMsg();
                this.editedAdjustFactor = new FatorAjuste();
            }
        });
    }

    openDialogPhaseEffort(editForm1) {
        this.newPhaseEffort = new EsforcoFase();
        this.showDialogPhaseEffort = true;
    }

    openDialogEditPhaseEffort() {
        this.showDialogEditPhaseEffort = true;
    }

    editPhaseEffort() {
        if (this.checkPhaseEffortRequiredFields(this.editedPhaseEffort)) {
            this.manual.updateEsforcoFases(this.editedPhaseEffort);
            //            this.pageNotificationService.addUpdateMsg();
            this.closeDialogEditPhaseEffort();
        } else {
            this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.FavorPreencherCamposObrigatorios'));
        }
    }

    editAdjustFactor() {
        if (this.checkAdjustFactorRequiredFields(this.editedAdjustFactor)) {
            this.manual.updateFatoresAjuste(this.editedAdjustFactor);
            this.pageNotificationService.addUpdateMsg();
            this.closeDialogEditAdjustFactor();
        } else {
            this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.FavorPreencherCamposObrigatorios'));
        }
    }

    closeDialogPhaseEffort() {
        document.getElementById('tabela-tipo-fase').removeAttribute('style');
        this.newPhaseEffort = new EsforcoFase();
        this.showDialogPhaseEffort = false;
        this.validaEsforco = false;
        this.validaTipoFase = false;
    }

    closeDialogEditPhaseEffort() {
        this.editedPhaseEffort = new EsforcoFase();
        this.showDialogEditPhaseEffort = false;
    }

    addPhaseEffort() {
        this.newPhaseEffort.esforco = this.newPhaseEffort.esforco;
        if (this.checkPhaseEffortRequiredFields(this.newPhaseEffort)) {
            this.manual.addEsforcoFases(this.newPhaseEffort);
            this.pageNotificationService.addCreateMsg();
            this.closeDialogPhaseEffort();
        } else {
            this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.FavorPreencherCamposObrigatorios'));
        }
    }

    private checkPhaseEffortRequiredFields(phaseEffort: EsforcoFase): boolean {
        let isPhaseNameValid = false;
        let isPhaseEffortValid = false;
        let isEffortValid = false;

        (phaseEffort.fase) ? (isPhaseNameValid = true) : (isPhaseNameValid = false);

        if (phaseEffort.fase) {
            isPhaseNameValid = true;
        } else {
            this.validaTipoFase = true;
            isPhaseNameValid = false;
        }

        if (phaseEffort.esforco) {
            isEffortValid = true;
        } else {
            this.validaEsforco = true;
            isEffortValid = false;
        }

        (isPhaseNameValid && isEffortValid) ? (isPhaseEffortValid = true) : (isPhaseEffortValid = false);

        return isPhaseEffortValid;
    }

    getPhaseEffortTotalPercentual() {
        let total = 0;
        if (this.manual.esforcoFases) {
            this.manual.esforcoFases.forEach(each => {
                (each.esforco !== undefined) ? (total = total + each.esforcoFormatado) : (total = total);
            });
        }

        return total;
    }

    openDialogCreateAdjustFactor(editForm2) {
        this.newAdjustFactor = new FatorAjuste();
        this.validaTipoDeflator = false;
        this.validaDeflator = false;
        this.validaNomeDeflator = false;
        this.showDialogCreateAdjustFactor = true;
    }

    closeDialogCreateAdjustFactor() {
        this.validaTipoDeflator = false;
        this.validaDeflator = false;
        this.validaNomeDeflator = false;
        this.showDialogCreateAdjustFactor = false;
        this.newAdjustFactor = new FatorAjuste();
    }

    openDialogEditAdjustFactor() {
        this.validaTipoDeflator = false;
        this.validaDeflator = false;
        this.validaNomeDeflator = false;
        this.showDialogEditAdjustFactor = true;
    }

    closeDialogEditAdjustFactor() {
        this.validaTipoDeflator = false;
        this.validaDeflator = false;
        this.validaNomeDeflator = false;
        this.showDialogEditAdjustFactor = false;
        this.editedAdjustFactor = new FatorAjuste();
    }

    addAdjustFactor() {
        this.newAdjustFactor.ativo = true;
        if (this.checkAdjustFactorRequiredFields(this.newAdjustFactor)) {
            this.manual.addFatoresAjuste(this.newAdjustFactor);
            document.getElementById('tabela-deflator').removeAttribute('style');
            this.pageNotificationService.addCreateMsg(this.getLabel('Cadastros.Manual.Mensagens.msgDeflatorIncluidoComSucesso'));
            this.closeDialogCreateAdjustFactor();
        } else {
            this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.FavorPreencherCamposObrigatorios'));
        }
    }

    private checkAdjustFactorRequiredFields(adjustFactor: FatorAjuste): boolean {
        let isNameValid = false;
        let isAdjustTypeValid = false;
        let isFactorValid = false;
        let isAdjustFactorValid = false;

        (adjustFactor.nome) ? (isNameValid = true) : (isNameValid = false);

        if (adjustFactor.nome) {
            isNameValid = true;
        } else {
            isNameValid = false;
            this.validaNomeDeflator = true;
        }

        if (adjustFactor.tipoAjuste) {
            isAdjustTypeValid = true;
        } else {
            isAdjustTypeValid = false;
            this.validaTipoDeflator = true;
        }

        if (adjustFactor.fator) {
            isFactorValid = true;
        } else {
            isFactorValid = false;
            this.validaDeflator = true;
        }

        (isNameValid && isAdjustTypeValid && isFactorValid) ? (isAdjustFactorValid = true) : (isAdjustFactorValid = false);

        return isAdjustFactorValid;
    }

    private checkRequiredField(field: any) {
        let isValid = false;

        (field) ? (isValid = true) : (isValid = false);

        return isValid;
    }

    getFile() {
        this.uploadService.getFile(this.manual.arquivoManualId).subscribe(response => {
            this.arquivoManual = response;
        });
    }

    getFileInfo() {
        return this.uploadService.getFile(this.manual.arquivoManualId).subscribe(response => {
            return response;
        });
    }

    public habilitarDeflator(): boolean {
        if (this.newAdjustFactor.tipoAjuste !== undefined) {
            return false;
        }
        if (this.editedAdjustFactor.tipoAjuste !== undefined) {
            return false;
        }
        return true;
    }

    fecharEsforcoFase() {
        this.newPhaseEffort = new EsforcoFase();
        this.showDialogPhaseEffort = false;
        this.validaEsforco = false;
        this.validaTipoFase = false;
    }
}
