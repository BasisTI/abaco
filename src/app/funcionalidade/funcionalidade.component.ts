import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { DatatableComponent, DatatableClickEvent } from '@basis/angular-components';

import { environment } from '../../environments/environment';
import { Funcionalidade } from './funcionalidade.model';
import { FuncionalidadeService } from './funcionalidade.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-funcionalidade',
  templateUrl: './funcionalidade.component.html'
})
export class FuncionalidadeComponent {

  @ViewChild(DatatableComponent) datatable: DatatableComponent;

  searchUrl: string = this.funcionalidadeService.searchUrl;

  constructor(
    private router: Router,
    private funcionalidadeService: FuncionalidadeService,
    private confirmationService: ConfirmationService,
    private translate: TranslateService
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
    let str: any;
    this.translate.get(label).subscribe((res: string) => {
      str = res;
    }).unsubscribe();
    return str;
  }

  confirmDelete(id: any) {
    this.confirmationService.confirm({
      message: this.getLabel('Global.Mensagens.CertezaExcluirRegistro'),
      accept: () => {
        this.funcionalidadeService.delete(id).subscribe(() => {
          this.datatable.refresh(undefined);
        });
      }
    });
  }
}
