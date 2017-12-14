import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { DatatableComponent, DatatableClickEvent } from '@basis/angular-components';

import { environment } from '../../environments/environment';
import { FatorAjuste } from './fator-ajuste.model';
import { FatorAjusteService } from './fator-ajuste.service';

@Component({
  selector: 'jhi-fator-ajuste',
  templateUrl: './fator-ajuste.component.html'
})
export class FatorAjusteComponent {

  @ViewChild(DatatableComponent) datatable: DatatableComponent;

  searchUrl: string = this.fatorAjusteService.searchUrl;

  constructor(
    private router: Router,
    private fatorAjusteService: FatorAjusteService,
    private confirmationService: ConfirmationService
  ) {}

  datatableClick(event: DatatableClickEvent) {
    if (!event.selection) {
      return;
    }
    switch (event.button) {
      case 'edit':
        this.router.navigate(['/fatorAjuste', event.selection.id, 'edit']);
        break;
      case 'delete':
        this.confirmDelete(event.selection.id);
        break;
      case 'view':
        this.router.navigate(['/fatorAjuste', event.selection.id]);
        break;
    }
  }

  confirmDelete(id: any) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir o registro?',
      accept: () => {
        this.fatorAjusteService.delete(id).subscribe(() => {
          this.datatable.refresh(undefined);
        });
      }
    });
  }
}
