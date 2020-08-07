import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng';
import { DatatableComponent, DatatableClickEvent } from '@nuvem/primeng-components';
import { FuncionalidadeService } from '../funcionalidade.service';

@Component({
  selector: 'jhi-funcionalidade',
  templateUrl: './funcionalidade-list.component.html'
})
export class FuncionalidadeListComponent {

  @ViewChild(DatatableComponent) datatable: DatatableComponent;

  searchUrl: string = this.funcionalidadeService.searchUrl;

  constructor(
    private router: Router,
    private funcionalidadeService: FuncionalidadeService,
    private confirmationService: ConfirmationService,
  ) { }

  datatableClick(event: DatatableClickEvent) {
    if (!event.selection) {
      return;
    }
    switch (event.button) {
      case 'edit':
        this.router.navigate(['/funcionalidade', event.selection.id, 'edit']);
        break;
      case 'delete':
        this.confirmDelete(event.selection.id);
        break;
      case 'view':
        this.router.navigate(['/funcionalidade', event.selection.id]);
        break;
    }
  }

  getLabel(label) {
    return label;
  }

  confirmDelete(id: any) {
    this.confirmationService.confirm({
      message: this.getLabel('Tem certeza que deseja excluir o registro?'),
      accept: () => {
        this.funcionalidadeService.delete(id).subscribe(() => {
          this.datatable.refresh(undefined);
        });
      }
    });
  }
}
