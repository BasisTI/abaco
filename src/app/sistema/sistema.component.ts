import {Component, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ConfirmationService} from 'primeng/primeng';
import {DatatableClickEvent, DatatableComponent} from '@basis/angular-components';
import {Sistema} from './sistema.model';
import {SistemaService} from './sistema.service';
import {ElasticQuery, PageNotificationService} from '../shared';
import {Organizacao} from '../organizacao/organizacao.model';
import {OrganizacaoService} from '../organizacao/organizacao.service';
import {StringConcatService} from '../shared/string-concat.service';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {TranslateService} from '@ngx-translate/core';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'jhi-sistema',
    templateUrl: './sistema.component.html'
})
export class SistemaComponent {

    @BlockUI() blockUI: NgBlockUI;

    @ViewChild(DatatableComponent) datatable: DatatableComponent;

    searchUrl: string = this.sistemaService.searchUrl;

    sistemaSelecionado: Sistema;

    rowsPerPageOptions: number[] = [5, 10, 20];

    paginationParams = {contentIndex: null};
    elasticQuery: ElasticQuery = new ElasticQuery();
    organizations: Array<Organizacao>;
    searchParams: any = {
        sigla: undefined,
        nomeSistema: undefined,
        organizacao: {
            nome: undefined
        }
    };

    fieldName: string;

    constructor(
        private router: Router,
        private sistemaService: SistemaService,
        private confirmationService: ConfirmationService,
        private organizacaoService: OrganizacaoService,
        private stringConcatService: StringConcatService,
        private pageNotificationService: PageNotificationService,
        private translate: TranslateService
    ) {
        const emptyOrganization = new Organizacao();

        this.organizacaoService.dropDown().subscribe(response => {
            this.organizations = response.json;
            this.organizations.unshift(emptyOrganization);
        });
    }

    getLabel(label) {
        let str: any;
        this.translate.get(label).subscribe((res: string) => {
            str = res;
        }).unsubscribe();
        return str;
    }

    public ngOnInit() {
        this.datatable.pDatatableComponent.onRowSelect.subscribe((event) => {
            this.sistemaSelecionado = event.data;
        });
        this.datatable.pDatatableComponent.onRowUnselect.subscribe((event) => {
            this.sistemaSelecionado = undefined;
        });
    }


    public datatableClick(event: DatatableClickEvent) {
        if (!event.selection) {
            return;
        }
        switch (event.button) {
            case 'edit':
                this.router.navigate(['/sistema', event.selection.id, 'edit']);
                break;
            case 'delete':
                this.confirmDelete(event.selection.id);
                break;
            case 'view':
                this.router.navigate(['/sistema', event.selection.id]);
                break;
        }
    }

    public onRowDblclick(event) {

        if (event.target.nodeName === 'TD') {
            this.abrirEditar();
        } else if (event.target.parentNode.nodeName === 'TD') {
            this.abrirEditar();
        }
    }

    abrirEditar() {
        this.router.navigate(['/sistema', this.sistemaSelecionado.id, 'edit']);
    }

    public confirmDelete(id: any) {
        this.confirmationService.confirm({
            message: this.getLabel('Global.Mensagens.CertezaExcluirRegistro'),
            accept: () => {
                this.blockUI.start(this.getLabel('Global.Mensagens.EXCLUINDO_REGISTRO'));
                this.sistemaService.delete(id).subscribe(() => {
                        this.limparPesquisa();
                        this.pageNotificationService.addDeleteMsg();
                        this.blockUI.stop();
                    }, (error) => {
                        this.blockUI.stop();
                    }
                );
            }
        });
    }

    private checkUndefinedParams() {
        (this.searchParams.sigla === '') ? (this.searchParams.sigla = undefined) : (this);
        (this.searchParams.nomeSistema === '') ? (this.searchParams.nomeSistema = undefined) : (this);
        (this.searchParams.organizacao.id === '') ? (this.searchParams.organizacao.id = undefined) : (this);
    }

    public performSearch() {
        this.checkUndefinedParams();
        this.elasticQuery.value = this.stringConcatService.concatResults(this.createStringParamsArray());
        this.recarregarDataTable();
    }

    private formatFieldForSearch(field: String): String {
        if (!(field)) {
            return;
        } else {
            field = field.trim();
            return field;
        }
    }

