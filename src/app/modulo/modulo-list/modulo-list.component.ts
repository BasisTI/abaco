import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng';

import { environment } from '../../../environments/environment';
import { Modulo } from '../modulo.model';
import { ModuloService } from '../modulo.service';
import { DatatableComponent, DatatableClickEvent } from '@nuvem/primeng-components';

@Component({
  selector: 'jhi-modulo',
  templateUrl: './modulo-list.component.html'
})
export class ModuloListComponent {

  @ViewChild(DatatableComponent) datatable: DatatableComponent;

  searchUrl: string = this.moduloService.searchUrl;

  constructor(
    private router: Router,
    private moduloService: ModuloService,
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
        this.router.navigate(['/modulo', event.selection.id, 'edit']);
        break;
      case 'delete':
        this.confirmDelete(event.selection.id);
        break;
      case 'view':
        this.router.navigate(['/modulo', event.selection.id]);
        break;
    }
  }

  confirmDelete(id: any) {
    this.confirmationService.confirm({
      message: this.getLabel('Global.Mensagens.CertezaExcluirRegistro'),
      accept: () => {
        this.moduloService.delete(id).subscribe(() => {
          this.datatable.refresh(undefined);
        });
      }
    });
  }
}
