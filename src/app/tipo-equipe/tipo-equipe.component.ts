import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { DatatableComponent, DatatableClickEvent } from '@basis/angular-components';

import { environment } from '../../environments/environment';
import { TipoEquipe } from './tipo-equipe.model';
import { TipoEquipeService } from './tipo-equipe.service';
import { ElasticQuery } from '../shared';

import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'jhi-tipo-equipe',
  templateUrl: './tipo-equipe.component.html'
})
export class TipoEquipeComponent implements AfterViewInit {

  @ViewChild(DatatableComponent) datatable: DatatableComponent;

  searchUrl: string = this.tipoEquipeService.searchUrl;

  paginationParams = { contentIndex: null };
  elasticQuery: ElasticQuery = new ElasticQuery();

  constructor(
    private router: Router,
    private tipoEquipeService: TipoEquipeService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngAfterViewInit() {
    this.datatable.refresh(this.elasticQuery.query);
  }

  datatableClick(event: DatatableClickEvent) {
    if (!event.selection) {
      return;
    }
    switch (event.button) {
      case 'edit':
        this.router.navigate(['/tipoEquipe', event.selection.id, 'edit']);
        break;
      case 'delete':
        this.confirmDelete(event.selection.id);
        break;
      case 'view':
        this.router.navigate(['/tipoEquipe', event.selection.id]);
        break;
    }
  }

  confirmDelete(id: any) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir o registro?',
      accept: () => {
        this.tipoEquipeService.delete(id).subscribe(() => {
          this.datatable.refresh(this.elasticQuery.query);
          this.messageService.add({ severity: 'info', summary: 'Tipo de Equipe excluída', detail: 'Exclusão com sucesso' });
        });
      }
    });
  }
}
