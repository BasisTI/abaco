import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng';
import { DatatableComponent, DatatableClickEvent } from '@nuvem/primeng-components';
import { ContratoService } from '../contrato.service';


@Component({
  selector: 'jhi-contrato',
  templateUrl: './contrato-list.component.html'
})
export class ContratoListComponent {

  @ViewChild(DatatableComponent) datatable: DatatableComponent;

  searchUrl: string = this.contratoService.searchUrl;

  constructor(
    private router: Router,
    private contratoService: ContratoService,
    private confirmationService: ConfirmationService,
  ) {}

  getLabel(label) {
    let str: any;
    return str;
  }

  datatableClick(event: DatatableClickEvent) {
    if (!event.selection) {
      return;
    }
    switch (event.button) {
      case 'edit':
        this.router.navigate(['/contrato', event.selection.id, 'edit']);
        break;
      case 'delete':
        this.confirmDelete(event.selection.id);
        break;
      case 'view':
        this.router.navigate(['/contrato', event.selection.id]);
        break;
    }
  }

  confirmDelete(id: any) {
    this.confirmationService.confirm({
      message:'Tem certeza que deseja excluir o registro?',
      accept: () => {
        this.contratoService.delete(id).subscribe(() => {
          this.datatable.refresh(undefined);
        });
      }
    });
  }
}
