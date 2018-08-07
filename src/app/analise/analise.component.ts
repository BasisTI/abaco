import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService} from 'primeng/primeng';
import { DatatableComponent, DatatableClickEvent } from '@basis/angular-components';
import { BlockUI, NgBlockUI} from 'ng-block-ui';
import { environment } from '../../environments/environment';
import { Analise } from './analise.model';
import { AnaliseService } from './analise.service';
import { ElasticQuery, PageNotificationService } from '../shared';
import { MessageUtil } from '../util/message.util';
import { FuncaoDados } from '../funcao-dados';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'jhi-analise',
  templateUrl: './analise.component.html'
})
export class AnaliseComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  @ViewChild(DatatableComponent) datatable: DatatableComponent;

  searchUrl: string = this.analiseService.searchUrl;

  elasticQuery: ElasticQuery = new ElasticQuery();

  rowsPerPageOptions: number[] = [5, 10, 20, 50, 100];

  analiseSelecionada; analiseReadyToClone: Analise;

  block: boolean;

  unblock: boolean;

  
  /**
   *
   */
  constructor(
    private router: Router,
    private analiseService: AnaliseService,
    private confirmationService: ConfirmationService,
    private pageNotificationService: PageNotificationService,
  ) { }

  /**
   *
   */
  public ngOnInit() {
    this.block = true;
    this.unblock = true;
    this.datatable.pDatatableComponent.onRowSelect.subscribe((event) => {
      this.analiseReadyToClone = new Analise().copyFromJSON(event.data);
      this.block = true;
      this.unblock = true;
      this.analiseSelecionada = event.data;
      this.block = !event.data.bloqueiaAnalise;
      this.unblock = event.data.bloqueiaAnalise;
    });
    this.datatable.pDatatableComponent.onRowUnselect.subscribe((event) => {
      this.analiseSelecionada = undefined;
      this.analiseReadyToClone = undefined;
    });
  }

  /**
   *
   */
  public datatableClick(event: DatatableClickEvent) {
    if (!event.selection) {
      return;
    }
    switch (event.button) {
      case 'edit':
        if(event.selection.bloqueiaAnalise){ this.pageNotificationService.addErrorMsg('Você não pode editar uma análise bloqueada!'); return }
        this.router.navigate(['/analise', event.selection.id, 'edit']);
        break;
      case 'delete':
        this.confirmDelete(event.selection);
        break;
      case 'relatorioBrowser':
        this.geraRelatorioPdfBrowser(event.selection);
        break;
      case 'relatorioArquivo' :
        this.gerarRelatorioPdfArquivo(event.selection);
        break;
      case 'relatorioBrowserDetalhado' :
        this.geraRelatorioPdfDetalhadoBrowser(event.selection);
        break;
      case 'clone' :
        this.clonar(this.analiseReadyToClone);
        break;
    }
  }

  public clonar(analise: Analise){
    const analiseClonada = analise.clone();
    this.confirmationService.confirm({
      message: MessageUtil.CONFIRMAR_CLONE + ' ' + this.analiseSelecionada.identificadorAnalise + '?',
      accept: () => {
        analiseClonada.id = undefined;
        analiseClonada.identificadorAnalise += " - CÓPIA";
        analiseClonada.bloqueiaAnalise = false;

        analiseClonada.funcaoDados.forEach(FuncaoDados => { 
          FuncaoDados.id = undefined;
          FuncaoDados.ders.forEach(Ders => {
            Ders.id = undefined;
          });
          FuncaoDados.rlrs.forEach(rlrs => {
            rlrs.id = undefined;
          });
        });

        analiseClonada.funcaoTransacaos.forEach(funcaoTransacaos => {
          funcaoTransacaos.id = undefined;
          funcaoTransacaos.ders.forEach(ders => {
            ders.id = undefined;
          });
          funcaoTransacaos.alrs.forEach(alrs => {
            alrs.id = undefined;
          });
        });

        this.analiseService.create(analiseClonada).subscribe((res) => {
          
          this.pageNotificationService.addSuccessMsg(`Análise '${this.analiseSelecionada.identificadorAnalise}' clonada com sucesso!`);
          this.recarregarDataTable();
          this.router.navigate(['/analise', res.id, 'edit']);
        });
      }
    });
    
  }
  /**
   *
   */
  public confirmDelete(analise: Analise) {
    if(this.analiseSelecionada.bloqueiaAnalise){
      this.pageNotificationService.addErrorMsg('Você não pode excluir uma análise bloqueada!');
      return;
    }
    this.confirmationService.confirm({
      message: MessageUtil.CONFIRMAR_EXCLUSAO + ' ' + analise.identificadorAnalise + '?',
      accept: () => {
        this.blockUI.start(MessageUtil.EXCLUINDO_REGISTRO);
        this.analiseService.delete(analise.id).subscribe(() => {
          this.recarregarDataTable();
          this.blockUI.stop();
          this.pageNotificationService.addDeleteMsgWithName(analise.identificadorAnalise);
        });
      }
    });
  }

  /**
   *
   */
  public limparPesquisa() {
    this.elasticQuery.reset();
    this.recarregarDataTable();
  }

  /**
   *
   */
  public recarregarDataTable() {
    this.datatable.refresh(this.elasticQuery.query);
  }

  /**
   * Método responsável por gerar o relatório diretamente sem a apresentação do relatório no browser.
   * @param analise
   */
  public gerarRelatorioPdfArquivo(analise: Analise) {
    this.analiseService.gerarRelatorioPdfArquivo(analise.id);
  }

  /**
   * Método responsável pela a apresentação do relatório no browser.
   * @param analise
   */
  public geraRelatorioPdfBrowser(analise: Analise) {
    this.analiseService.geraRelatorioPdfBrowser(analise.id);
  }

  /**
   * Método responsável por gerar o relatório detalhado da analise.
   * @param analise
   */
  public geraRelatorioPdfDetalhadoBrowser(analise: Analise) {
    if ((analise.metodoContagem === "DETALHADA" && (analise.funcaoDados.length === 0 || analise.funcaoTransacaos.length === 0)) || analise.funcaoDados.length === 0){
      this.pageNotificationService.addErrorMsg('Preencha os campos Função de dados e/ou Função de transação para gerar um relatório');
    } else {
      this.analiseService.geraRelatorioPdfDetalhadoBrowser(analise.id);
    }
  }

  /**
   *
   */
  public desabilitarBotaoRelatorio(): boolean {
    if (this.analiseSelecionada) {
      return true;
    } else {
      return false;
    }
  }

  public bloqueiaRelatorio() {
    if(this.analiseSelecionada.bloqueiaAnalise){
      this.pageNotificationService.addErrorMsg('Registro já está bloqueado');
      return;
    }
    this.confirmationService.confirm({
      message: MessageUtil.CONFIRMAR_BLOQUEIO + ' ' + this.analiseSelecionada.identificadorAnalise + '?',
      accept: () => {
        this.analiseService.block(this.analiseSelecionada).subscribe(() => {
          this.pageNotificationService.addBlockMsgWithName(this.analiseSelecionada.identificadorAnalise);
          this.recarregarDataTable();
          this.block = true;
          this.unblock = true;
        })
      }
    });
  }

  public desbloqueiaRelatorio() {
    if(!this.analiseSelecionada.bloqueiaAnalise){
      this.pageNotificationService.addErrorMsg('Registro já está desbloqueado');
      return;
    }
    this.confirmationService.confirm({
      message: MessageUtil.CONFIRMAR_DESBLOQUEIO + ' ' + this.analiseSelecionada.identificadorAnalise + '?',
      accept: () => {
        this.analiseService.unblock(this.analiseSelecionada).subscribe(() => {
          this.pageNotificationService.addUnblockMsgWithName(this.analiseSelecionada.identificadorAnalise);
          this.recarregarDataTable();
          this.block = true;
          this.unblock = true;
        });
      }
    });
  }
}
