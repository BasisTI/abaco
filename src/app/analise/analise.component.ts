import { Manual } from './../manual/manual.model';
import { Sistema, SistemaService } from './../sistema';
import { TipoEquipe, TipoEquipeService } from './../tipo-equipe';
import { Organizacao, OrganizacaoService } from './../organizacao';
import { User, UserService } from '../user';
import { StringConcatService } from './../shared/string-concat.service';
import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, SelectItem } from 'primeng/primeng';
import { DatatableComponent, DatatableClickEvent } from '@basis/angular-components';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Analise, AnaliseService, MetodoContagem } from './';
import { ElasticQuery, PageNotificationService } from '../shared';
import { MessageUtil } from '../util/message.util';

@Component({
    selector: 'jhi-analise',
    templateUrl: './analise.component.html'
})
export class AnaliseComponent implements OnInit, AfterViewInit {

    @BlockUI() blockUI: NgBlockUI;

    @ViewChild(DatatableComponent) datatable: DatatableComponent;

    searchUrl: string = this.analiseService.searchUrl;

    userAnaliseUrl: string;

    elasticQuery: ElasticQuery = new ElasticQuery();

    rowsPerPageOptions: number[] = [5, 10, 20, 50, 100];

    analiseSelecionada;
    analiseReadyToClone: Analise;
    nomeSistemas: Array<Sistema>;
    organizations: Array<Organizacao>;
    teams: Array<TipoEquipe>;
    searchParams: any = {
        identidicador: undefined,
        nomeSistema: undefined,
        metContagem: undefined,
        organizacao: undefined,
        team: undefined
      };

      metsContagens = [
        { value: '', text: ''},
        { value: 'DETALHADA', text: 'DETALHADA'},
        { value: 'INDICATIVA', text: 'INDICATIVA'},
        { value: 'ESTIMADA', text: 'ESTIMADA'}
        ];

    blocked: boolean;

    private userId: number;         // Usado para carregar apenas os organizações e equipes referentes ao usuário logado

    constructor(
        private router: Router,
        private confirmationService: ConfirmationService,
        private sistemaService: SistemaService,
        private analiseService: AnaliseService,
        private tipoEquipeService: TipoEquipeService,
        private organizacaoService: OrganizacaoService,
        private pageNotificationService: PageNotificationService,
        private stringConcatService: StringConcatService,
        private userService: UserService
    ) {}

    public ngOnInit() {

        this.recuperarAnalisesUsuario();
        this.recuperarOrganizacoes();
        this.recuperarEquipe();
        this.recuperarSistema();

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

    recuperarAnalisesUsuario() {
        const userSub = this.userService.findCurrentUser().subscribe(res => {
          this.userId = res.id;
          this.userAnaliseUrl = `${this.analiseService.resourceUrl}/user/${this.userId}`;
          this.buscarAnalises(this.userId);
        });
      }

    buscarAnalises(idUser: number) {
        const analiseSub = this.analiseService.findAnalisesUsuario(this.userId).subscribe(res => {
            console.log(res);
        });
    }

    recuperarOrganizacoes() {
        this.organizacaoService.query().subscribe(response => {
          this.organizations = response.json;
          let emptyOrg = new Organizacao();
          emptyOrg.nome = '';
          this.organizations.unshift(emptyOrg);
        });
      }

    recuperarSistema() {
        this.sistemaService.query().subscribe(response => {
        this.nomeSistemas = response.json;
        let emptySystem = new Sistema();
        emptySystem.nome = '';
        this.nomeSistemas.unshift(emptySystem);
        });
    }

    recuperarEquipe() {
    this.tipoEquipeService.query().subscribe(response => {
        this.teams = response.json;
        let emptyTeam = new TipoEquipe();
        emptyTeam.nome = '';
        this.teams.unshift(emptyTeam);
    });
    }

    ngAfterViewInit() {
    this.recarregarDataTable();
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
                this.router.navigate(['/analise', event.selection.id, 'view']);
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

    public onRowDblclick(event) {

        if (event.target.nodeName === 'TD') {
          this.abrirEditar();
        }else if (event.target.parentNode.nodeName === 'TD') {
          this.abrirEditar();
        }
    }

    abrirEditar() {
      this.router.navigate(['/analise', this.analiseSelecionada.id, 'edit']);
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
        this.searchParams.organizacao = undefined;
        this.searchParams.identificador = undefined;
        this.searchParams.nomeSistema = undefined;
        this.searchParams.metContagem = undefined;
        this.searchParams.team = undefined;
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
    private checkUndefinedParams() {
        (this.searchParams.identificador === '') ? (this.searchParams.identificador = undefined) : (this);
        (this.searchParams.nomeSistema !== undefined) ? ((this.searchParams.nomeSistema.nome === '') ? (this.searchParams.nomeSistema.nome = undefined) : (this)) : (this);
        (this.searchParams.metContagem !== undefined) ? ((this.searchParams.metContagem.text === '') ? (this.searchParams.metContagem.text = undefined) : (this)) : (this);
        (this.searchParams.team !== undefined) ? ((this.searchParams.team.nome === '') ? (this.searchParams.team.nome = undefined) : (this)) : (this);
        (this.searchParams.organizacao !== undefined) ? ((this.searchParams.organizacao.nome === '') ? (this.searchParams.organizacao.nome = undefined) : (console.log('Caiu no false'))) : (this);
      }

      private createStringParamsArray(): Array<string> {
        let stringParamsArray: Array<string> = [];

        (this.searchParams.identificador !== undefined) ? (stringParamsArray.push(this.searchParams.identificador)) : (this);
        (this.searchParams.nomeSistema !== undefined) ? ((this.searchParams.nomeSistema.nome !== undefined) ? (stringParamsArray.push(this.searchParams.nomeSistema.nome)) : (this)) : (this);
        (this.searchParams.metContagem !== undefined) ? ((this.searchParams.metContagem.text !== undefined) ? (stringParamsArray.push(this.searchParams.metContagem.text)) : (this)) : (this);
        (this.searchParams.team !== undefined) ? ((this.searchParams.team.nome !== undefined) ? (stringParamsArray.push(this.searchParams.team.nome)) : (this)) : (this);
        (this.searchParams.organizacao !== undefined) ? ((this.searchParams.organizacao.nome !== undefined) ? (stringParamsArray.push(this.searchParams.organizacao.nome)) : (this)) : (this);

        return stringParamsArray;
      }

      public performSearch() {
        this.checkUndefinedParams();
        this.elasticQuery.value = this.stringConcatService.concatResults(this.createStringParamsArray());
        this.recarregarDataTable();
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
