import { TranslateService } from '@ngx-translate/core';
import { Sistema, SistemaService } from './../sistema';
import { TipoEquipe, TipoEquipeService } from './../tipo-equipe';
import { Organizacao, OrganizacaoService } from './../organizacao';
import { User, UserService } from '../user';
import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, SelectItem } from 'primeng/primeng';
import { Analise, AnaliseService, AnaliseShareEquipe, GrupoService } from './';
import { DatatableComponent, DatatableClickEvent } from '@basis/angular-components';
import { PageNotificationService, ResponseWrapper } from '../shared';
import { MessageUtil } from '../util/message.util';
import { Response } from '@angular/http';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Grupo, SearchGroup } from './grupo/grupo.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'jhi-analise',
    templateUrl: './analise.component.html'
})
export class AnaliseComponent implements OnInit, AfterViewInit {

    @ViewChild(DatatableComponent) datatable: DatatableComponent;
    @BlockUI() blockUI: NgBlockUI;

    searchUrl: string = this.grupoService.grupoUrl;

    userAnaliseUrl: string = this.searchUrl;

    rowsPerPageOptions: number[] = [5, 10, 20, 50, 100];

    analiseSelecionada: any = new Grupo();
    searchGroup: SearchGroup = new SearchGroup();
    nomeSistemas: Array<Sistema>;
    organizations: Array<Organizacao>;
    teams: Array<TipoEquipe>;
    equipeShare; analiseShared: Array<AnaliseShareEquipe> = [];
    selectedEquipes: Array<AnaliseShareEquipe>;
    selectedToDelete: AnaliseShareEquipe;
    analiseTemp: Analise = new Analise();
    loggedUser: User;
    query: String;

    metsContagens = [
        { label: undefined, value: undefined },
        { label: 'DETALHADA', value: 'DETALHADA' },
        { label: 'INDICATIVA', value: 'INDICATIVA' },
        { label: 'ESTIMADA', value: 'ESTIMADA' }
    ];

    blocked; inicial: boolean;
    mostrarDialog = false;

    constructor(
        private router: Router,
        private confirmationService: ConfirmationService,
        private sistemaService: SistemaService,
        private analiseService: AnaliseService,
        private tipoEquipeService: TipoEquipeService,
        private organizacaoService: OrganizacaoService,
        private pageNotificationService: PageNotificationService,
        private userService: UserService,
        private grupoService: GrupoService,
        private cdref: ChangeDetectorRef,
        private translate: TranslateService
    ) { }

    public ngOnInit() {
        this.blockUI.stop();
        this.userAnaliseUrl = this.changeUrl();
        this.estadoInicial();
        this.traduzirmetsContagens();
    }

    getLabel(label) {
        let str: any;
        this.translate.get(label).subscribe((res: string) => {
            str = res;
        }).unsubscribe();
        return str;
    }

    estadoInicial() {
        this.getLoggedUser();
        this.recuperarAnalisesUsuario();            // Filtrando as análises que o usuário pode ver
        this.recuperarOrganizacoes();
        this.recuperarEquipe();
        this.recuperarSistema();
        this.inicial = false;

        this.datatable.pDatatableComponent.onRowSelect.subscribe((event) => {
            this.analiseSelecionada = event.data;
            this.blocked = event.data.bloqueado;
            this.inicial = true;
        });
        this.datatable.pDatatableComponent.onRowUnselect.subscribe((event) => {
            this.analiseSelecionada = undefined;
        });
    }
    /**
     * Função para recuperar os dados do usuário logado no momento
     */
    getLoggedUser() {
        this.userService.findCurrentUser().subscribe(res => {
            this.loggedUser = res;
        });
    }
    /*
    *   Metodo responsavel por traduzir metricas de Analise
    */
    traduzirmetsContagens() {
        this.translate.stream(['Analise.Analise.metsContagens.DETALHADA', 'Analise.Analise.metsContagens.ESTIMADA',
            'Analise.Analise.metsContagens.INDICATIVA']).subscribe((traducao) => {
                this.metsContagens = [
                    { label: traducao['Analise.Analise.metsContagens.DETALHADA'], value: 'DETALHADA' },
                    { label: traducao['Analise.Analise.metsContagens.ESTIMADA'], value: 'ESTIMADA' },
                    { label: traducao['Analise.Analise.metsContagens.INDICATIVA'], value: 'INDICATIVA' }
                ];

            })
    }


    /**
     * Função para recuperar análises da equipe do usuário
     */
    recuperarAnalisesUsuario() {
        // this.blockUI.start('Carregando análises...');
        // this.carregarDataTable();     // Buscando as benditas análises
    }

