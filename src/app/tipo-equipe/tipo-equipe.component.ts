import { Component, ViewChild, AfterViewInit, OnInit, OnDestroy  } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { DatatableComponent, DatatableClickEvent } from '@basis/angular-components';

import { environment } from '../../environments/environment';
import { TipoEquipe } from './tipo-equipe.model';
import { TipoEquipeService } from './tipo-equipe.service';
import { ElasticQuery } from '../shared';

import { PageNotificationService } from '@basis/angular-components';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MessageUtil } from '../util/message.util';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'jhi-tipo-equipe',
  templateUrl: './tipo-equipe.component.html'
})
export class TipoEquipeComponent implements AfterViewInit {

  @BlockUI() blockUI: NgBlockUI;

  @ViewChild(DatatableComponent) datatable: DatatableComponent;

  searchUrl: string = this.tipoEquipeService.searchUrl;

  paginationParams = { contentIndex: null };

  equipeSelecionada: TipoEquipe;

  elasticQuery: ElasticQuery = new ElasticQuery();

  rowsPerPageOptions: number[] = [5, 10, 20];

  valueFiltroCampo: string;

  constructor(
    private router: Router,
    private tipoEquipeService: TipoEquipeService,
    private confirmationService: ConfirmationService,
    private pageNotificationService: PageNotificationService,
     ) { }

    valueFiltro(valuefiltro: string) {
    this.valueFiltroCampo = valuefiltro;
    this.datatable.refresh(valuefiltro);
  }

  public ngOnInit(){
    this.datatable.pDatatableComponent.onRowSelect.subscribe((event) => {
      this.equipeSelecionada = event.data;
    });
  this.datatable.pDatatableComponent.onRowUnselect.subscribe((event) => {
    this.equipeSelecionada = undefined;
  });
  }

  public ngAfterViewInit() {
    this.recarregarDataTable();
  }

  public datatableClick(event: DatatableClickEvent) {
    if (!event.selection) {
      return;
    }
    switch (event.button) {
      case 'edit':
        this.router.navigate(['/admin/tipoEquipe', event.selection.id, 'edit']);
        break;
      case 'delete':
        this.confirmDelete(event.selection.id);
        break;
      case 'view':
        this.router.navigate(['/admin/tipoEquipe', event.selection.id]);
        break;
    }
  }

  public onRowDblclick(event) {
    
    if (event.target.nodeName === 'TD') {
      this.abrirEditar();
    }else if (event.target.parentNode.nodeName === 'TD') {
      this.abrirEditar();
    }
}

abrirEditar(){
  this.router.navigate(['/admin/tipoEquipe', this.equipeSelecionada.id, 'edit']);
}

  public confirmDelete(id: any) {
    this.confirmationService.confirm({
      message: MessageUtil.CONFIRMAR_EXCLUSAO,
      accept: () => {
        this.blockUI.start(MessageUtil.EXCLUINDO_REGISTRO);
        this.tipoEquipeService.delete(id).subscribe(() => {
          this.recarregarDataTable();
          this.pageNotificationService.addDeleteMsg();
          this.blockUI.stop();
        }, error => {
          if (error.status === 500) {
            this.pageNotificationService.addErrorMessage(MessageUtil.ERROR_DELETE_REGISTRO);
          }
        });
      }
    });
  }

  public limparPesquisa() {
    this.elasticQuery.reset();
    this.recarregarDataTable();
  }

  public recarregarDataTable() {
    this.datatable.refresh(this.elasticQuery.query);
  }

}
