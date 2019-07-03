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
import { FileUpload } from 'primeng/primeng';
import { NgxMaskModule } from 'ngx-mask';
import { ValidacaoUtil } from '../util/validacao.util';
import { ValueTransformer } from '@angular/compiler/src/util';
import { Upload } from '../upload/upload.model';
import { EsforcoFase } from '../esforco-fase';
import { ManualContrato } from './ManualContrato.model';
import { TranslateService } from '@ngx-translate/core';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'jhi-organizacao-form',
    templateUrl: './organizacao-form.component.html'
})
export class OrganizacaoFormComponent implements OnInit, OnDestroy {

    private routeSub: Subscription;

    contratos: Contrato[] = [];
    organizacao: Organizacao;
    isSaving;
    manualInvalido;
    numeroContratoInvalido;
    isEdit;
    validaNumeroContrato;
    validaManual;
    validaDataInicio;
    validaDataFinal;
    validaDiasGarantia: boolean;
    showDialogContrato = false;
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
    manuaisAdicionados: ManualContrato[] = [];
    novoManual: Manual;
    inicioVigencia;
    fimVigencia;
    manualInicioVigencia: Date;
    manualFimVigencia: Date;
    garantia: Number;
    ativo;
    manualAtivo: boolean;
    manualContratoEdt: ManualContrato = new ManualContrato();
    manualContratoNovo: ManualContrato = new ManualContrato();
    indiceManual: number;
    manuaisEdt: SelectItem[] = [];
    manualEdt: Manual;

    @ViewChild('fileInput') fileInput: FileUpload;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private organizacaoService: OrganizacaoService,
        private contratoService: ContratoService,
        private manualService: ManualService,
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

    /**
     *
     * */
    ngOnInit() {
        this.isEdit = false;
        this.cnpjValido = false;
        this.isSaving = false;
        this.manualService.queryDropdown().subscribe((res: ResponseWrapper) => {
            this.manuais = res.json;
        });
        this.routeSub = this.route.params.subscribe(params => {
            this.organizacao = new Organizacao();
            if (params['id']) {

                this.organizacaoService.find(params['id']).subscribe(organizacao => {
                    this.organizacao = organizacao;
                    if (this.organizacao.logoId != undefined && this.organizacao.logoId != null)
                        this.uploadService.getLogo(organizacao.logoId).subscribe(response => {
                            this.logo = response.logo;
                        });
                    // this.getFile();
                });
            }
        });
        this.organizacao.ativo = true;
    }

    /**
     *
     * */
    abrirDialogCadastroContrato(editForm1) {
        this.mostrarDialogCadastroContrato = true;
        this.novoContrato.ativo = true;
        this.numeroContratoInvalido = false;
        this.novoContrato.diasDeGarantia = null;
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
        if (!(this.novoContrato.dataInicioValida()) || !(this.contratoEmEdicao.dataInicioValida())) {
            this.pageNotificationService.addErrorMsg('A data de início da vigência não pode ser posterior à data de término da vigência!');
            // document.getElementById('login').setAttribute('style', 'border-color: red;');
        }
    }

    /**
     *
     * */
    private doFecharDialogCadastroContrato() {
        this.mostrarDialogCadastroContrato = false;
        this.novoContrato = new Contrato();
    }

    validaCamposContrato(contrato: Contrato): boolean {

        let a = true;

        if (contrato.numeroContrato === null || contrato.numeroContrato === undefined) {
            this.numeroContratoInvalido = true;
            this.pageNotificationService.addErrorMsg('Favor preencher o número do contrato');
            a = false;
        }
        if ((contrato.manualContrato === null || contrato.manualContrato === undefined)
            || (contrato.manualContrato.length <= 0)) {
            this.manualInvalido = true;
            this.pageNotificationService.addErrorMsg('Deve haver ao menos um manual');
            a = false;
        }
        if (!(contrato.dataInicioValida()) && (contrato.dataInicioVigencia != null
            || contrato.dataInicioVigencia !== undefined)
            && (contrato.dataFimVigencia != null || contrato.dataFimVigencia !== undefined)) {
            this.pageNotificationService.addErrorMsg('A data de início da vigência não pode ser posterior à data de término da vigência!');
            a = false;
        }
        if (contrato.dataInicioVigencia === null || contrato.dataInicioVigencia === undefined) {
            this.pageNotificationService.addErrorMsg('Preencher data de início da vigência');
            a = false;
        }
        if (contrato.dataFimVigencia === null || contrato.dataFimVigencia === undefined) {
            this.pageNotificationService.addErrorMsg('Preencher data de fim da vigência');
            a = false;
        }
        if (contrato.diasDeGarantia === null || contrato.diasDeGarantia === undefined) {
            this.pageNotificationService.addErrorMsg('Preencher Dias de Garantia!');
            a = false;
        }

        return a;
    }