    /**
     * Função que faz requisição das análises das equipes do usuário
     * @param idUser id do usuário logado
     */

    public carregarDataTable() {
        this.grupoService.all().subscribe((res: ResponseWrapper) => {
            this.datatable.value = res.json;
        });
    }

    clonarTooltip() {
        if (!this.analiseSelecionada.idAnalise) {
            return this.getLabel('Analise.Analise.Mensagens.msgRegistroClonar');
        }
        return this.getLabel('Analise.Analise.Clonar');
    }
    compartilharTooltip() {
        if (!this.analiseSelecionada.idAnalise) {
            return this.getLabel('Analise.Analise.Mensagens.msgResgistroCompartilhar');
        }
        return this.getLabel('Analise.Analise.CompartilharAnalise');
    }

    relatorioTooltip() {
        if (!this.analiseSelecionada.idAnalise) {
            return this.getLabel('Analise.Analise.Mensagens.msgRegistroGerarRelatorio');
        }
        return this.getLabel('Analise.Analise.RelatorioDetalhado');
    }

    relatorioExcelTooltip() {
        if (!this.analiseSelecionada.idAnalise) {
            return this.getLabel('Analise.Analise.Mensagens.msgRegistroGerarRelatorio');
        }
        return this.getLabel('Analise.Analise.RelatorioExcel');
    }

    relatorioContagemTooltip() {
        if (!this.analiseSelecionada.idAnalise) {
            return this.getLabel('Analise.Analise.Mensagens.msgRegistroGerarRelatorio');
        }
        return this.getLabel('Analise.Analise.RelatorioFundamentacao');
    }

    recuperarOrganizacoes() {
        this.organizacaoService.query().subscribe(response => {
            this.organizations = response.json;
            let emptyOrg = new Organizacao();
            this.organizations.unshift(emptyOrg);
        });
    }

    recuperarSistema() {
        this.sistemaService.query().subscribe(response => {
            this.nomeSistemas = response.json;
            let emptySystem = new Sistema();
            this.nomeSistemas.unshift(emptySystem);
        });
    }

    recuperarEquipe() {
        this.tipoEquipeService.query().subscribe(response => {
            this.teams = response.json;
            let emptyTeam = new TipoEquipe();
            this.teams.unshift(emptyTeam);
        });
    }

