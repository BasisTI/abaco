import { Component, OnDestroy, OnInit, resolveForwardRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { Manual } from '../manual.model';
import { ManualService } from '../manual.service';
import { EsforcoFaseService } from '../../esforco-fase/esforco-fase.service';
import { EsforcoFase } from '../../esforco-fase/esforco-fase.model';
import { Fase, FaseService } from '../../fase';
import { DatatableClickEvent, DatatableComponent, PageNotificationService } from '@nuvem/primeng-components';
import { ConfirmationService } from 'primeng';
import { FatorAjuste, TipoFatorAjuste } from '../../fator-ajuste/fator-ajuste.model';
import { UploadService } from '../../upload/upload.service';
import { FileUpload, SelectItem } from 'primeng';
import { Upload } from 'src/app/upload/upload.model';

@Component({
    selector: 'app-manual-form',
    templateUrl: './manual-form.component.html',
    providers: [ManualService, ConfirmationService]
})
export class ManualFormComponent implements OnInit, OnDestroy {

    @ViewChild(DatatableComponent) dataTableFase: DatatableComponent;
    @ViewChild('dataTableFator') dataTableFator: DatatableComponent;

    manual: Manual;
    isSaving;
    isEdit;
    newUpload;
    validaEsforco;
    validaTipoFase;
    validaNomeDeflator;
    validaTipoDeflator;
    validaDescricaoDeflator;
    validaCodigoDeflator;
    validaDeflator: boolean;
    private routeSub: Subscription;
    arquivoManual: any[];
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
    showEditOrderDeflator = false;
    fatorAjusteSelected?: FatorAjuste = new FatorAjuste();
    esforcoFaseSelected?: EsforcoFase = new EsforcoFase();

    adjustTypes: Array<any> = [
        { label: 'Percentual', value: 'PERCENTUAL' },
        { label: 'Unitário', value: 'UNITARIO' }
    ];

    invalidFields: Array<string> = [];

    @ViewChild('fileInput') fileInput: FileUpload;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private manualService: ManualService,
        private tipoFaseService: FaseService,
        private confirmationService: ConfirmationService,
        private pageNotificationService: PageNotificationService,
        private uploadService: UploadService,
    ) {
    }

    getLabel(label) {
        return label;
    }

    ngOnInit() {
        this.newUpload = false;
        this.isSaving = false;
        this.routeSub = this.route.params.subscribe(params => {
            this.manual = new Manual();
            this.manual.fatoresAjuste = [];
            this.manual.esforcoFases = [];
            if (params['id']) {
                this.manualService.find(params['id']).subscribe(manual => {

                    this.manual = new Manual().copyFromJSON(manual);
                    this.isEdit = true;
                });
            }
        });

        this.tipoFaseService.findDropdown().subscribe((fases: SelectItem[]) => {
            // TODO remover essa conversão quando o DTO de manual for feito para se adequar ao DropdowDTO
            this.fases = fases.map(item => new Fase(item.value, item.label));
        });
        this.manual.versaoCPM = 431;
    }

    save(form: any) {
        if (!this.checkRequiredFields()) {
            this.pageNotificationService.addErrorMessage('Por favor, preencha campos obrigatórios!');
            return;
        }

        this.isSaving = true;
        this.manualService.query().subscribe(response => {
            const todosManuais = response;
            const fatoresAjuste: FatorAjuste[] = [];
            this.manual.fatoresAjuste.forEach((fatorAjuste, index) => {
                fatorAjuste.ordem = index + 1;
                fatoresAjuste.push(fatorAjuste);
            });
            this.manual.fatoresAjuste = fatoresAjuste;

            if (!this.checkIfManualAlreadyExists(todosManuais)) {
                if (this.manual.id !== undefined) {

                    this.editar();
                } else {
                    this.novo();
                }
            }
        });
    }
    private checkIfManualAlreadyExists(registeredPhases: Array<Fase>): boolean {
        let isAlreadyRegistered = false;
        if (registeredPhases) {
            registeredPhases.forEach(each => {
                if (each.nome === this.manual.nome && each.id !== this.manual.id) {
                    isAlreadyRegistered = true;
                    this.pageNotificationService.addErrorMessage('Já existe um Manual registrado com este nome!');
                }
            });
        }
        return isAlreadyRegistered;
    }

    private editar() {
        this.manualService.find(this.manual.id).subscribe((response) => {
            if (this.checkRequiredFields()) {
                this.subscribeToSaveResponse(this.manualService.update(this.manual, this.arquivoManual));
                this.isEdit = true;
            } else {
                this.privateExibirMensagemCamposInvalidos(1);
            }
        });
    }

    public confirmDelete(arquivoId: number, manualId: number) {
        let arquivo: Upload;

        this.uploadService.getFileInfo(arquivoId).subscribe(response => {
            arquivo = response;
        });

        this.confirmationService.confirm({
            message: 'Tem certeza que deseja excluir o arquivo?',
            accept: () => {
                this.uploadService.deleteFile(arquivoId, manualId).subscribe(response => {
                    this.manual.arquivosManual.splice(this.manual.arquivosManual.indexOf(arquivo, 1));
                    this.pageNotificationService.addSuccessMessage('Arquivo excluído com sucesso!');
                    this.refreshArquivos();
                });
            }
        });
    }

    refreshArquivos() {
        this.manualService.getFiles(this.manual.id).subscribe(response => {
            this.manual.arquivosManual = response;
        });
    }

    private novo() {

        if (this.arquivoManual) {
            if (this.checkRequiredFields()) {
                this.subscribeToSaveResponse(this.manualService.create(this.manual, this.arquivoManual));
            } else {
                this.privateExibirMensagemCamposInvalidos(1);
            }
        } else if (this.checkRequiredFields()) {
            this.subscribeToSaveResponse(this.manualService.create(this.manual, this.arquivoManual));
        } else {
            this.privateExibirMensagemCamposInvalidos(1);
        }
    }

    private checkRequiredFields(): boolean {
        this.invalidFields = [];
        let isFieldsValid = false;

        if (!this.manual.valorVariacaoEstimada || this.manual.valorVariacaoEstimada === undefined) {
            this.invalidFields.push('Valor Variação Estimada');
        }
        if (!this.manual.valorVariacaoIndicativa || this.manual.valorVariacaoIndicativa === undefined) {
            this.invalidFields.push('Valor Variação Estimada (%) *');
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

        if (this.manual.esforcoFases.length === 0 || this.manual.esforcoFases === undefined) {
            document.getElementById('tabela-tipo-fase').setAttribute('style', 'border: 1px dotted red;');
            this.invalidFields.push('Esforço Fases');
        }

        if (this.manual.fatoresAjuste.length === 0 || this.manual.fatoresAjuste === undefined) {
            document.getElementById('tabela-deflator').setAttribute('style', 'border: 1px dotted red;');
            this.invalidFields.push('Deflator');
        }

        isFieldsValid = (this.invalidFields.length === 0);

        return isFieldsValid;
    }

    privateExibirMensagemCamposInvalidos(codErro: number) {
        switch (codErro) {
            case 1:
                this.pageNotificationService.addErrorMessage('Campos inválidos: ' + this.getInvalidFieldsString());
                this.invalidFields = [];
                return;
            case 2:
                this.pageNotificationService.addErrorMessage('Campo Arquivo Manual está inválido!');
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

                if (error.headers['x-abacoapp-error'][0] === 'error.manualexists') {
                    this.pageNotificationService.addErrorMessage('Já existe um Manual registrado com este nome!');
                    document.getElementById('nome_manual').setAttribute('style', 'border-color: red;');
                }
            });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }

    uploadFile(event) {
        this.arquivoManual = [];

        for (let i = 0; i < event.currentFiles["length"]; i++) {
            this.arquivoManual.push(event.currentFiles[i]);

        }
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
                break;
            case 'order-up':
                this.orderList(event);
                break;
            case 'order-down':
                this.orderList(event);
                break;
            case 'order-top':
                this.orderList(event);
                break;
            case 'order-botton':
                this.orderList(event);
                break;
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
            message: 'Tem certeza que deseja excluir o Esforço por fase' + this.editedPhaseEffort.fase.nome + '?',
            accept: () => {
                this.manual.deleteEsforcoFase(this.editedPhaseEffort);
                this.pageNotificationService.addDeleteMsg();
                this.editedPhaseEffort = new EsforcoFase();
            }
        });
    }

    confirmDeleteAdjustFactor() {
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja excluir o Fator de Ajuste' + this.editedAdjustFactor.nome + '?',
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

        let totalPhase = this.getPhaseEffortTotalPercentual();
        console.log(this.getPhaseEffortTotalPercentual());
        if (totalPhase >= 100) {
            this.pageNotificationService.addErrorMessage('Limite de Esforço Excedido');
        } else if (this.checkPhaseEffortRequiredFields(this.editedPhaseEffort)) {
            this.manual.updateEsforcoFases(this.editedPhaseEffort);
            this.pageNotificationService.addUpdateMsg();
            this.closeDialogPhaseEffort();
        } else {
            this.pageNotificationService.addErrorMessage('Por favor, preencha campos obrigatórios!');
        }
    }

    editAdjustFactor() {
        if (this.checkAdjustFactorRequiredFields(this.editedAdjustFactor)) {
            this.manual.updateFatoresAjuste(this.editedAdjustFactor);
            this.pageNotificationService.addUpdateMsg();
            this.closeDialogEditAdjustFactor();
        } else {
            this.pageNotificationService.addErrorMessage('Por favor, preencha campos obrigatórios!');
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
        let totalPhase = this.newPhaseEffort.esforco;
        this.manual.esforcoFases.forEach(function (esforcoFase) {
            totalPhase = totalPhase + esforcoFase.esforco;
        });
        if (totalPhase > 100) {
            this.pageNotificationService.addErrorMessage('Limite de Esforço Excedido');
        } else if (this.checkPhaseEffortRequiredFields(this.newPhaseEffort)) {
            this.manual.addEsforcoFases(this.newPhaseEffort);
            this.pageNotificationService.addCreateMsg();
            this.closeDialogPhaseEffort();
        } else {
            this.pageNotificationService.addErrorMessage('Por favor, preencha campos obrigatórios!');
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
        this.validaDescricaoDeflator = false;
        this.validaCodigoDeflator = false;
        this.showDialogCreateAdjustFactor = true;
    }

    closeDialogCreateAdjustFactor() {
        this.validaTipoDeflator = false;
        this.validaDeflator = false;
        this.validaNomeDeflator = false;
        this.validaDescricaoDeflator = false;
        this.validaCodigoDeflator = false;
        this.showDialogCreateAdjustFactor = false;
        this.newAdjustFactor = new FatorAjuste();
    }

    openDialogEditAdjustFactor() {
        this.validaTipoDeflator = false;
        this.validaDeflator = false;
        this.validaNomeDeflator = false;
        this.validaDescricaoDeflator = false;
        this.validaCodigoDeflator = false;
        this.showDialogEditAdjustFactor = true;
    }

    closeDialogEditAdjustFactor() {
        this.validaTipoDeflator = false;
        this.validaDeflator = false;
        this.validaNomeDeflator = false;
        this.validaDescricaoDeflator = false;
        this.validaCodigoDeflator = false;
        this.showDialogEditAdjustFactor = false;
        this.editedAdjustFactor = new FatorAjuste();
    }

    addAdjustFactor() {
        this.newAdjustFactor.ativo = true;
        if (this.checkAdjustFactorRequiredFields(this.newAdjustFactor)) {
            this.manual.addFatoresAjuste(this.newAdjustFactor);
            document.getElementById('tabela-deflator').removeAttribute('style');
            this.pageNotificationService.addCreateMsg('Deflator incluído com sucesso!');
            this.closeDialogCreateAdjustFactor();
        } else {
            this.pageNotificationService.addErrorMessage('Por favor, preencha campos obrigatórios!');
        }
    }

    private checkAdjustFactorRequiredFields(adjustFactor: FatorAjuste): boolean {
        let isNameValid = false;
        let isAdjustTypeValid = false;
        let isFactorValid = false;
        let isAdjustFactorValid = false;
        let isDescriptionValid = false;
        let isCodeValid = false;

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

        if (adjustFactor.descricao) {
            isDescriptionValid = true;
        } else {
            isDescriptionValid = false;
            this.validaDescricaoDeflator = true;
        }

        if (adjustFactor.codigo) {
            isCodeValid = true;
        } else {
            isCodeValid = false;
            this.validaCodigoDeflator = true;
        }

        (isNameValid && isAdjustTypeValid && isFactorValid && isDescriptionValid && isCodeValid) ? (isAdjustFactorValid = true) : (isAdjustFactorValid = false);

        return isAdjustFactorValid;
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

    public formatNumberTwoDecimal(event) {
        let formatNumber = event.target.value.replace(',', '.');
        if (formatNumber) {
            formatNumber = parseFloat(formatNumber).toFixed(2).toString();
            event.target.value = formatNumber.replace('.', ',');
        }
    }

    public openEditOrderDeflator() {
        this.showEditOrderDeflator = true;
    }

    public onRowDblclickFase(event) {
        if (event.target.nodeName === 'TD') {
            this.editedPhaseEffort = this.editedPhaseEffort.clone();
            this.openDialogEditPhaseEffort();
        } else if (event.target.parentNode.nodeName === 'TD') {
            this.editedPhaseEffort = this.editedPhaseEffort.clone();
            this.openDialogEditPhaseEffort();
        }
    }

    public selectFase() {
        if (this.dataTableFase && this.dataTableFase.selectedRow) {
            if (this.dataTableFase.selectedRow && this.dataTableFase.selectedRow) {
                this.editedPhaseEffort = this.dataTableFase.selectedRow;
            }
        }
    }
    public onRowDblclickFator(event) {
        if (event.target.nodeName === 'TD') {
            this.openDialogEditAdjustFactor();
        } else if (event.target.parentNode.nodeName === 'TD') {
            this.openDialogEditAdjustFactor();
        }
    }

    public selectFator() {
        if (this.dataTableFator && this.dataTableFator.selectedRow) {
            if (this.dataTableFator.selectedRow && this.dataTableFator.selectedRow) {
                this.editedAdjustFactor = this.dataTableFator.selectedRow;
              }
          }
      }

    public updateIndex(){
        let temp =1
        for(let i =0; i < this.manual.fatoresAjuste.length; i++){
            this.manual.fatoresAjuste[i].ordem = temp
            temp++
        }
    }
    
    public orderList(event){
     
        let i = this.manual.fatoresAjuste.indexOf(event.selection)
        let del = i

        if (event.button == 'order-top' && event.selection != null) {
            if(i == 0){
                return
            } else{
                this.manual.fatoresAjuste.splice(del, 1);
                this.manual.fatoresAjuste.unshift(event.selection);
            }
        } 

        if(event.button == 'order-up' && event.selection != null){
            if(i == 0){
                return
            } else{
                let pos = i -1
                this.manual.fatoresAjuste.splice(del, 1)
                this.manual.fatoresAjuste.splice( pos,0, event.selection)
                this.manual.fatoresAjuste.indexOf(event.selection)
            }
        }
        
        if (event.button == 'order-down' && event.selection != null) {
            if(i == this.manual.fatoresAjuste.length -1){
                return 
            } else{
                let pos = i +1; 
                this.manual.fatoresAjuste.splice(del, 1);
                this.manual.fatoresAjuste.splice( pos,0, event.selection);
                this.manual.fatoresAjuste.indexOf(event.selection);
            }

        } 

        if(event.button == 'order-botton' && event.selection != null){
            if(i == this.manual.fatoresAjuste.length-1){
                return
            }
            this.manual.fatoresAjuste.splice(del, 1);
            this.manual.fatoresAjuste.push(event.selection);
            this.manual.fatoresAjuste.indexOf(event.selection);
        }
        
        this.updateIndex()
    }
}
