import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { DatatableComponent, DatatableClickEvent } from '@basis/angular-components';

import { environment } from '../../environments/environment';
import { TipoFase } from './tipo-fase.model';
import { TipoFaseService } from './tipo-fase.service';
import { ElasticQuery } from '../shared';

@Component({
  selector: 'jhi-tipo-fase',
  templateUrl: './tipo-fase.component.html'
})
export class TipoFaseComponent implements AfterViewInit {

  @ViewChild(DatatableComponent) datatable: DatatableComponent;

  searchUrl: string = this.tipoFaseService.searchUrl;

  paginationParams = { contentIndex: null };
  elasticQuery: ElasticQuery = new ElasticQuery();

  constructor(
    private router: Router,
    private tipoFaseService: TipoFaseService,
    private confirmationService: ConfirmationService
  ) {}

  ngAfterViewInit() {
    this.datatable.refresh(this.elasticQuery.query);
  }

  datatableClick(event: DatatableClickEvent) {
    if (!event.selection) {
      return;
    }
    switch (event.button) {
      case 'edit':
        this.router.navigate(['/tipoFase', event.selection.id, 'edit']);
        break;
      case 'delete':
        this.confirmDelete(event.selection.id);
        break;
      case 'view':
        this.router.navigate(['/tipoFase', event.selection.id]);
        break;
    }
  }

  confirmDelete(id: any) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir o registro?',
      accept: () => {
        this.tipoFaseService.delete(id).subscribe(() => {
          this.datatable.refresh(this.elasticQuery.query);
        });
      }
    });
  }
}
