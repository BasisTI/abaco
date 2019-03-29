import { TranslateService } from '@ngx-translate/core';
import {ConfirmationService, SelectItem} from 'primeng/primeng';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Response} from '@angular/http';
import {Observable, Subscription} from 'rxjs/Rx';
import {DatatableClickEvent} from '@basis/angular-components';

import {Sistema} from './sistema.model';
import {SistemaService} from './sistema.service';
import {Organizacao, OrganizacaoService} from '../organizacao';
import {Modulo, ModuloService} from '../modulo';
import {Funcionalidade, FuncionalidadeService} from '../funcionalidade';
import {ResponseWrapper} from '../shared';
import {PageNotificationService} from '../shared/page-notification.service';

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
    sistema: Sistema = new Sistema();
    isSaving; isEdit; boolean;

    tipoSistemaOptions: SelectItem[] = [
        { label: 'Novo', value: 'NOVO' },
        { label: 'Legado', value: 'LEGADO' }
    ];

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
        private pageNotificationService: PageNotificationService,
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
            this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.FavorPreencherCampoObrigatorio'));
            return;
        }
        this.valido = false;
        this.sistema.updateModulo(this.moduloEmEdicao);
        this.fecharDialogEditarModulo();
    }

    confirmDeleteModulo() {
        this.confirmationService.confirm({
            message: `${this.getLabel('Cadastros.Sistema.Mensagens.msgTemCertezaQueDesejaExcluirModulo')} '${this.moduloEmEdicao.nome}' ?`,
            accept: () => {
                if (this.moduleCanBeDeleted()) {
                    this.sistema.deleteModulo(this.moduloEmEdicao);
                    this.moduloEmEdicao = new Modulo();
                } else {
                    this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Sistema.Mensagens.msgOModulo')
                        + this.moduloEmEdicao.nome
                        + this.getLabel('Cadastros.Sistema.Mensagens.msgNaoPodeSerExcluidoExistemFuncionalidadesAtribuidas'));
                }
            }
        });
    }

    private moduleCanBeDeleted() {
        let isDeletationValid = true;

        if (this.sistema.funcionalidades) {
            this.sistema.funcionalidades.forEach(each => {
                if (each.modulo.nome === this.moduloEmEdicao.nome) {
                    isDeletationValid = false;
                }
            });
        }

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
            this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.FavorPreencherCampoObrigatorio'));
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
            this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.FavorPreencherCampoObrigatorio'));
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
            this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.FavorPreencherCampoObrigatorio'));
            return;
        }
        this.valido = false;
        this.sistema.updateFuncionalidade(this.funcionalidadeEmEdicao, this.oldFuncionalidade);
        this.fecharDialogEditarFuncionalidade();
    }

    confirmDeleteFuncionalidade() {
        this.confirmationService.confirm({
            message: `${this.getLabel('Cadastros.Sistema.Mensagens.msgCertezaExcluirFuncionalidade')} '${this.funcionalidadeEmEdicao.nome}'
            ${this.getLabel('Cadastros.Sistema.Mensagens.msgDoModulo')} '${this.funcionalidadeEmEdicao.modulo.nome}'?`,
            accept: () => {
                this.sistema.deleteFuncionalidade(this.funcionalidadeEmEdicao);
                this.moduloEmEdicao = new Modulo();
            }
        });
    }

    save(form) {
        // if (!form.valid) {
        //   this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.FavorPreencherCampoObrigatorio'));
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
                    ? (this.isEdit = true) && (this.subscribeToSaveResponse(this.sistemaService.update(this.sistema))) : (this);
            } else {
                (this.checkRequiredFields() && !this.checkDuplicity(sistemas)
                    && this.checkSystemName())
                    ? (this.subscribeToSaveResponse(this.sistemaService.create(this.sistema))) : (this);
            }
        });
    }

    private checkDuplicity(sistemas: Array<Sistema>) {
        let isAlreadyRegistered: boolean;

        if (sistemas) {
            sistemas.forEach(each => {
                if (each.nome === this.sistema.nome && each.organizacao.id === this.sistema.organizacao.id && each.id !== this.sistema.id) {
                    isAlreadyRegistered = true;
                    this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Sistema.Mensagens.msgOSistema') + each.nome + this.getLabel('Cadastros.Sistema.Mensagens.msgJaEstaCadastrado'));
                }
            });
        }
        return isAlreadyRegistered;
    }

    private checkSystemInitials() {
        let exceedsMaximumValue = false;

        if (this.checkIfIsEmpty(this.sistema.sigla)) {
            if (this.sistema.sigla.length >= 255) {
                exceedsMaximumValue = true;
                this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Sistema.Mensagens.msgCampoSiglaExcedeNumeroCaracteres'));
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
                this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Sistema.Mensagens.msgCampoNomeExcedeNumeroCaracteres'));
            }
        }

        return isValid;
    }

    private checkRequiredFields() {
        let isNameValid = false;
        let isTipoValid = false;
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

        (this.sistema.tipoSistema) ? isTipoValid = true : isTipoValid = false;

        (isNameValid
            && isInitialsValid
            && isOrganizationValid && isTipoValid)
            ? (isRequiredFieldsValid = true)
            : (isRequiredFieldsValid = false);

        (!isRequiredFieldsValid)
            ? (this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.FavorPreencherCamposObrigatorios'))) : (this);
        return isRequiredFieldsValid;
    }

    private resetFocusFields() {
        document.getElementById('nome_sistema').setAttribute('style', 'border-color: #bdbdbd');
        document.getElementById('sigla_sistema').setAttribute('style', 'border-color: #bdbdbd');
        document.getElementById('organizacao_sistema').setAttribute('style', 'border-bottom: none');
    }

    private notifyRequiredFields() {
        this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.FavorPreencherCamposObrigatorios'));
        document.getElementById('sigla_sistema').setAttribute('style', 'border-color: red');
    }

    private subscribeToSaveResponse(result: Observable<Sistema>) {
        result.subscribe((res: Sistema) => {
            this.isSaving = false;
            this.isEdit ? this.pageNotificationService.addUpdateMsg() :  this.pageNotificationService.addCreateMsg(this.getLabel('Cadastros.Sistema.Mensagens.msgSistemaCadastradoComSucesso'));
            this.router.navigate(['/sistema']);
        }, (error: Response) => {
            this.isSaving = false;

            switch (error.status) {
                case 404: {
                    let invalidFieldNamesString = '';
                    const fieldErrors = JSON.parse(error['body']).fieldErrors;
                    invalidFieldNamesString = this.pageNotificationService.getInvalidFields(fieldErrors);
                    this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Sistema.Mensagens.msgCamposInvalidos') + invalidFieldNamesString);
                    break;
                }
                default: {
                    this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Sistema.Mensagens.msgOcorreuErroNoSistema'));
                    break;
                }
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
