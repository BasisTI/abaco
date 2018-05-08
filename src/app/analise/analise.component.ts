import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { DatatableComponent, DatatableClickEvent } from '@basis/angular-components';

import { environment } from '../../environments/environment';
import { Analise } from './analise.model';
import { AnaliseService } from './analise.service';
import { ElasticQuery, PageNotificationService } from '../shared';

@Component({
  selector: 'jhi-analise',
  templateUrl: './analise.component.html'
})
export class AnaliseComponent implements OnInit {

  @ViewChild(DatatableComponent) datatable: DatatableComponent;

  searchUrl: string = this.analiseService.searchUrl;

  elasticQuery: ElasticQuery = new ElasticQuery();

  rowsPerPageOptions: number[] = [5, 10, 20];

  analiseSelecionada: Analise;

  constructor(
    private router: Router,
    private analiseService: AnaliseService,
    private confirmationService: ConfirmationService,
    private pageNotificationService: PageNotificationService,
  ) { }

  ngOnInit() {
    this.datatable.pDatatableComponent.onRowSelect.subscribe((event) => {
      this.analiseSelecionada = new Analise().copyFromJSON(event.data);
    });

    this.datatable.pDatatableComponent.onRowUnselect.subscribe((event) => {
      this.analiseSelecionada = undefined;
    });
  }

  datatableClick(event: DatatableClickEvent) {
    if (!event.selection) {
      return;
    }
    switch (event.button) {
      case 'edit':
        this.router.navigate(['/analise', event.selection.id, 'edit']);
        break;
      case 'delete':
        this.confirmDelete(event.selection);
        break;
      case 'relatorio':
        this.gerarRelatorio(event.selection);
        break;
    }
  }

  confirmDelete(analise: Analise) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir a Análise '${analise.identificadorAnalise}'?`,
      accept: () => {
        this.analiseService.delete(analise.id).subscribe(() => {
          this.recarregarDataTable();
          this.pageNotificationService.addDeleteMsgWithName(analise.numeroOs);
        });
      }
    });
  }

  limparPesquisa() {
    this.elasticQuery.reset();
    this.recarregarDataTable();
  }

  recarregarDataTable() {
    this.datatable.reset();
  }

  gerarRelatorio(analise: Analise) {
    this.analiseService.gerarRelatorioAnalise(analise);
  }

  desabilitarBotaoRelatorio(): boolean {
    if (this.analiseSelecionada) {
      return true;
    } else {
      return false;
    }
  }

}
