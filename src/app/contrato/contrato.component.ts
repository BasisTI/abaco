import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { DatatableComponent, DatatableClickEvent } from '@basis/angular-components';

import { environment } from '../../environments/environment';
import { Contrato } from './contrato.model';
import { ContratoService } from './contrato.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-contrato',
  templateUrl: './contrato.component.html'
})
export class ContratoComponent {

  @ViewChild(DatatableComponent) datatable: DatatableComponent;

  searchUrl: string = this.contratoService.searchUrl;

  constructor(
    private router: Router,
    private contratoService: ContratoService,
    private confirmationService: ConfirmationService,
    private translate: TranslateService
  ) {}

  getLabel(label) {
    let str: any;
    this.translate.get(label).subscribe((res: string) => {
        str = res;
    }).unsubscribe();
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
      message: this.getLabel('Global.Mensagens.CertezaExcluirRegistro'),
      accept: () => {
        this.contratoService.delete(id).subscribe(() => {
          this.datatable.refresh(undefined);
        });
      }
    });
  }
}