    adicionarContrato() {

        if (this.validaCamposContrato(this.novoContrato)) {
            document.getElementById('tabela-contrato').removeAttribute('style');
            this.organizacao.addContrato(this.novoContrato);
            this.doFecharDialogCadastroContrato();
        }
    }

    validaDadosManual(manualContratoTemp: ManualContrato) {
        let verificador = true;
        if (manualContratoTemp.ativo === undefined || manualContratoTemp.ativo === null) {
            this.pageNotificationService.addErrorMsg('Informe se o manual é ativo ou não');
            verificador = false;
        }
        if (manualContratoTemp.dataFimVigencia === undefined || manualContratoTemp.dataFimVigencia === null) {
            this.pageNotificationService.addErrorMsg('Preencher data de fim da vigência do manual');
            verificador = false;
        }
        if (manualContratoTemp.dataInicioVigencia === undefined || manualContratoTemp.dataInicioVigencia === null) {
            this.pageNotificationService.addErrorMsg('Preencher data de início da vigência do manual');
            verificador = false;
        }
        if (manualContratoTemp.manual === undefined || manualContratoTemp.manual === null) {
            this.pageNotificationService.addErrorMsg('Selecione um manual');
            verificador = false;
        }
        return verificador;
    }

    adicionarManual() {
        if (this.validaDadosManual(this.manualContratoNovo)) {
            if (
                this.manualContratoNovo.artificialId !== undefined
                &&
                this.manualContratoNovo.artificialId != null
            ) {
                const manualContratoTemp = this.manualContratoNovo.clone();
                this.novoContrato.updateManualContrato(manualContratoTemp);
            } else {
                const manualContratoTemp = this.setManualContrato(this.manualContratoNovo);
                this.novoContrato.addManualContrato(manualContratoTemp);
            }
            this.validaManual = false;
            this.manualContratoNovo = new ManualContrato();
        }
    }

    adicionarManualEdt() {
        if (this.validaDadosManual(this.manualContratoEdt)) {
            if (
                this.manualContratoEdt.id !== undefined
                &&
                this.manualContratoEdt.id != null
            ) {
                const manualContratoTemp = this.manualContratoEdt.clone();
                this.contratoEmEdicao.updateManualContrato(manualContratoTemp);
            } else {
                const manualContratoTemp = this.setManualContrato(this.manualContratoEdt);
                this.contratoEmEdicao.addManualContrato(manualContratoTemp);
            }
            this.validaManual = false;
            this.manualContratoEdt = new ManualContrato();
        }
    }

    resetObj(manualContrato: ManualContrato) {
        manualContrato = new ManualContrato();
    }

