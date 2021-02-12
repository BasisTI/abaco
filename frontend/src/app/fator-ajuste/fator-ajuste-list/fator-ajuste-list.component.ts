import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableClickEvent, DatatableComponent } from '@nuvem/primeng-components';
import { ConfirmationService } from 'primeng';
import { FatorAjusteService } from '../fator-ajuste.service';


@Component({
  selector: 'app-fator-ajuste-list',
  templateUrl: './fator-ajuste-list.component.html'
})
export class FatorAjusteListComponent {

  @ViewChild(DatatableComponent) datatable: DatatableComponent;

  searchUrl: string = this.fatorAjusteService.searchUrl;

  constructor(
    private router: Router,
    private fatorAjusteService: FatorAjusteService,
    private confirmationService: ConfirmationService,
  ) { }

  getLabel(label) {
    return label;
  }

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
      message: this.getLabel('Tem certeza que deseja excluir o registro?'),
      accept: () => {
        this.fatorAjusteService.delete(id).subscribe(() => {
          this.datatable.refresh(undefined);
        });
      }
    });
  }
}
