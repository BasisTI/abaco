import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, SelectItem } from 'primeng';
import { Observable, Subscription } from 'rxjs';
import { OrganizacaoService, Organizacao } from '../../organizacao';
import { Sistema } from '../sistema.model';
import { SistemaService } from '../sistema.service';
import { Modulo } from 'src/app/modulo';
import { Funcionalidade, funcionalidadeRoute, FuncionalidadeService } from 'src/app/funcionalidade';
import { PageNotificationService, DatatableClickEvent } from '@nuvem/primeng-components';
import { BlockUiService } from '@nuvem/angular-base';


@Component({
    selector: 'app-sistema-form',
    templateUrl: './sistema-form.component.html',
    providers: [ConfirmationService]
})
export class SistemaFormComponent implements OnInit, OnDestroy {

    readonly edit = 'edit';
    readonly delete = 'delete';

    organizacoes: Organizacao[] = [];
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
        private funcionalidadeService: FuncionalidadeService,
        private blockUiService: BlockUiService,
    ) {
    }



    ngOnInit() {
        this.isSaving = false;
        this.blockUiService.show();
        this.organizacaoService.dropDownActive().subscribe(response => {
            this.organizacoes = response;
            this.organizacoes.push(new Organizacao());
            this.blockUiService.hide();
        });
        this.routeSub = this.route.params.subscribe(params => {
            if (params['id']) {
                this.blockUiService.show();
                this.sistemaService.find(params['id']).subscribe(
                    sistema => {
                        this.sistema = Sistema.fromJSON(sistema);
                        this.blockUiService.hide();
                });
            }
        });
    }

    datatableClickModulo(event: DatatableClickEvent) {
        if (!event.selection) {
            return;
        }
        switch (event.button) {
            case this.edit:
                this.moduloEmEdicao = event.selection.clone();
                this.abrirDialogEditarModulo();
                break;
            case this.delete:
                this.moduloEmEdicao = event.selection.clone();
                this.confirmDeleteModulo();
                break;
            default:
                break;
        }
    }
    datatableClickFuncionalidade(event: DatatableClickEvent) {
        if (!event.selection) {
            return;
        }
        switch (event.button) {
            case this.edit:
                this.oldFuncionalidade = event.selection.clone();
                this.funcionalidadeEmEdicao = event.selection.clone();
                this.abrirDialogEditarFuncionalidade();
                break;
            case this.delete:
                this.funcionalidadeEmEdicao = event.selection.clone();
                this.confirmDeleteFuncionalidade();
                break;
            default:
                break;
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
            this.pageNotificationService.addErrorMessage('Ocorreu um erro no sistema!');
            return;
        }
        this.valido = false;
        this.sistema.updateModulo(this.moduloEmEdicao);
        this.fecharDialogEditarModulo();
    }

    confirmDeleteModulo() {
        this.blockUiService.show();
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja excluir o módulo ' + this.moduloEmEdicao.nome + ' ?',
            accept: () => {
                if (this.moduleCanBeDeleted()) {
                    this.sistema.deleteModulo(this.moduloEmEdicao);
                    this.moduloEmEdicao = new Modulo();
                } else {
                    this.pageNotificationService.addErrorMessage('O'
                            + this.moduloEmEdicao.nome
                            + ' não pode ser excluído porque existem funcionalidades atribuídas.'
                        );
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
            this.pageNotificationService.addErrorMessage('Por favor preencher o campo obrigatório!');
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
            this.pageNotificationService.addErrorMessage('Por favor preencher o campo obrigatório!');
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
            this.pageNotificationService.addErrorMessage('Por favor preencher o campo obrigatório!');
            return;
        }
        this.valido = false;
        this.sistema.updateFuncionalidade(this.funcionalidadeEmEdicao, this.oldFuncionalidade);
        this.fecharDialogEditarFuncionalidade();
    }

    confirmDeleteFuncionalidade() {
        this.funcionalidadeService.getTotalFunction(this.funcionalidadeEmEdicao.id)
        .subscribe(totalFuncoes => {
            if (totalFuncoes <= 0) {
                this.confirmationService.confirm({
                    message: 'Tem certeza que deseja excluir a funcionalidade' + this.funcionalidadeEmEdicao.nome +
                    + ' do módulo ' + this.funcionalidadeEmEdicao.modulo.nome + ' ?',
                    accept: () => {
                        this.sistema.deleteFuncionalidade(this.funcionalidadeEmEdicao);
                        this.moduloEmEdicao = new Modulo();
                    }
                });
            } else {
                this.pageNotificationService.addErrorMessage('Não é possível excluir a Funcionalidade selecionada.');
            }
        });
    }

    save(form) {
        // if (!form.valid) {
        //   this.pageNotificationService.addErrorMessage('Por favor preencher o campo obrigatório!');
        //   return;
        // }
        this.isSaving = true;
        (this.sistema.modulos === undefined) ? (this.sistema.modulos = []) : (this.sistema);
        let sistemas: Array<Sistema>;
        this.sistemaService.dropDown().subscribe(response => {
            sistemas = response;

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
                    this.pageNotificationService.addErrorMessage('O sistema ' + each.nome + ' já está cadastrado!');
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
                this.pageNotificationService.addErrorMessage('O campo sigla excede o número de caracteres.');
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
                this.pageNotificationService.addErrorMessage('O campo sigla excede o número de caracteres.');
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
            ? (this.pageNotificationService.addErrorMessage('Favor preencher os campos Obrigatórios!')) : (this);
        return isRequiredFieldsValid;
    }

    private resetFocusFields() {
        document.getElementById('nome_sistema').setAttribute('style', 'border-color: #bdbdbd');
        document.getElementById('sigla_sistema').setAttribute('style', 'border-color: #bdbdbd');
        document.getElementById('organizacao_sistema').setAttribute('style', 'border-bottom: none');
    }

    private notifyRequiredFields() {
        this.pageNotificationService.addErrorMessage('Por favor preencher os campos Obrigatórios!');
        document.getElementById('sigla_sistema').setAttribute('style', 'border-color: red');
    }

    private subscribeToSaveResponse(result: Observable<Sistema>) {
        result.subscribe((res: Sistema) => {
            this.isSaving = false;
            this.isEdit ? this.pageNotificationService.addUpdateMsg() : this.pageNotificationService.addCreateMsg('Sistema cadastrado com sucesso!');
            this.router.navigate(['/sistema']);
        }, (error: Response) => {
            this.isSaving = false;

            switch (error.status) {
                case 404: {
                    this.pageNotificationService.addErrorMessage('Campos inválidos: ' +  error['body']);
                    break;
                }
                default: {
                    this.pageNotificationService.addErrorMessage('Ocorreu um erro no sistema!');
                    break;
                }
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
    onRowEditEvent(event) {
        console.log(event);

    }

}