    setManualContrato(manualContrato: ManualContrato): ManualContrato {
        let manualContratoCopy = new ManualContrato(null, null,
            manualContrato.manual,
            /**contrato deve ser null para não loop */null,
            manualContrato.dataInicioVigencia,
            manualContrato.dataFimVigencia,
            manualContrato.ativo);
        return manualContratoCopy;
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

    manualContratoTableClick(event: DatatableClickEvent) {
        if (!event.selection) {
            return;
        }
        switch (event.button) {
            case 'edit':
                this.manualContratoEdt = event.selection.clone();
                break;
            case 'delete':
                this.manualContratoEdt = event.selection.clone();
                this.comfirmarExcluirManual();
                break;
        }
    }

    manualContratoTableClickNovo(event: DatatableClickEvent) {
        if (!event.selection) {
            return;
        }
        switch (event.button) {
            case 'edit':
                this.manualContratoNovo = event.selection.clone();
                break;
            case 'delete':
                this.manualContratoNovo = event.selection.clone();
                this.comfirmarExcluirManualNovo();
                break;
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
        if (!this.manualContratoEdt.id === undefined
            && (this.manualContratoEdt.manual !== undefined && this.manualContratoEdt.manual !== null)
        ) {
            this.contratoEmEdicao.addManualContrato(this.manualContratoEdt.clone());
        } else if (this.manualContratoEdt.manual !== undefined && this.manualContratoEdt.manual !== null) {
            this.contratoEmEdicao.updateManualContrato(this.manualContratoEdt);
        }
        if (this.validaCamposContrato(this.contratoEmEdicao)) {
            this.manualContratoEdt = new ManualContrato();
            this.organizacao.updateContrato(this.contratoEmEdicao);
            this.fecharDialogEditarContrato();
            this.novoContrato.diasDeGarantia = undefined;
        }
    }

    /**
     *
     * */
    confirmDeleteContrato() {
        this.confirmationService.confirm({
            message: `${this.getLabel('Cadastros.Organizacao.Mensagens.msgTemCertezaQueDesejaExcluirContrato')} '${this.contratoEmEdicao.numeroContrato}'
            ${this.getLabel('Cadastros.Organizacao.Mensagens.msgETodasAsSuasFuncionalidades')}`,
            accept: () => {
                this.organizacao.deleteContrato(this.contratoEmEdicao);
                this.contratoEmEdicao = new Contrato();
            }
        });
    }

    comfirmarExcluirManual() {
        this.confirmationService.confirm({
            message: `${this.getLabel('Cadastros.Organizacao.Mensagens.msgTemCertezaQueDesejaExcluirManual')} ${this.manualContratoEdt.manual.nome}'
        ?`,
            accept: () => {
                this.contratoEmEdicao.deleteManualContrato(this.manualContratoEdt);
                this.manualContratoEdt = new ManualContrato();
            }
        });
    }

    comfirmarExcluirManualNovo() {
        this.confirmationService.confirm({
            message: `${this.getLabel('Cadastros.Organizacao.Mensagens.msgTemCertezaQueDesejaExcluirManual')} ${this.manualContratoEdt.manual.nome}'
        ?`,
            accept: () => {
                this.novoContrato.deleteManualContrato(this.manualContratoNovo);
                this.manualContratoNovo = new ManualContrato();
            }
        });
    }

    /**
     *
     * */
    save(form) {
        this.cnpjValido = false;
        if (!this.organizacao.nome) {
            this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Organizacao.Mensagens.msgCampoNomeObrigatorio'));
            return;
        }

        if (!this.organizacao.sigla) {
            this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Organizacao.Mensagens.msgCampoSiglaObrigatorio'));
            return;
        }

        this.isSaving = true;
        if (!this.organizacao.cnpj) {
            this.cnpjValido = true;
            this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Organizacao.Mensagens.msgCampoCNPJObrigatorio'));
            return;
        }

        if (this.organizacao.cnpj !== ' ') {
            if (!ValidacaoUtil.validarCNPJ(this.organizacao.cnpj)) {
                this.cnpjValido = true;
                this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Organizacao.Mensagens.msgCNPJInvalido'));
                return;
            }
        }

        if (this.organizacao.contracts.length === 0 || this.organizacao.contracts === undefined) {
            document.getElementById('tabela-contrato').setAttribute('style', 'border: 1px dotted red;');
            this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Organizacao.Mensagens.msgPeloMenosUmContratoObrigatorioPorOrganizacao'));
            return;
        }

        this.organizacaoService.dropDown().subscribe(response => {
            const todasOrganizacoes = response;
            if (!this.checkIfOrganizacaoAlreadyExists(todasOrganizacoes.json)
                && !this.checkIfCnpjAlreadyExists(todasOrganizacoes.json)) {

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
        if (this.newLogo !== undefined && this.newLogo != null) {
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
        if (organizacoesRegistradas) {
            organizacoesRegistradas.forEach(each => {
                if (each.nome.toUpperCase() === this.organizacao.nome.toUpperCase() && each.id !== this.organizacao.id) {
                    isAlreadyRegistered = true;
                    this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Organizacao.Mensagens.msgJaExisteUmaOrganizacaoRegistradaComEsteNome'));
                }
            });
        }
        return isAlreadyRegistered;
    }

    checkIfCnpjAlreadyExists(organizacoesRegistradas: Array<Organizacao>): boolean {
        let isAlreadyRegistered = false;
        if (organizacoesRegistradas) {
            organizacoesRegistradas.forEach(each => {
                if (each.cnpj === this.organizacao.cnpj && each.id !== this.organizacao.id) {
                    isAlreadyRegistered = true;
                    this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Organizacao.Mensagens.msgJaExisteOrganizacaoRegistradaComEsteCNPJ'));
                }
            });
        }
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

    /**
     *
     * */
    private subscribeToSaveResponse(result: Observable<any>) {
        result.subscribe((res: Organizacao) => {
            this.isSaving = false;
            this.router.navigate(['/organizacao']);

            this.isEdit ? this.pageNotificationService.addUpdateMsg() : this.pageNotificationService.addCreateMsg();
        }, (error: Response) => {
            this.isSaving = false;
            if (error.status === 400) {
                const errorType: string = error.headers.toJSON()['x-abacoapp-error'][0];

                switch (errorType) {
                    case 'error.orgNomeInvalido': {
                        this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Organizacao.Mensagens.msgCampoNomePossuiCaracteresInvalidos')
                            + this.getLabel('Cadastros.Organizacao.Mensagens.msgVerifiqueSeHaEspacosNoInicioNoFinalOuMaisDeUmEspacoEntrePalavras'));
                        //document.getElementById('login').setAttribute('style', 'border-color: red;');
                        break;
                    }
                    case 'error.orgCnpjInvalido': {
                        this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Organizacao.Mensagens.msgCampoCNPJPossuiCaracteresInvalidos')
                            + this.getLabel('Cadastros.Organizacao.Mensagens.msgVerifiqueSeHaEspacosNoInicioOuFinal'));
                        //document.getElementById('login').setAttribute('style', 'border-color: red;');
                        break;
                    }
                    case 'error.orgSiglaInvalido': {
                        this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Organizacao.Mensagens.msgCampoSiglaPossuiCaracteresInvalidos')
                            + this.getLabel('Cadastros.Organizacao.Mensagens.msgVerifiqueSeHaEspacosNoInicioOuFinal'));
                        //document.getElementById('login').setAttribute('style', 'border-color: red;');
                        break;
                    }
                    case 'error.orgNumOcorInvalido': {
                        this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Organizacao.Mensagens.msgCampoNumeroDaOcorrenciaPossuiCaracteresInvalidos')
                            + this.getLabel('Cadastros.Organizacao.Mensagens.msgVerifiqueSeHaEspacosNoInicioOuFinal'));
                        //document.getElementById('login').setAttribute('style', 'border-color: red;');
                        break;
                    }
                    case 'error.organizacaoexists': {
                        this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Organizacao.Mensagens.msgJaExisteOrganizacaoCadastradaComMesmoNome'));
                        //document.getElementById('login').setAttribute('style', 'border-color: red;');
                        break;
                    }
                    case 'error.cnpjexists': {
                        this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Organizacao.Mensagens.msgJaExisteOrganizacaoCadastradaComMesmoCNPJ'));
                        //document.getElementById('login').setAttribute('style', 'border-color: red;');
                        break;
                    }
                    case 'error.beggindateGTenddate': {
                        this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Organizacao.Mensagens.msgInicioVigenciaNaoPodeSerPosteriorFinalVigencia'));
                        //document.getElementById('login').setAttribute('style', 'border-color: red;');
                        break;
                    }
                }
                let invalidFieldNamesString = '';
                const fieldErrors = JSON.parse(error['_body']).fieldErrors;
                invalidFieldNamesString = this.pageNotificationService.getInvalidFields(fieldErrors);
                this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Organizacao.Mensagens.msgCamposInvalidos') + invalidFieldNamesString);
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
        const imagem = event.files[0];
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

    fecharContrato(editForm1) {
        this.novoContrato = new Contrato();
        this.showDialogContrato = false;
        this.validaNumeroContrato = false;
        this.validaManual = false;
        this.validaDataInicio = false;
        this.validaDataFinal = false;
        this.validaDiasGarantia = false;
    }
}
