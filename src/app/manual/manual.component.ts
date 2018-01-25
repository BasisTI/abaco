import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { DatatableComponent, DatatableClickEvent } from '@basis/angular-components';

import { environment } from '../../environments/environment';
import { Manual } from './manual.model';
import { ManualService } from './manual.service';
import { ElasticQuery } from '../shared';

@Component({
  selector: 'jhi-manual',
  templateUrl: './manual.component.html'
})
export class ManualComponent implements AfterViewInit {

  @ViewChild(DatatableComponent) datatable: DatatableComponent;

  searchUrl: string = this.manualService.searchUrl;

  paginationParams = { contentIndex: null };
  elasticQuery: ElasticQuery = new ElasticQuery();

  constructor(
    private router: Router,
    private manualService: ManualService,
    private confirmationService: ConfirmationService
  ) {
  }

  ngAfterViewInit() {
    this.datatable.refresh(this.elasticQuery.query);
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
    }
  }

  confirmDelete(id: any) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir o registro?',
      accept: () => {
        this.manualService.delete(id).subscribe(() => {
          this.datatable.refresh(undefined);
        });
      }
    });
  }
}
