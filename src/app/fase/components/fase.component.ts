import { Component, ViewChild, OnInit } from '@angular/core';
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
export class FaseComponent implements OnInit {

    @ViewChild(DataTable) dataTable: DataTable;
    searchUrl: string = this.tipoFaseService.resourceUrl + '/page';
    tipoFaseSelecionada: Fase;
    filtro: FaseFilter;
    rowsPerPageOptions: number[] = [5, 10, 20];
    fases: Fase[] = [];

    constructor(
        private router: Router,
        private tipoFaseService: FaseService,
        private confirmationService: ConfirmationService,
        private pageNotificationService: PageNotificationService,
        private translate: TranslateService
    ) {
        this.filtro = new FaseFilter(null);
    }

    public ngOnInit() {
        this.obterTodaFases();
        this.dataTable.onRowSelect.subscribe((event) => {
            this.tipoFaseSelecionada = event.data;
        });
        this.dataTable.onRowUnselect.subscribe(() => {
            this.tipoFaseSelecionada = undefined;
        });
    }

    editarClickEvent() {
        this.router.navigate(['/fase', this.tipoFaseSelecionada.id, 'edit']);
    }

    obterTodaFases() {
        const pageable = new Pageable(this.dataTable.page, this.dataTable.rows);
        pageable.setSort(this.dataTable.sortOrder, this.dataTable.sortField);
        this.tipoFaseService.query(this.filtro, this.dataTable)
        .subscribe(tiposFase => this.fases = tiposFase);           
    }

    abrirEditar() {
        this.router.navigate(['/fase', this.tipoFaseSelecionada.id, 'edit']);
    }

    abrirVisualizar() {
        this.router.navigate(['/fase', this.tipoFaseSelecionada.id]);
    }

    confirmDelete() {
        this.translate.get('Global.Mensagens.CertezaExcluirRegistro').subscribe((translatedMessage: string) => {
            this.confirmationService.confirm({
                message: translatedMessage,
                accept: () => {
                    this.tipoFaseService.delete(this.tipoFaseSelecionada.id).subscribe(() => {
                        this.pageNotificationService.addDeleteMsg();
                        this.tipoFaseSelecionada = null;
                        this.obterTodaFases();
                    });
                }
            });
        });
    }

    limparPesquisa() {
        this.filtro.nome = null;
        this.obterTodaFases();
    }
}
