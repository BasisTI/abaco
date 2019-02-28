import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Response} from '@angular/http';
import {Observable, Subscription} from 'rxjs/Rx';
import {SelectItem} from 'primeng/primeng';

import {Organizacao} from './organizacao.model';
import {OrganizacaoService} from './organizacao.service';
import {Contrato, ContratoService} from '../contrato';
import {Manual, ManualService} from '../manual';
import {ResponseWrapper} from '../shared';
import {ConfirmationService} from 'primeng/components/common/confirmationservice';
import {DatatableClickEvent} from '@basis/angular-components';
import {environment} from '../../environments/environment';
import {PageNotificationService} from '../shared/page-notification.service';
import {UploadService} from '../upload/upload.service';
import {FileUpload} from 'primeng/primeng';
import {NgxMaskModule} from 'ngx-mask';
import {ValidacaoUtil} from '../util/validacao.util';
import {ValueTransformer} from '@angular/compiler/src/util';
import {Upload} from '../upload/upload.model';
import {EsforcoFase} from '../esforco-fase';
import { ManualContrato } from './ManualContrato.model';


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
    manuaisAdicionados: ManualContrato [] = [];
    novoManual: Manual;
    inicioVigencia;
    fimVigencia;
    manualInicioVigencia: Date;
    manualFimVigencia: Date;
    garantia;
    ativo;
    manualAtivo: boolean;

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
    ) {
    }

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

    validaCamposContrato(contrato: Contrato) {

        let a: boolean = true;

        if (this.novoContrato.numeroContrato === null || this.novoContrato.numeroContrato === undefined) {
            this.numeroContratoInvalido = true;
            this.pageNotificationService.addErrorMsg('Favor preencher o número do contrato');
            a = false;
        }
        if ( (this.novoContrato.manualContrato === null || this.novoContrato.manualContrato === undefined)
            && (this.novoContrato.manualContrato.length > 0)) {
            this.manualInvalido = true;
            this.pageNotificationService.addErrorMsg('Deve haver ao menos um manual');
            a = false;
        }
        if (!(this.novoContrato.dataInicioValida()) && (this.novoContrato.dataInicioVigencia != null || this.novoContrato.dataInicioVigencia != undefined)
            && (this.novoContrato.dataFimVigencia != null || this.novoContrato.dataFimVigencia != undefined)) {
            this.pageNotificationService.addErrorMsg('A data de início da vigência não pode ser posterior à data de término da vigência!');
            a = false;
        }
        if (this.novoContrato.dataInicioVigencia === null || this.novoContrato.dataInicioVigencia === undefined) {
            this.pageNotificationService.addErrorMsg('Preencher data de início da vigência');
            a = false;
        }
        if (this.novoContrato.dataFimVigencia === null || this.novoContrato.dataFimVigencia === undefined) {
            this.pageNotificationService.addErrorMsg('Preencher data de fim da vigência');
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
            this.pageNotificationService.addErrorMsg('Informe se o contrato é ativo ou não');
            verificador = false;
        }
        if (manualContratoTemp.dataFimVigencia === undefined || manualContratoTemp.dataFimVigencia === null) {
            this.pageNotificationService.addErrorMsg('Preencher data de fim da vigência');
            verificador = false;
        }
        if (manualContratoTemp.dataInicioVigencia === undefined || manualContratoTemp.dataInicioVigencia === null) {
            this.pageNotificationService.addErrorMsg('Preencher data de início da vigência');
            verificador = false;
        }
        if (manualContratoTemp.manuais === undefined || manualContratoTemp.manuais === null) {
            this.pageNotificationService.addErrorMsg('Selecione um manual');
            verificador = false;
        }
        return verificador;
    }

    adicionarManual() {
        const manualContratoTemp = this.setManualContrato(this.novoContrato);
        if (this.validaDadosManual(manualContratoTemp) ) {
            console.log('manualContrato');
            console.log(manualContratoTemp);
            this.novoContrato.addManualContrato(manualContratoTemp);
            console.log('validado');
            console.log(this.novoContrato.manualContrato);
        } else {
            console.log('invalidado');
            console.log(this.novoContrato.manualContrato);
            return;
        }
    }

    resetObj(manualContrato: ManualContrato) {
        manualContrato = {
            manuais: null,
            dataInicioVigencia: null,
            dataFimVigencia: null,
            ativo: false,
            contratos: null,
            id: null,
        };
    }

    setManualContrato(contrato: Contrato): ManualContrato {
        let manualContrato = new ManualContrato(null, null, null,
            /**contrato deve ser null para não loop */null,
            this.manualInicioVigencia, this.manualFimVigencia,
            this.manualAtivo, this.garantia);
        manualContrato.addManual(this.novoManual);
        return manualContrato;
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
            this.pageNotificationService.addErrorMsg('O campo Sigla é obrigatório!');
            return;
        }

        this.isSaving = true;
        if (!this.organizacao.cnpj) {
            this.cnpjValido = true;
            this.pageNotificationService.addErrorMsg('O campo CNPJ é obrigatório!');
            return;
        }

        if (this.organizacao.cnpj !== ' ') {
            if (!ValidacaoUtil.validarCNPJ(this.organizacao.cnpj)) {
                this.cnpjValido = true;
                this.pageNotificationService.addErrorMsg('CNPJ inválido');
                return;
            }
        }

        if (this.organizacao.contracts.length === 0 || this.organizacao.contracts === undefined) {
            document.getElementById('tabela-contrato').setAttribute('style', 'border: 1px dotted red;');
            this.pageNotificationService.addErrorMsg('Pelo menos 1 contrato é obrigatório por organização.');
            return;
        }

        console.log('query');
        this.organizacaoService.query().subscribe(response => {
            const todasOrganizacoes = response;
            console.log('organizacoes');
            console.log(todasOrganizacoes);

            if (!this.checkIfOrganizacaoAlreadyExists(todasOrganizacoes.json)
                && !this.checkIfCnpjAlreadyExists(todasOrganizacoes.json)) {

                if (this.organizacao.id !== undefined) {
                    console.log('edit');
                    this.editar();
                } else {
                    console.log('novo');
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
        console.log('novo: ');
        console.log(this.organizacao);
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
        organizacoesRegistradas.forEach(each => {
            if (each.nome.toUpperCase() === this.organizacao.nome.toUpperCase() && each.id !== this.organizacao.id) {
                isAlreadyRegistered = true;
                this.pageNotificationService.addErrorMsg('Já existe uma Organização registrada com este nome!');
            }
        });
        return isAlreadyRegistered;
    }

    checkIfCnpjAlreadyExists(organizacoesRegistradas: Array<Organizacao>): boolean {
        let isAlreadyRegistered = false;
        organizacoesRegistradas.forEach(each => {
            if (each.cnpj === this.organizacao.cnpj && each.id !== this.organizacao.id) {
                isAlreadyRegistered = true;
                this.pageNotificationService.addErrorMsg('Já existe uma Organização registrada com este CNPJ!');
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
            console.log('chamada de organizacao');
            this.isSaving = false;
            this.router.navigate(['/organizacao']);

            this.isEdit ? this.pageNotificationService.addUpdateMsg() : this.pageNotificationService.addCreateMsg();
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
