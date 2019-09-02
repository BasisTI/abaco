import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, DataTable } from 'primeng/primeng';

import { FaseService, Fase, FaseFilter } from '../';
import { PageNotificationService } from '../../shared';
import { TranslateService } from '@ngx-translate/core';
import { Page } from '../../util/page';

@Component({
    selector: 'app-fase',
    templateUrl: './fase.component.html'
})
export class FaseComponent implements OnInit {

    @ViewChild(DataTable) dataTable: DataTable;
    tipoFaseSelecionada: Fase = new Fase();
    filtro: FaseFilter = new FaseFilter(null);
    fases: Page<Fase> = new Page<Fase>();

    constructor(
        private router: Router,
        private tipoFaseService: FaseService,
        private confirmationService: ConfirmationService,
        private pageNotificationService: PageNotificationService,
        private translate: TranslateService
    ) {}

    public ngOnInit() {
        this.obterTodaFases();
    }

    susbcribeSelectRow(data): any {
        this.tipoFaseSelecionada = data;
    }

    subscrbeUnselectRow() {
        this.tipoFaseSelecionada = new Fase();
    }

    editarClickEvent() {
        this.router.navigate(['/fase', this.tipoFaseSelecionada.id, 'edit']);
    }

    obterTodaFases() {
        this.tipoFaseService.getPage(this.filtro, this.dataTable)
        .subscribe(fases => this.fases = fases);           
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
        this.filtro = new FaseFilter();
        this.obterTodaFases();
    }
}
