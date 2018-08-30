import {Component, ViewChild, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ConfirmationService} from 'primeng/primeng';
import {DatatableComponent, DatatableClickEvent} from '@basis/angular-components';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Analise} from './analise.model';
import {AnaliseService} from './analise.service';
import {ElasticQuery, PageNotificationService} from '../shared';
import {MessageUtil} from '../util/message.util';

@Component({
    selector: 'jhi-analise',
    templateUrl: './analise.component.html'
})
export class AnaliseComponent implements OnInit {

    @BlockUI() blockUI: NgBlockUI;

    @ViewChild(DatatableComponent) datatable: DatatableComponent;

    searchUrl: string = this.analiseService.searchUrl;

    elasticQuery: ElasticQuery = new ElasticQuery();

    rowsPerPageOptions: number[] = [5, 10, 20, 50, 100];

    analiseSelecionada;
    analiseReadyToClone: Analise;

    blocked: boolean;

    constructor(
        private router: Router,
        private analiseService: AnaliseService,
        private confirmationService: ConfirmationService,
        private pageNotificationService: PageNotificationService,
    ) {
    }

    public ngOnInit() {
        this.blocked = false;
        this.datatable.pDatatableComponent.onRowSelect.subscribe((event) => {
            this.analiseReadyToClone = new Analise().copyFromJSON(event.data);
            this.analiseSelecionada = event.data;
            this.blocked = event.data.bloqueiaAnalise;
        });
        this.datatable.pDatatableComponent.onRowUnselect.subscribe((event) => {
            this.analiseSelecionada = undefined;
            this.analiseReadyToClone = undefined;
        });
    }

    /**
     * Clique na tabela análise
     */
    public datatableClick(event: DatatableClickEvent) {
        if (!event.selection) {
            return;
        }
        switch (event.button) {
            case 'edit':
                if (event.selection.bloqueiaAnalise) {
                    this.pageNotificationService.addErrorMsg(
                        MessageUtil.ERRO_EXCLUSAO_ANALISE_BLOQUEADA);
                    return;
                }
                this.router.navigate(['/analise', event.selection.id, 'edit']);
                break;
            case 'view':
                this.router.navigate(['/analise', event.selection.id]);
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
            case 'geraBaselinePdfBrowser' :
                this.geraBaselinePdfBrowser();
                break;
        }
    }

    /**
     * Clonar análise
     */
    public clonar(analise: Analise) {
        const analiseClonada = analise.clone();
        this.confirmationService.confirm({
            message: MessageUtil.CONFIRMAR_CLONE.concat(this.analiseSelecionada.identificadorAnalise).concat('?'),
            accept: () => {
                analiseClonada.id = undefined;
                analiseClonada.identificadorAnalise += MessageUtil.CONCAT_COPIA;
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

                this.analiseService.create(analiseClonada).subscribe((res: any) => {
                    const menssagem: string = MessageUtil.ANALISE.concat(' ').
                    concat(this.analiseSelecionada.identificadorAnalise).
                    concat(MessageUtil.CLONAGEM_SUCESSO);

                    this.pageNotificationService.addSuccessMsg(menssagem);
                    this.recarregarDataTable();
                    this.router.navigate(['/analise', res.id, 'edit']);
                });
            }
        });

    }

    /**
     * Confirmar deleção de uma análise
     */
    public confirmDelete(analise: Analise) {
        if (this.analiseSelecionada.bloqueiaAnalise) {
            this.pageNotificationService.addErrorMsg(MessageUtil.ERRO_EXCLUSAO_ANALISE_BLOQUEADA);
            return;
        }
        this.confirmationService.confirm({
            message: MessageUtil.CONFIRMAR_EXCLUSAO.concat(analise.identificadorAnalise).concat('?'),
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
     * Limpa a pesquisa e recarrega a tabela
     */
    public limparPesquisa() {
        this.elasticQuery.reset();
        this.recarregarDataTable();
    }

    /**
     * Recarrega a tabela de análise
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
            this.analiseService.geraRelatorioPdfDetalhadoBrowser(analise.id);
    }

     /**
     * Método responsável por gerar o relatório da baseline.
     * @param analise
     */
    public geraBaselinePdfBrowser() {
        this.analiseService.geraBaselinePdfBrowser();
    }

    /**
     * Desabilita botão relatório
     */
    public desabilitarBotaoRelatorio(): boolean {
        return !this.analiseSelecionada;
    }

    /**
     * Bloqueia relatório
     */
    public bloqueiaRelatorio() {
        if (this.analiseSelecionada.bloqueiaAnalise) {
            this.pageNotificationService.addErrorMsg(MessageUtil.REGISTRO_ESTA_BLOQUEADO);
            return;
        }
        this.confirmationService.confirm({
            message: MessageUtil.CONFIRMAR_BLOQUEIO.concat(this.analiseSelecionada.identificadorAnalise).concat('?'),
            accept: () => {
                this.analiseService.block(this.analiseSelecionada).subscribe(() => {
                    this.pageNotificationService.addBlockMsgWithName(this.analiseSelecionada.identificadorAnalise);
                    this.recarregarDataTable();
                    this.blocked = !this.blocked;
                });
            }
        });
    }

    /**
     * Desbloquear relatório
     */
    public desbloqueiaRelatorio() {
        if (!this.analiseSelecionada.bloqueiaAnalise) {
            this.pageNotificationService.addErrorMsg(MessageUtil.REGISTRO_ESTA_BLOQUEADO);
            return;
        }
        this.confirmationService.confirm({
            message: MessageUtil.CONFIRMAR_DESBLOQUEIO.concat(' ').
            concat(this.analiseSelecionada.identificadorAnalise).concat('?'),
            accept: () => {
                this.analiseService.unblock(this.analiseSelecionada).subscribe(() => {
                    this.pageNotificationService.addUnblockMsgWithName(this.analiseSelecionada.identificadorAnalise);
                    this.recarregarDataTable();
                    this.blocked = !this.blocked;
                });
            }
        });
    }
}
