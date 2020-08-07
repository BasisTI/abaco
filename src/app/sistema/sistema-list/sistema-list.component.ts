import {Component, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ConfirmationService} from 'primeng';
import { DatatableComponent, PageNotificationService, DatatableClickEvent } from '@nuvem/primeng-components';
import { Sistema } from '../sistema.model';
import { ElasticQuery } from 'src/app/shared/elastic-query';
import { Organizacao, OrganizacaoService } from 'src/app/organizacao';
import { SistemaService } from '../sistema.service';

@Component({
    selector: 'jhi-sistema',
    templateUrl: './sistema-list.component.html',
    providers:[ConfirmationService]
})
export class SistemaListComponent {

    @ViewChild(DatatableComponent) datatable: DatatableComponent;
    searchUrl: string = this.sistemaService.searchUrl;
    sistemaSelecionado: Sistema;
    rowsPerPageOptions: number[] = [5, 10, 20];
    paginationParams = {contentIndex: null};
    elasticQuery: ElasticQuery = new ElasticQuery();
    organizations:Organizacao[] = [];
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
        private pageNotificationService: PageNotificationService,
    ) {
        const emptyOrganization = new Organizacao();
        this.organizacaoService.dropDown().subscribe(response => {
            this.organizations = response;
            this.organizations.push(emptyOrganization);
        });
    }

    getLabel(label) {
        return label;
    }

    public ngOnInit() {
        if(this.datatable){
            this.datatable.pDatatableComponent.onRowSelect.subscribe((event) => {
                this.sistemaSelecionado = event.data;
            });
            this.datatable.pDatatableComponent.onRowUnselect.subscribe((event) => {
                this.sistemaSelecionado = undefined;
            });
        }
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
            message: this.getLabel('Tem certeza que deseja excluir o registro?'),
            accept: () => {
                this.sistemaService.delete(id).subscribe(() => {
                        this.limparPesquisa();
                        this.pageNotificationService.addDeleteMsg();
                    }, (error) => {
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
        this.elasticQuery.value = this.concatResults(this.createStringParamsArray());
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
        if(this.searchParams.sigla !== undefined && this.searchParams.sigla !== ''){
            if(this.searchParams.sigla.includes(' ')){
                stringParamsArray.length > 0 ? stringParamsArray.push(' AND sigla:\"' + this.searchParams.sigla + '\"') : stringParamsArray.push('sigla:\"' + this.searchParams.sigla + '\"'); 
            }else{
                stringParamsArray.length > 0 ? stringParamsArray.push(' AND sigla:*' + this.searchParams.sigla + '*') :  stringParamsArray.push('sigla:*' + this.searchParams.sigla + '*'); 
            }
        }
        if(this.searchParams.nomeSistema !== undefined && this.searchParams.nomeSistema !== ''){
            if(this.searchParams.nomeSistema.includes(' ')){
                stringParamsArray.length > 0 ? stringParamsArray.push(' AND nome:\"' + this.searchParams.nomeSistema + '\"') : stringParamsArray.push('nome:\"' + this.searchParams.nomeSistema + '\"'); 
            }else{
                stringParamsArray.length > 0 ? stringParamsArray.push(' AND nome:*' + this.searchParams.nomeSistema + '*') :  stringParamsArray.push(this.searchParams.nomeSistema); 
            }
        }
        if(this.searchParams.organizacao.id !== undefined && this.searchParams.organizacao.id !== ''){
                stringParamsArray.length > 0 ? stringParamsArray.push(' AND organizacao.id: '+ this.searchParams.sigla ) : stringParamsArray.push(' organizacao.id:' + this.searchParams.organizacao.id); 
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


  concatResults(paramsArray: Array<string>): string {
    let paramsQueue: Array<string> = [];

    if (paramsArray) {
      paramsArray.forEach(each => {
        (each !== undefined) ? (paramsQueue.push(each)) : (each);
      });
    }

    let concatResultString = this.createString(paramsQueue);

    return concatResultString;
  }

  private createString(paramsQueue: Array<String>): string {
    let concatedString: string = '';

    for(let i = 0 ; i< paramsQueue.length ; i ++) {
      (i !== 0) ? (concatedString = concatedString + ' + ' + paramsQueue[i]) : (concatedString = concatedString + paramsQueue[0]);
    }
    
    return concatedString;
  }
}