    private createStringParamsArray(): Array<string> {
        const stringParamsArray: Array<string> = [];
        this.searchParams.sigla = this.formatFieldForSearch(this.searchParams.sigla);
        this.searchParams.nomeSistema = this.formatFieldForSearch(this.searchParams.nomeSistema);
        if (this.searchParams.sigla !== undefined && this.searchParams.sigla !== '' &&
            this.searchParams.nomeSistema === undefined &&
            this.searchParams.organizacao.id === undefined) {
            (this.searchParams.sigla !== undefined || this.elasticQuery.value === '') ?
                (stringParamsArray.push('sigla:*' + this.searchParams.sigla + '*')) : (this);
        } else if (this.searchParams.nomeSistema !== undefined &&
            this.searchParams.sigla === undefined && this.searchParams.organizacao.id === undefined) {
            (this.searchParams.nomeSistema !== undefined || this.elasticQuery.value === '') ? (
                stringParamsArray.push('nome: *' + this.searchParams.nomeSistema + '*')) : (this);
        } else if (this.searchParams.organizacao.id !== undefined &&
            this.searchParams.nomeSistema === undefined && this.searchParams.sigla === undefined) {
            (this.searchParams.organizacao.id !== undefined ||
                this.elasticQuery.value === '') ? (
                stringParamsArray.push('organizacao.id:' + this.searchParams.organizacao.id)) : (this);
        } else if (this.searchParams.sigla === undefined &&
            this.searchParams.nomeSistema !== undefined &&
            this.searchParams.organizacao.id !== undefined) {
            (this.searchParams.nomeSistema !== undefined || this.elasticQuery.value === '') ? (
                stringParamsArray.push('nome: *' + this.searchParams.nomeSistema + '*')) : (this);
            (this.searchParams.organizacao.id !== undefined || this.elasticQuery.value === '') ? (
                stringParamsArray.push('AND organizacao.id:' + this.searchParams.organizacao.id)) : (this);
        } else if (this.searchParams.nomeSistema === undefined &&
            this.searchParams.sigla !== undefined &&
            this.searchParams.organizacao.id !== undefined) {
            (this.searchParams.sigla !== undefined || this.elasticQuery.value === '') ?
                (stringParamsArray.push('sigla:*' + this.searchParams.sigla + '*')) : (this);
            (this.searchParams.organizacao.id !== undefined || this.elasticQuery.value === '') ?
                (stringParamsArray.push('AND organizacao.id:' + this.searchParams.organizacao.id)) : (this);
        } else if (this.searchParams.organizacao.id === undefined &&
            this.searchParams.sigla !== undefined &&
            this.searchParams.nomeSistema !== undefined) {
            (this.searchParams.sigla !== undefined || this.elasticQuery.value === '') ?
                (stringParamsArray.push('sigla:*' + this.searchParams.sigla + '*')) : (this);
            (this.searchParams.nomeSistema !== undefined || this.elasticQuery.value !== '') ?
                (stringParamsArray.push('AND nome: *' + this.searchParams.nomeSistema + '*')) : (this);
        } else if (this.searchParams.sigla !== undefined &&
            this.searchParams.nomeSistema !== undefined &&
            this.searchParams.organizacao.id !== undefined) {
            (this.searchParams.sigla !== undefined || this.elasticQuery.value === '') ?
                (stringParamsArray.push('sigla:*' + this.searchParams.sigla + '*')) : (this);
            (this.searchParams.nomeSistema !== undefined || this.elasticQuery.value === '') ?
                (stringParamsArray.push('AND nome: *' + this.searchParams.nomeSistema + '*')) : (this);
            (this.searchParams.organizacao.id !== undefined || this.elasticQuery.value === '') ?
                (stringParamsArray.push('AND organizacao.id:' + this.searchParams.organizacao.id)) : (this);
        }
        return stringParamsArray;
    }

    public limparPesquisa() {
        this.searchParams.sigla = '';
        this.searchParams.organizacao = '';
        this.searchParams.nomeSistema = '';
        this.elasticQuery.reset();
        this.searchUrl = this.sistemaService.searchUrl;
        this.recarregarDataTable();
    }

    public recarregarDataTable() {
        this.datatable.url = this.searchUrl;
        this.datatable.refresh(this.elasticQuery.value ? this.elasticQuery.value : this.elasticQuery.query);
    }
}
