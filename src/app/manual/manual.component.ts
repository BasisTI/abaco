import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { DatatableComponent, DatatableClickEvent } from '@basis/angular-components';
import { environment } from '../../environments/environment';
import { Manual } from './manual.model';
import { ManualService } from './manual.service';
import { ElasticQuery, PageNotificationService } from '../shared';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MessageUtil } from '../util/message.util';
import { Response } from '@angular/http';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'jhi-manual',
  templateUrl: './manual.component.html'
})
export class ManualComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  @ViewChild(DatatableComponent) datatable: DatatableComponent;

  searchUrl: string = this.manualService.searchUrl;

  paginationParams = { contentIndex: null };

  elasticQuery: ElasticQuery = new ElasticQuery();

  manualSelecionado: Manual;

  nomeDoManualClonado: string;

  mostrarDialogClonar = false;

  rowsPerPageOptions: number[] = [5, 10, 20];
  
  constructor(
    private router: Router,
    private manualService: ManualService,
    private confirmationService: ConfirmationService,
    private pageNotificationService: PageNotificationService
  ) { }

  public ngOnInit() {
      
    this.datatable.pDatatableComponent.onRowSelect.subscribe((event) => {
      this.manualSelecionado = new Manual().copyFromJSON(event.data);
    });
    this.datatable.pDatatableComponent.onRowUnselect.subscribe((event) => {
      this.manualSelecionado = undefined;
    });
  }

  public desabilitarBotaoClonar(): boolean {
    if (this.manualSelecionado) {
      return true;
    } else {
      return false;
    }
  }

  public datatableClick(event: DatatableClickEvent) {
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
      case 'clone':
        this.mostrarDialogClonar = true;
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
  this.router.navigate(['/manual', this.manualSelecionado.id, 'edit']);
}

  public fecharDialogClonar() {
    this.nomeDoManualClonado = '';
    this.manualSelecionado = undefined;
    this.mostrarDialogClonar = false;
  }

  public clonar() {
    const manualClonado: Manual = this.manualSelecionado.clone();
    manualClonado.id = undefined;
    manualClonado.nome = this.nomeDoManualClonado;
    manualClonado.esforcoFases.forEach(ef => ef.id = undefined);
    manualClonado.fatoresAjuste.forEach(fa => fa.id = undefined);

    this.manualService.create(manualClonado).subscribe((manualSalvo: Manual) => {
      this.pageNotificationService
        .addSuccessMsg(`Manual '${manualSalvo.nome}' clonado a partir do manual '${this.manualSelecionado.nome}' com sucesso!`);
      this.fecharDialogClonar();
      this.recarregarDataTable();

    }, (error: Response) => {

      if (error.headers.toJSON()['x-abacoapp-error'][0] === 'error.manualexists') {
          this.pageNotificationService.addErrorMsg('Já existe um Manual registrado com este nome!');
          document.getElementById('nome_manual').setAttribute('style', 'border-color: red;');
          }
      });
  }

  public limparPesquisa() {
    this.elasticQuery.reset();
    this.recarregarDataTable();
  }

  public confirmDelete(id: any) {
    this.confirmationService.confirm({
      message: MessageUtil.CONFIRMAR_EXCLUSAO,
      accept: () => {
        this.blockUI.start(MessageUtil.EXCLUINDO_REGISTRO);
        this.manualService.delete(id).subscribe(() => {
          this.recarregarDataTable();
          this.blockUI.stop();
        }, (error: Response) => {

          if (error.headers.toJSON()['x-abacoapp-error'][0] === 'error.contratoexists') {
              this.pageNotificationService.addErrorMsg('Manual '+this.manualSelecionado.nome+' está vinculado a um Contrato e não pode ser excluído!');
              }
        }
      );
      }
    });
  }

  public recarregarDataTable() {
    this.datatable.refresh(this.elasticQuery.query);
  }
}
