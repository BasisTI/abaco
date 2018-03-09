import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { DatatableComponent, DatatableClickEvent } from '@basis/angular-components';

import { environment } from '../../environments/environment';
import { Manual } from './manual.model';
import { ManualService } from './manual.service';
import { ElasticQuery, PageNotificationService } from '../shared';

@Component({
  selector: 'jhi-manual',
  templateUrl: './manual.component.html'
})
export class ManualComponent implements OnInit {

  @ViewChild(DatatableComponent) datatable: DatatableComponent;

  searchUrl: string = this.manualService.searchUrl;

  paginationParams = { contentIndex: null };
  elasticQuery: ElasticQuery = new ElasticQuery();

  manualSelecionado: Manual;

  nomeDoManualClonado: string;

  mostrarDialogClonar = false;

  constructor(
    private router: Router,
    private manualService: ManualService,
    private confirmationService: ConfirmationService,
    private pageNotificationService: PageNotificationService
  ) { }

  ngOnInit() {
    this.datatable.primeDatatableComponent.onRowSelect.subscribe((event) => {
      this.manualSelecionado = new Manual().copyFromJSON(event.data);
    });

    this.datatable.primeDatatableComponent.onRowUnselect.subscribe((event) => {
      this.manualSelecionado = undefined;
    });
  }

  desabilitarBotaoClonar(): boolean {
    if (this.manualSelecionado) {
      return true;
    } else {
      return false;
    }
  }

  datatableClick(event: DatatableClickEvent) {
    if (!event.selection) {
      return;
    }
    switch (event.button) {
      case 'edit':
        this.router.navigate(['/manual', event.selection.id, 'edit']);
        break;
      case 'delete':
        this.confirmDelete(event.selection.id);
        break;
      case 'view':
        this.router.navigate(['/manual', event.selection.id]);
        break;
      case 'clone':
        this.mostrarDialogClonar = true;
    }
  }

  fecharDialogClonar() {
    this.nomeDoManualClonado = '';
    this.manualSelecionado = undefined;
    this.mostrarDialogClonar = false;
  }

  clonar() {
    const manualClonado: Manual = this.manualSelecionado.clone();
    manualClonado.id = undefined;
    manualClonado.nome = this.nomeDoManualClonado;
    manualClonado.esforcoFases.forEach(ef => ef.id = undefined);
    manualClonado.fatoresAjuste.forEach(fa => fa.id = undefined);

    this.manualService.create(manualClonado).subscribe((manualSalvo: Manual) => {
      this.pageNotificationService
        .addSuccessMsg(`Manual '${manualSalvo.nome}' clonado a partir do manual '${this.manualSelecionado.nome}' com sucesso!`);
      this.fecharDialogClonar();
      this.datatable.refresh(this.elasticQuery.query);
    });

  }

  confirmDelete(id: any) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir o registro?',
      accept: () => {
        this.manualService.delete(id).subscribe(() => {
          this.datatable.refresh(this.elasticQuery.query);
        });
      }
    });
  }
}