    ngAfterViewInit() {
        this.recarregarDataTable();
        this.cdref.detectChanges();
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
                if (event.selection.bloqueado) {
                    this.pageNotificationService.addErrorMsg(
                        this.getLabel('Analise.Analise.Mensagens.msgEDITAR_ANALISE_BLOQUEADA'));
                    return;
                }
                this.router.navigate(['/analise', event.selection.idAnalise, 'edit']);
                break;
            case 'view':
                this.router.navigate(['/analise', event.selection.idAnalise, 'view']);
                break;
            case 'delete':
                this.confirmDelete(event.selection);
                break;
            case 'relatorioBrowser':
                this.geraRelatorioPdfBrowser(event.selection);
                break;
            case 'relatorioArquivo':
                this.gerarRelatorioPdfArquivo(event.selection);
                break;
            case 'relatorioBrowserDetalhado':
                this.geraRelatorioPdfDetalhadoBrowser(event.selection);
                break;
            case 'relatorioExcelDetalhado':
                this.gerarRelatorioExcel(event.selection);
                break;
            case 'clone':
                this.clonar(event.selection.idAnalise);
                break;
            case 'geraBaselinePdfBrowser':
                this.geraBaselinePdfBrowser();
                break;
            case 'compartilhar':
                if (this.checkUserAnaliseEquipes()) {
                    this.openCompartilharDialog();
                } else {
                    this.pageNotificationService.addErrorMsg(this.getLabel('Analise.Analise.Mensagens.msgSomenteEquipeCompartilharAnalise'));
                }
                break;
            case 'relatorioAnaliseContagem':
                this.gerarRelatorioContagem(event.selection);
                break;
        }
    }
    checkUserAnaliseEquipes() {
        let retorno: boolean = false;
        return this.analiseService.find(this.analiseSelecionada.idAnalise).subscribe((res: any) => {
            this.analiseTemp = res;
            if (this.loggedUser.tipoEquipes) {
                this.loggedUser.tipoEquipes.forEach(equipe => {
                    if (equipe.id === this.analiseTemp.equipeResponsavel.id) {
                        retorno = true;
                    }
                });
            }
            return retorno;
        });

    }

    /**
     * Checa se o usuário tem permissão para editar a Análise!
     */
    checkIfUserCanEdit() {
        let retorno: boolean = false;
        if (this.loggedUser.tipoEquipes) {
            this.loggedUser.tipoEquipes.forEach(equipe => {
                if (this.analiseSelecionada.compartilhadas) {
                    this.analiseSelecionada.compartilhadas.forEach(compartilhada => {
                        if (equipe.id === compartilhada.equipeId) {
                            if (!compartilhada.viewOnly) {
                                retorno = true;
                            }
                        }
                    });
                }
            });
        }
        return retorno;
    }

    public onRowDblclick(event) {

        if (event.target.nodeName === 'TD') {
            this.abrirEditar();
        } else if (event.target.parentNode.nodeName === 'TD') {
            this.abrirEditar();
        }
    }

    abrirEditar() {
        this.router.navigate(['/analise', this.analiseSelecionada.idAnalise, 'edit']);
    }

    /**
     * Clonar análise
     */
    public clonar(idAnalise: number) {
        this.confirmationService.confirm({
            message: this.getLabel('Analise.Analise.Mensagens.msgCONFIRMAR_CLONE').concat(this.analiseSelecionada.identificadorAnalise).concat('?'),
            accept: () => {
                this.analiseService.find(idAnalise).subscribe((res: any) => {
                    let analiseClonada = res.clone();

                    analiseClonada.id = undefined;
                    analiseClonada.identificadorAnalise += this.getLabel('Analise.Analise.Mensagens.msgCONCAT_COPIA');
                    analiseClonada.bloqueiaAnalise = false;
                    analiseClonada.compartilhadas = undefined;

                    if (analiseClonada.funcaoDados) {
                        analiseClonada.funcaoDados.forEach(FuncaoDados => {
                            FuncaoDados.id = undefined;
                            if (FuncaoDados.ders) {
                                FuncaoDados.ders.forEach(Ders => {
                                    Ders.id = undefined;
                                });
                            }
                            if (FuncaoDados.rlrs) {
                                FuncaoDados.rlrs.forEach(rlrs => {
                                    rlrs.id = undefined;
                                });
                            }
                        });
                    }

                    if (analiseClonada.funcaoTransacaos) {
                        analiseClonada.funcaoTransacaos.forEach(funcaoTransacaos => {
                            funcaoTransacaos.id = undefined;
                            if (funcaoTransacaos.ders) {
                                funcaoTransacaos.ders.forEach(ders => {
                                    ders.id = undefined;
                                });
                            }
                            if (funcaoTransacaos.alrs) {
                                funcaoTransacaos.alrs.forEach(alrs => {
                                    alrs.id = undefined;
                                });
                            }
                        });
                    }

                    this.analiseService.create(analiseClonada).subscribe((res: any) => {
                        const menssagem: string = this.getLabel('Analise.Analise.Analise').concat(' ').
                            concat(this.analiseSelecionada.identificadorAnalise).
                            concat(this.getLabel('Analise.Analise.Mensagens.msgCLONAGEM_SUCESSO'));

                        this.pageNotificationService.addSuccessMsg(menssagem);
                        this.recarregarDataTable();
                        this.router.navigate(['/analise', res.id, 'edit']);
                    });
                });
            }
        });

    }

    /**
     * Confirmar deleção de uma análise
     */
    public confirmDelete(analise: Grupo) {
        if (this.analiseSelecionada.bloqueado) {
            this.pageNotificationService.addErrorMsg(this.getLabel('Analise.Analise.Mensagens.msgERRO_EXCLUSAO_ANALISE_BLOQUEADA'));
            return;
        }

        this.confirmationService.confirm({
            message: this.getLabel('Analise.Analise.Mensagens.msgCertezaExcluirRegistro').concat(analise.identificadorAnalise).concat('?'),
            accept: () => {
                this.blockUI.start(this.getLabel('Global.Mensagens.EXCLUINDO_REGISTRO'));
                this.analiseService.delete(analise.idAnalise).subscribe(() => {
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
        this.searchGroup.organizacao = undefined;
        this.searchGroup.identificadorAnalise = undefined;
        this.searchGroup.sistema = undefined;
        this.searchGroup.metodoContagem = undefined;
        this.searchGroup.equipe = undefined;
        this.userAnaliseUrl = this.changeUrl();
        this.recarregarDataTable();
    }

    /**
     * Recarrega a tabela de análise
     */
    public recarregarDataTable() {
        this.datatable.url = this.userAnaliseUrl;
        this.datatable.reset();
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
    public geraRelatorioPdfDetalhadoBrowser(analise: Grupo) {
        this.analiseService.geraRelatorioPdfDetalhadoBrowser(analise.idAnalise);
    }

    /**
     * Método responsável por gerar o relatório da analise em excel.
     * @param analise
     */
    public gerarRelatorioExcel(analise: Grupo) {
        this.analiseService.gerarRelatorioExcel(analise.idAnalise);
    }

    /**
    * Método responsável por gerar o relatório da baseline.
    * @param analise
    */
    public geraBaselinePdfBrowser() {
        this.analiseService.geraBaselinePdfBrowser();
    }

    /**
     * método responsável por gerar o relatório de Fundamentação de Contagem.
     * @param analise
     */
    public gerarRelatorioContagem(analise: Grupo) {
        this.analiseService.gerarRelatorioContagem(analise.idAnalise);
    }

    public changeUrl() {

        let querySearch = '?identificador=';
        querySearch = querySearch.concat((this.searchGroup.identificadorAnalise) ? this.searchGroup.identificadorAnalise + '&' : '&');
        querySearch = querySearch.concat((this.searchGroup.sistema && this.searchGroup.sistema.nome) ? 'sistema=' + this.searchGroup.sistema.nome + '&' : '');
        querySearch = querySearch.concat((this.searchGroup.metodoContagem) ? 'metodo=' + this.searchGroup.metodoContagem + '&' : '');
        querySearch = querySearch.concat((this.searchGroup.organizacao && this.searchGroup.organizacao.nome) ? 'organizacao=' + this.searchGroup.organizacao.nome + '&' : '');
        querySearch = querySearch.concat((this.searchGroup.equipe && this.searchGroup.equipe.nome) ? 'equipe=' + this.searchGroup.equipe.nome : '');
        querySearch = (querySearch === '?') ? '' : querySearch;
        querySearch = (querySearch.endsWith('&')) ? querySearch.slice(0, -1) : querySearch;

        this.recuperarQuery(this.searchGroup);
        return this.grupoService.grupoUrl + querySearch;
    }

    recuperarQuery(searchGroup: SearchGroup){
        this.query = '';

        this.query = this.query.concat((this.searchGroup.identificadorAnalise) ? 'identificadorAnalise:*'+ this.searchGroup.identificadorAnalise + '*' : '');
        
        if(this.searchGroup.sistema && this.searchGroup.sistema.nome !== undefined && this.query == ''){
            this.query = this.query + 'sistema.nome:*' + this.searchGroup.sistema.nome + '*';
        } else if(this.searchGroup.sistema && this.searchGroup.sistema.nome !== undefined && this.query != ''){
            this.query = this.query + ' AND sistema.nome:*' + this.searchGroup.sistema.nome + '*';
        }

        if(this.searchGroup.metodoContagem !== undefined && this.query == ''){
            this.query = 'metodoContagem:*' + this.searchGroup.metodoContagem + '*';
        } else if(this.searchGroup.metodoContagem !== undefined && this.query != ''){
            this.query = this.query + ' AND metodoContagem:*' + this.searchGroup.metodoContagem + '*';
        }

        if(this.searchGroup.organizacao && this.searchGroup.organizacao.nome !== undefined && this.query == ''){
            this.query = 'organizacao.nome:*' + this.searchGroup.organizacao.nome + '*';
        } else if (this.searchGroup.organizacao && this.searchGroup.organizacao.nome !== undefined && this.query != ''){
            this.query = this.query + ' AND organizacao.nome:*' + this.searchGroup.organizacao.nome + '*';
        }

        if(this.searchGroup.equipe && this.searchGroup.equipe.nome !== undefined && this.query == ''){
            this.query = 'equipeResponsavel.nome:*' + this.searchGroup.equipe.nome + '*';
        } else if (this.searchGroup.equipe && this.searchGroup.equipe.nome !== undefined && this.query != ''){
            this.query = this.query + ' AND equipeResponsavel.nome:*' + this.searchGroup.equipe.nome + '*';
        }

    }

    public performSearch() {
        this.userAnaliseUrl = this.changeUrl();
        this.recarregarDataTable();
    }

    /**
     * Desabilita botão relatório
     */
    public desabilitarBotaoRelatorio(): boolean {
        return !this.analiseSelecionada;
    }

    /**
     * Bloquear Análise
     */
    public bloqueiaAnalise(bloquear: boolean) {
        //var _this = this;

        this.analiseService.find(this.analiseSelecionada.idAnalise).subscribe((res: any) => {
            this.analiseTemp = res;
        });

        setTimeout( () => {
            if (!this.analiseTemp.dataHomologacao) {
                this.pageNotificationService.addInfoMsg(this.getLabel('Analise.Analise.Mensagens.msgINFORME_DATA_HOMOLOGACAO'));
            } else {
                if (this.checkUserAnaliseEquipes()) {
                    this.confirmationService.confirm({
                        message: this.mensagemDialogBloquear(bloquear),
                        accept: () => {
                            const copy = this.analiseTemp.toJSONState();
                            this.analiseService.block(copy).subscribe(() => {
                                const nome = this.analiseTemp.identificadorAnalise;
                                const bloqueado = this.analiseTemp.bloqueiaAnalise;
                                this.mensagemAnaliseBloqueada(bloqueado, nome);
                                this.recarregarDataTable();
                            });
                        }
                    });
                } else {
                    this.pageNotificationService.addErrorMsg(this.getLabel('Analise.Analise.Mensagens.msgSomenteEquipeBloquearAnalise'));
                }
            }
        }, 1000);

    }

    private mensagemDialogBloquear(retorno: boolean) {
        if (retorno) {
            return this.getLabel('Analise.Analise.Mensagens.msgCONFIRMAR_DESBLOQUEIO').concat('?');
        } else {
            return this.getLabel('Analise.Analise.Mensagens.msgCONFIRMAR_BLOQUEIO').concat('?');
        }
    }

    private mensagemAnaliseBloqueada(retorno: boolean, nome: string) {
        if (retorno) {
            this.pageNotificationService.addUnblockMsgWithName(nome);
        } else {
            this.pageNotificationService.addBlockMsgWithName(nome);
        }
    }


    public openCompartilharDialog() {
        this.equipeShare = [];
        this.analiseService.find(this.analiseSelecionada.idAnalise).subscribe((res: any) => {
            this.analiseTemp = res;
            this.tipoEquipeService.findAllCompartilhaveis(this.analiseTemp.organizacao.id, this.analiseSelecionada.idAnalise, this.analiseTemp.equipeResponsavel.id).subscribe((equipes) => {
                if (equipes.json) {
                    equipes.json.forEach((equipe) => {
                        const entity: AnaliseShareEquipe = Object.assign(new AnaliseShareEquipe(),
                            {
                                id: undefined,
                                equipeId: equipe.id,
                                analiseId: this.analiseSelecionada.idAnalise,
                                viewOnly: false, nomeEquipe: equipe.nome
                            });
                        this.equipeShare.push(entity);
                    });
                }
                this.blockUI.stop();
            });
        });

        this.analiseService.findAllCompartilhadaByAnalise(this.analiseSelecionada.idAnalise).subscribe((shared) => {
            this.analiseShared = shared.json;
        });
        this.mostrarDialog = true;
    }

    public salvarCompartilhar() {
        if (this.selectedEquipes && this.selectedEquipes.length !== 0) {
            this.analiseService.salvarCompartilhar(this.selectedEquipes).subscribe((res) => {
                this.mostrarDialog = false;
                this.pageNotificationService.addSuccessMsg(this.getLabel('Analise.Analise.Mensagens.msgAnaliseCompartilhadaSucesso'));
                this.limparSelecaoCompartilhar();
            });
        } else {
            this.pageNotificationService.addInfoMsg(this.getLabel('Analise.Analise.Mensagens.msgSelecioneRegistroAdicionarCliqueSair'));
        }
    }

    public deletarCompartilhar() {
        if (this.selectedToDelete && this.selectedToDelete !== null) {
            this.analiseService.deletarCompartilhar(this.selectedToDelete.id).subscribe((res) => {
                this.mostrarDialog = false;
                this.pageNotificationService.addSuccessMsg(this.getLabel('Analise.Analise.Mensagens.msgCompartilhamentoRemovidoSucesso'));
                this.limparSelecaoCompartilhar();
            });
        } else {
            this.pageNotificationService.addInfoMsg(this.getLabel('Analise.Analise.Mensagens.msgSelecioneRegistroRemoverCliqueSair'));
        }
    }

    public limparSelecaoCompartilhar() {
        this.recarregarDataTable();
        this.selectedEquipes = undefined;
        this.selectedToDelete = undefined;
    }

    public updateViewOnly() {
        setTimeout(() => {
            this.analiseService.atualizarCompartilhar(this.selectedToDelete).subscribe((res) => {
                this.pageNotificationService.addSuccessMsg(this.getLabel('Analise.Analise.Mensagens.msgRegistroAtualizadoSucesso'));
            });
        }, 250);
    }
}
