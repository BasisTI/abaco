import { Subscription } from 'rxjs/Subscription';
import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, DataTable } from 'primeng/primeng';

import { FaseService, Fase, FaseFilter } from '../';
import { PageNotificationService } from '../../shared';
import { TranslateService } from '@ngx-translate/core';
import { Pageable } from '../../util/pageable.util';

@Component({
    selector: 'jhi-tipo-fase',
    templateUrl: './fase.component.html'
})
export class FaseComponent implements OnDestroy, OnInit {

    @ViewChild(DataTable) dataTable: DataTable;
    searchUrl: string = this.tipoFaseService.searchUrl;
    tipoFaseSelecionada: Fase;
    filtro: FaseFilter;
    rowsPerPageOptions: number[] = [5, 10, 20];
    tiposFase: Fase[] = [];

    // Lista de listeners para serem desabilitados no fim do ciclo de vida do componente
    private subscriptionList: Subscription[] = [];

    constructor(
        private router: Router,
        private tipoFaseService: FaseService,
        private confirmationService: ConfirmationService,
        private pageNotificationService: PageNotificationService,
        private translate: TranslateService
    ) {
        this.filtro = new FaseFilter(null, null);
    }

    public ngOnInit() {
        this.obterTodaFases();
        this.subscriptionList.push( this.dataTable.onRowSelect.subscribe((event) => {
            this.tipoFaseSelecionada = event.data;
        }) );
        this.subscriptionList.push( this.dataTable.onRowUnselect.subscribe(() => {
            this.tipoFaseSelecionada = undefined;
        }) );
    }

    getLabel(label) {
        let str: any;
        this.subscriptionList.push( this.translate.get(label).subscribe((res: string) => {
            str = res;
        }) );
        return str;
    }

    editarClickEvent() {
        this.router.navigate(['/tipoFase', this.tipoFaseSelecionada.id, 'edit']);
    }

    obterTodaFases() {
        const pageable = new Pageable(this.dataTable.page, this.dataTable.rows);
        pageable.setSort(this.dataTable.sortOrder, this.dataTable.sortField);
        this.subscriptionList.push(
             this.tipoFaseService.query(this.filtro, this.dataTable)
                .subscribe(tiposFase => this.tiposFase = tiposFase) 
        );           
    }

    abrirEditar() {
        this.router.navigate(['/tipoFase', this.tipoFaseSelecionada.id, 'edit']);
    }

    abrirVisualizar() {
        this.router.navigate(['/tipoFase', this.tipoFaseSelecionada.id]);
    }

    confirmDelete() {
        this.confirmationService.confirm({
            message: this.getLabel('Global.Mensagens.CertezaExcluirRegistro'),
            accept: () => {
                this.subscriptionList.push( this.tipoFaseService.delete(this.tipoFaseSelecionada.id).subscribe(() => {
                    this.pageNotificationService.addDeleteMsg();
                    this.tipoFaseSelecionada = null;
                    this.obterTodaFases();
                }) );
            }
        });
    }

    limparPesquisa() {
        this.filtro.nome = null;
        this.obterTodaFases();
    }

    ngOnDestroy() {
        this.subscriptionList.forEach((sub) => sub.unsubscribe());
    }
}
