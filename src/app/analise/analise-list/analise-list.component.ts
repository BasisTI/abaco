import { Component, OnInit, ViewChild, ContentChildren } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableClickEvent, DatatableComponent, PageNotificationService, Column } from '@nuvem/primeng-components';
import { ConfirmationService, BlockUIModule } from 'primeng';
import { Subscription } from 'rxjs';
import { Organizacao, OrganizacaoService } from 'src/app/organizacao';
import { Sistema, SistemaService } from 'src/app/sistema';
import { TipoEquipe, TipoEquipeService } from 'src/app/tipo-equipe';
import { User, UserService } from 'src/app/user';
import { AnaliseShareEquipe } from '../analise-share-equipe.model';
import { Analise, MetodoContagem } from '../analise.model';
import { AnaliseService } from '../analise.service';
import { SearchGroup } from '../grupo/grupo.model';
import { GrupoService } from '../grupo/grupo.service';
import { BlockUiService } from '@nuvem/angular-base';
import { StatusService } from 'src/app/status';
import { Status } from 'src/app/status/status.model';

@Component({
    selector: 'app-analise',
    templateUrl: './analise-list.component.html',
    providers: [GrupoService, ConfirmationService],
})
export class AnaliseListComponent implements OnInit {

    @ViewChild(DatatableComponent) datatable: DatatableComponent ;

    allColumnsTable = [
        {value: 'organizacao.nome',  label: 'Organização'},
        {value: 'identificadorAnalise',  label: 'Identificador Analise'},
        {value: 'numeroOs',  label: 'Número Os.'},
        {value: 'equipeResponsavel.nome',  label: 'Equipe'},
        {value: 'sistema.nome',  label: 'Sistema'},
        {value: 'status.nome',  label: 'Status'},
        {value: 'metodoContagem',  label: 'Metodo Contagem'},
        {value: 'pfTotal',  label: 'PF total'},
        {value: 'adjustPFTotal',  label: 'PF Ajustado'},
        {value: 'dataCriacaoOrdemServico',  label: 'Data de criação'},
        {value: 'bloqueiaAnalise',  label: 'Bloqueado'},
        {value: 'clonadaParaEquipe',  label: 'Clonada'},
        {value: 'users',  label: 'Usuários'},
    ];

    columnsVisible = [
            'organizacao.nome',
            'identificadorAnalise',
            'numeroOs',
            'equipeResponsavel.nome',
            'status.nome',
            'metodoContagem',
            'pfTotal',
            'adjustPFTotal',
            'PF Ajustado'];
    private lastColumn: any[] = [];

    visible: any;

    searchUrl: string = this.grupoService.grupoUrl;

    userAnaliseUrl: string = this.searchUrl;

    rowsPerPageOptions: number[] = [5, 10, 20, 50, 100];

    customOptions: Object = {};

    analiseSelecionada: any = new Analise();
    analiseTableSelecionada: Analise = new Analise();
    searchGroup: SearchGroup = new SearchGroup();
    nomeSistemas: Array<Sistema>;
    usuariosOptions: User[] = [];
    organizations: Array<Organizacao>;
    teams: TipoEquipe[];
    equipeShare;
    analiseShared: Array<AnaliseShareEquipe> = [];
    selectedEquipes: Array<AnaliseShareEquipe>;
    selectedToDelete: AnaliseShareEquipe;
    analiseTemp: Analise = new Analise();
    tipoEquipesLoggedUser: TipoEquipe[] = [];
    tipoEquipesToClone: TipoEquipe[] = [];
    query: String;
    usuarios: String[] = [];
    lstStatus: Status[] = [];
    lstStatusActive: Status[] = [];
    idAnaliseCloneToEquipe: number;
    idAnaliseChangeStatus: number;
    public equipeToClone?: TipoEquipe;
    public statusToChange?: Status;

    public changeOrderAnalise;

    translateSusbscriptions: Subscription[] = [];

    metsContagens = [
        {label: 'Detalhada', value: 'DETALHADA'},
        {label: 'Indicativa', value: 'INDICATIVA'},
        {label: 'Estimada', value: 'ESTIMADA'}
    ];
    blocked;
    inicial: boolean;
    showDialogAnaliseCloneTipoEquipe = false;
    showDialogAnaliseBlock = false;
    showDialogAnaliseChangeStatus = false;
    showDialogDivergence = false;
    mostrarDialog = false;
    enableTable: Boolean = false;
    notLoadFilterTable = false;
    analisesList: any[] = [];
    isLoadFilter = true;
    firstAnaliseDivergencia = new Analise();
    secondAnaliseDivergencia = new Analise();

    constructor(
        private router: Router,
        private confirmationService: ConfirmationService,
        private sistemaService: SistemaService,
        private analiseService: AnaliseService,
        private tipoEquipeService: TipoEquipeService,
        private organizacaoService: OrganizacaoService,
        private pageNotificationService: PageNotificationService,
        private grupoService: GrupoService,
        private equipeService: TipoEquipeService,
        private usuarioService: UserService,
        private blockUiService: BlockUiService,
        private statusService: StatusService,
    ) {
    }

    public ngOnInit() {
        this.userAnaliseUrl = this.grupoService.grupoUrl + this.changeUrl();
        this.estadoInicial();
    }

    getLabel(label) {
        return label;
    }

    estadoInicial() {
        this.getEquipesFromActiveLoggedUser();
        this.recuperarOrganizacoes();
        this.recuperarEquipe();
        this.recuperarSistema();
        this.recuperarUsuarios();
        this.recuperarStatus();
        this.inicial = false;
    }

    getEquipesFromActiveLoggedUser() {
        this.equipeService.getEquipesActiveLoggedUser().subscribe(res => {
            this.tipoEquipesLoggedUser = res;
        });
    }

    traduzirmetsContagens() {
        // this.translate.stream(['Analise.Analise.metsContagens.DETALHADA', 'Analise.Analise.metsContagens.ESTIMADA',
        //     'Analise.Analise.metsContagens.INDICATIVA']).subscribe((traducao) => {
        //         this.metsContagens = [
        //             {label: traducao['Analise.Analise.metsContagens.DETALHADA'], value: 'DETALHADA'},
        //             {label: traducao['Analise.Analise.metsContagens.ESTIMADA'], value: 'ESTIMADA'},
        //             {label: traducao['Analise.Analise.metsContagens.INDICATIVA'], value: 'INDICATIVA'}
        //         ];
        //     }
        // );
    }

    public carregarDataTable() {
        this.blockUiService.show();
        this.grupoService.all().subscribe((res) => {
            this.datatable.value = res.json;
            this.blockUiService.hide();
        });
    }

    clonarTooltip() {
        if (!(this.datatable && this.datatable.selectedRow) ) {
            return this.getLabel('Selecione um registro para clonar');
        }
        return this.getLabel('Clonar');
    }
    clonarParaEquipeTooltip() {
        if (!(this.datatable && this.datatable.selectedRow)) {
            return this.getLabel('Selecione um registro para clonar');
        }
        return this.getLabel('Clonar para Equipe');
    }

    changeStatusTooltip() {
        if (!(this.datatable && this.datatable.selectedRow)) {
            return this.getLabel('Selecione um registro para alterar o status');
        }
        return this.getLabel('Alterar Status');
    }

    changeDivergenceTooltip() {
        if (!(this.datatable && this.datatable.selectedRow)) {
            return this.getLabel('Selecione uma registro para gerar divergencia.');
        }
        return this.getLabel('Gerar Divergência');
    }

    compartilharTooltip() {
        if (!(this.datatable && this.datatable.selectedRow)) {
            return this.getLabel('Selecione um registro para compartilhar');
        }
        return this.getLabel('Compartilhar Analise');
    }

    relatorioTooltip() {
        if (!(this.datatable && this.datatable.selectedRow)) {
            return this.getLabel('Selecione um registro para gerar o relatório');
        }
        return this.getLabel('Relatório Detalhado');
    }

    relatorioExcelTooltip() {
        if (!(this.datatable && this.datatable.selectedRow)) {
            return this.getLabel('Selecione um registro para gerar o relatório');
        }
        return this.getLabel(' Relatório Excel');
    }

    relatorioContagemTooltip() {
        if (!(this.datatable && this.datatable.selectedRow)) {
            return this.getLabel('Selecione um registro para gerar o relatório');
        }
        return this.getLabel('Relatório de Fundamentação');
    }

    recuperarOrganizacoes() {
        this.organizacaoService.dropDown().subscribe(response => {
            this.organizations = response;
            this.customOptions['organizacao.nome'] = response.map((item) => {
                return {label: item.nome, value: item.id};
              });
        });
    }

    recuperarSistema() {
        this.sistemaService.dropDown().subscribe(response => {
            this.nomeSistemas = response;
            this.customOptions['sistema.nome'] = response.map((item) => {
                return {label: item.nome, value: item.id};
              });
        });
    }

    recuperarUsuarios() {
        this.usuarioService.dropDown().subscribe(response => {
            this.usuariosOptions = this.usuarioService.convertUsersFromServer(response);
        });
    }

    recuperarEquipe() {
        this.tipoEquipeService.dropDown().subscribe(response => {
            this.teams = response;
            this.tipoEquipesToClone = response;
            const emptyTeam = new TipoEquipe();
            this.tipoEquipesToClone.unshift(emptyTeam);
        });
    }

    recuperarStatus() {
        this.statusService.list().subscribe(response => {
            this.lstStatus = response;
            const emptyStatus = new Status();
            this.lstStatus.unshift(emptyStatus);
        });
        this.statusService.listActive().subscribe(response => {
            this.lstStatusActive = response;
        });
    }

    loadingGroupSearch(): SearchGroup {
        const sessionSearchGroup: SearchGroup = JSON.parse(sessionStorage.getItem('searchGroup'));
        if (sessionSearchGroup) {
           return sessionSearchGroup;
        } else {
            return new SearchGroup();
        }
    }

    public datatableClick(event: DatatableClickEvent) {
        if (!event.selection) {
            return;
        } else if (event.selection.length === 1) {
            event.selection = event.selection[0];
        } else if ( event.selection.length > 1 && event.button !== 'generateDivergence') {
            this.pageNotificationService.addErrorMessage('Selecione somente uma Análise para essa ação.');
            return ;
        } else if (event.selection.length > 2) {
            this.pageNotificationService.addErrorMessage('Selecione somente duas Análises para gerar divergência.');
            return ;
        }
        switch (event.button) {
            case 'edit':
                if (event.selection.bloqueiaAnalise) {
                    this.pageNotificationService.addErrorMessage('Você não pode editar uma análise bloqueada!');
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
                this.clonar(event.selection.id);
                break;
            case 'geraBaselinePdfBrowser':
                this.geraBaselinePdfBrowser();
                break;
            case 'cloneParaEquipe':
                this.openModalCloneAnaliseEquipe(event.selection.id);
                break;
            case 'compartilhar':
               this.compartilharAnalise();
                break;
            case 'relatorioAnaliseContagem':
                this.gerarRelatorioContagem(event.selection);
                break;
            case 'changeStatus':
                this.openModalChangeStatus(event.selection.id);
                break;
            case 'generateDivergence':
                if (event.selection.id) {
                    this.confirmDivergenceGenerate(event.selection);
                } else {
                    this.openModalDivergence(event.selection);
                }
                break;
        }
    }

    compartilharAnalise() {
        let canShared = false;
        return this.analiseService.find(this.analiseSelecionada.id).subscribe((res) => {
            this.analiseTemp = new Analise().copyFromJSON(res);
            if (this.tipoEquipesLoggedUser) {
                this.tipoEquipesLoggedUser.forEach(equipe => {
                    if (equipe.id === this.analiseTemp.equipeResponsavel.id) {
                        canShared = true;
                    }
                });
            }
            if (canShared) {
                    this.equipeShare = [];
                        this.tipoEquipeService.findAllCompartilhaveis(
                            this.analiseTemp.organizacao.id,
                            this.analiseSelecionada.id,
                            this.analiseTemp.equipeResponsavel.id)
                            .subscribe((equipes) => {
                                if (equipes) {
                                    equipes.forEach((equipe) => {
                                        const entity: AnaliseShareEquipe = Object.assign(new AnaliseShareEquipe(),
                                            {
                                                id: undefined,
                                                equipeId: equipe.id,
                                                analiseId: this.analiseSelecionada.id,
                                                viewOnly: false, nomeEquipe: equipe.nome
                                            });
                                        this.equipeShare.push(entity);
                                    });
                                }
                                this.mostrarDialog = true;
                            });
            } else {
                this.pageNotificationService.addErrorMessage(
                    this.getLabel('Somente membros da equipe responsável podem compartilhar esta análise!')
                );
            }
        });
    }

    checkIfUserCanEdit() {
        let retorno = false;
        if (this.tipoEquipesLoggedUser) {
            this.tipoEquipesLoggedUser.forEach(equipe => {
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
        this.router.navigate(['/analise', this.analiseSelecionada.id, 'edit']);
    }

    public clonar(id: number) {
        this.confirmationService.confirm({
            message: this.getLabel('Tem certeza que deseja clonar o registro ')
                .concat(this.analiseSelecionada.identificadorAnalise),
            accept: () => {
                this.analiseService.clonarAnalise(id).subscribe(response => {
                    this.router.navigate(['/analise', response.id, 'edit', { clone : true}]);
                });
            }
        });

    }

    public confirmDelete(analise: Analise) {
        if (this.analiseSelecionada.bloqueado) {
            this.pageNotificationService.addErrorMessage(this.getLabel('Você não pode excluir uma análise bloqueada'));
            return;
        }
        const canDelete = this.tipoEquipesLoggedUser.find(
                (tipoEquipeResponsave) =>  tipoEquipeResponsave.id === this.analiseSelecionada.equipeResponsavel['id']
        );
        if (canDelete) {
            this.confirmationService.confirm({
                message: this.getLabel('Tem certeza que deseja excluir o registro ').concat(analise.identificadorAnalise).concat('?'),
                accept: () => {
                    // this.blockUI.start(this.getLabel('Global.Mensagens.EXCLUINDO_REGISTRO'));
                    this.analiseService.delete(analise.id).subscribe(() => {
                        this.recarregarDataTable();
                        this.datatable.filter();
                        this.pageNotificationService.addDeleteMsg(analise.identificadorAnalise);
                    });
                }
            });
        } else {
            this.pageNotificationService.addErrorMessage(
                this.getLabel('Somente membros da equipe responsável podem excluir esta análise!'));
            return;
        }
    }

    public limparPesquisa() {
        this.searchGroup.organizacao = undefined;
        this.searchGroup.identificadorAnalise = undefined;
        this.searchGroup.sistema = undefined;
        this.searchGroup.metodoContagem = undefined;
        this.searchGroup.equipe = undefined;
        this.searchGroup.usuario = undefined;
        this.searchGroup.status = undefined;
        this.userAnaliseUrl = this.grupoService.grupoUrl + this.changeUrl();
        this.enableTable = false;
        this.recarregarDataTable();
        this.datatable.filter();
    }

    public selectAnalise() {
        if (this.datatable && this.datatable.selectedRow) {
            this.inicial = true;
            if (this.datatable.selectedRow && this.datatable.selectedRow[0]) {
                this.analiseSelecionada = this.datatable.selectedRow[0];
            }
            this.blocked = this.datatable.selectedRow.bloqueiaAnalise;
        }
    }

    public recarregarDataTable() {
        if (this.datatable) {
            this.datatable.filterParams = [];
            if (this.searchGroup && this.searchGroup.equipe &&  this.searchGroup.equipe.id) {
                this.datatable.filterParams['equipe'] = this.searchGroup.equipe.id;
            }
            if (this.searchGroup && this.searchGroup.identificadorAnalise) {
                this.datatable.filterParams['identificadorAnalise'] = this.searchGroup.identificadorAnalise;
            }
            if (this.searchGroup &&  this.searchGroup.metodoContagem) {
                this.datatable.filterParams['metodoContagem'] = this.searchGroup.metodoContagem;
            }
            if (this.searchGroup &&  this.searchGroup.organizacao &&  this.searchGroup.organizacao.id) {
                this.datatable.filterParams['organizacao'] = this.searchGroup.organizacao.id;
            }
            if (this.searchGroup && this.searchGroup.sistema && this.searchGroup.sistema.id) {
                this.datatable.filterParams['sistema'] = this.searchGroup.sistema.id;
            }
            if (this.searchGroup && this.searchGroup.usuario && this.searchGroup.usuario.id) {
                this.datatable.filterParams['usuario'] = this.searchGroup.usuario.id;
            }
            if (this.searchGroup && this.searchGroup.status && this.searchGroup.status.id) {
                this.datatable.filterParams['status'] = this.searchGroup.status.id;
            }
        }
    }

    public gerarRelatorioPdfArquivo(analise: Analise) {
        this.analiseService.gerarRelatorioPdfArquivo(analise.id);
    }

    public geraRelatorioPdfBrowser(analise: Analise) {
        this.analiseService.geraRelatorioPdfBrowser(analise.id);
    }

    public geraRelatorioPdfDetalhadoBrowser(analise: Analise) {
        this.analiseService.geraRelatorioPdfDetalhadoBrowser(analise.id);
    }

    public gerarRelatorioExcel(analise: Analise) {
        this.analiseService.gerarRelatorioExcel(analise.id);
    }

    public geraBaselinePdfBrowser() {
        this.analiseService.geraBaselinePdfBrowser();
    }

    public gerarRelatorioContagem(analise: Analise) {
        this.analiseService.gerarRelatorioContagem(analise.id);
    }

    public changeUrl() {

        let querySearch = '';
        querySearch = querySearch.concat((this.searchGroup.identificadorAnalise) ?
            `identificador=*${this.searchGroup.identificadorAnalise}*&` : '');

        querySearch = querySearch.concat((this.searchGroup.sistema && this.searchGroup.sistema.id) ?
            `sistema=${this.searchGroup.sistema.id}&` : '');

        querySearch = querySearch.concat((this.searchGroup.metodoContagem) ? `metodo=${this.searchGroup.metodoContagem}&` : '');

        querySearch = querySearch.concat((this.searchGroup.organizacao && this.searchGroup.organizacao.id) ?
            `organizacao=${this.searchGroup.organizacao.id}&` : '');

        querySearch = querySearch.concat((this.searchGroup.equipe && this.searchGroup.equipe.id) ?
            `equipe=${this.searchGroup.equipe.id}&` : '');

        querySearch = querySearch.concat((this.searchGroup.usuario && this.searchGroup.usuario.id) ?
            `usuario=${this.searchGroup.usuario.id}&` : '');

        querySearch = (querySearch === '') ? '' : '&' + querySearch;

        querySearch = (querySearch.endsWith('&')) ? querySearch.slice(0, -1) : querySearch;
        return querySearch;
    }

    public performSearch() {
        this.enableTable = true ;
        sessionStorage.setItem('searchGroup', JSON.stringify(this.searchGroup));
        this.recarregarDataTable();
        this.datatable.selectedRow = undefined;
        this.datatable.filter();
    }

    public desabilitarBotaoRelatorio(): boolean {
        return !this.datatable;
    }

    public bloqueiaAnalise(bloquear: boolean) {
        this.analiseService.find(this.analiseSelecionada.id).subscribe((res) => {
            this.analiseTemp = new Analise().copyFromJSON(res);
            if (!this.analiseTemp.dataHomologacao && !bloquear) {
                this.analiseTemp.dataHomologacao  =  new Date();
                this.showDialogAnaliseBlock = true;
            } else {
                let canBloqued = false;
                if (this.tipoEquipesLoggedUser) {
                    this.tipoEquipesLoggedUser.forEach(equipe => {
                        if (equipe.id === this.analiseTemp.equipeResponsavel.id) {
                            canBloqued = true;
                        }
                    });
                }
                if (canBloqued) {
                    this.confirmationService.confirm({
                        message: this.mensagemDialogBloquear(bloquear),
                        accept: () => {
                            this.alterAnaliseBlock();
                        }
                    });
                } else {
                    this.pageNotificationService.addErrorMessage(this.getLabel('Somente membros da equipe responsável podem excluir esta análise!'));
                }
            }
        },
        err => {
            this.pageNotificationService.addErrorMessage(
                this.getLabel('Somente membros da equipe responsável podem excluir esta análise!'));
        });
    }

    public alterAnaliseBlock() {
        if (this.analiseTemp && this.analiseTemp.dataHomologacao) {
            const copy = this.analiseTemp.toJSONState();
            this.analiseService.block(copy).subscribe(() => {
                const nome = this.analiseTemp.identificadorAnalise;
                const bloqueado = this.analiseTemp.bloqueiaAnalise;
                this.mensagemAnaliseBloqueada(bloqueado, nome);
                this.recarregarDataTable();
                this.datatable.filter();
            });
        }
    }

    private mensagemDialogBloquear(retorno: boolean) {
        if (retorno) {
            return this.getLabel('Tem certeza que deseja desbloquear o registro ').concat('?');
        } else {
            return this.getLabel('Tem certeza que deseja bloquear o registro ?');
        }
    }

    private mensagemAnaliseBloqueada(retorno: boolean, nome: string) {
        if (retorno) {
            this.pageNotificationService.addSuccessMessage('Registro  desbloqueado com sucesso!');
        } else {
            this.pageNotificationService.addSuccessMessage('Registro bloqueado com sucesso!');
        }
    }

    public salvarCompartilhar() {
        if (this.selectedEquipes && this.selectedEquipes.length !== 0) {
            this.analiseService.salvarCompartilhar(this.selectedEquipes).subscribe((res) => {
                this.mostrarDialog = false;
                this.pageNotificationService.addSuccessMessage(this.getLabel('Análise compartilhada com sucesso!'));
                this.limparSelecaoCompartilhar();
            });
        } else {
            this.pageNotificationService.addInfoMessage(this.getLabel('Selecione pelo menos um registro para poder adicionar ou clique no X para sair!'));
        }
    }

    public deletarCompartilhar() {
        if (this.selectedToDelete && this.selectedToDelete.id > 0) {
            this.analiseService.deletarCompartilhar(this.selectedToDelete.id).subscribe((res) => {
                this.mostrarDialog = false;
                this.pageNotificationService.addSuccessMessage(this.getLabel('Compartilhamento removido com sucesso!'));
                this.limparSelecaoCompartilhar();
            });
        } else {
            this.pageNotificationService.addInfoMessage(this.getLabel('Selecione pelo menos um registro para poder remover ou clique no X para sair!'));
        }
    }

    public limparSelecaoCompartilhar() {
        this.recarregarDataTable();
        this.selectedEquipes = undefined;
        this.selectedToDelete = undefined;
        this.datatable.filter();
    }

    public updateViewOnly() {
        setTimeout(() => {
            this.analiseService.atualizarCompartilhar(this.selectedToDelete).subscribe((res) => {
                this.pageNotificationService.addSuccessMessage(this.getLabel('Registro atualizado com sucesso!'));
            });
        }, 250);
    }

    public openModalCloneAnaliseEquipe(id: number) {
        this.equipeToClone = undefined;
        this.idAnaliseCloneToEquipe = id;
        this.showDialogAnaliseCloneTipoEquipe = true;
    }

    public cloneAnaliseToEquipe() {
        if (this.idAnaliseCloneToEquipe && this.equipeToClone) {
            this.analiseService.clonarAnaliseToEquipe(this.idAnaliseCloneToEquipe, this.equipeToClone).subscribe(value => {
                this.pageNotificationService.addSuccessMessage(this.getLabel('clonada com sucesso!'));
                this.showDialogAnaliseCloneTipoEquipe = false;
                this.equipeToClone = undefined;
                this.idAnaliseCloneToEquipe = undefined;
            });
        }
    }

    public openModalChangeStatus(id: number) {
        this.statusToChange = undefined;
        this.idAnaliseChangeStatus = id;
        this.showDialogAnaliseChangeStatus = true;
    }

    public alterStatusAnalise() {
        if (this.idAnaliseChangeStatus && this.statusToChange) {
            this.analiseService.changeStatusAnalise(this.idAnaliseChangeStatus, this.statusToChange).subscribe(data => {
                this.statusToChange = undefined;
                this.idAnaliseChangeStatus = undefined;
                this.showDialogAnaliseChangeStatus = false;
                this.recarregarDataTable();
                this.datatable.filter();
                this.pageNotificationService.addSuccessMessage('O status da analise ' + data.identificadorAnalise + ' foi alterado.');
            },
            err => this.pageNotificationService.addErrorMessage('Não foi possivel alterar o status da Analise.'));
        } else {
            this.pageNotificationService.addErrorMessage('Selecione uma Analise e um Status para continuar.');

        }
    }

    public setParamsLoad() {
        if (this.isLoadFilter) {
            this.searchGroup = this.loadingGroupSearch();
            this.searchGroup.usuario = null;
            this.recarregarDataTable();
            this.datatable.filter();
            this.isLoadFilter = false;
            this.updateVisibleColumns(this.columnsVisible);
        } else {
            this.recarregarDataTable();
        }
    }
     mostrarColunas(event) {
        if (this.columnsVisible.length) {
            this.lastColumn = event.value;
            this.updateVisibleColumns(this.columnsVisible);
        } else {
            this.lastColumn.map((item) => this.columnsVisible.push(item));
            this.pageNotificationService.addErrorMessage('Não é possível exibir menos de uma coluna');
        }
    }

    updateVisibleColumns(columns) {
        this.allColumnsTable.forEach(col => {
            if (this.visibleColumnCheck(col.value, columns)) {
                this.datatable.visibleColumns[col.value] = 'table-cell';
            } else {
                this.datatable.visibleColumns[col.value] = 'none';
            }
        });
    }

    visibleColumnCheck(column: string, visibleColumns: any[]) {
        return visibleColumns.some((item: any) => {
            return (item) ? item === column : true;
        });
    }
    public openModalDivergence(lstAnalise: Analise[]) {
        this.statusToChange = undefined;
        this.firstAnaliseDivergencia = lstAnalise[0];
        this.secondAnaliseDivergencia = lstAnalise[1];
        if (!this.firstAnaliseDivergencia.sistema &&
             !this.secondAnaliseDivergencia.sistema ||
            this.firstAnaliseDivergencia.sistema.id !== this.secondAnaliseDivergencia.sistema.id) {
                this.pageNotificationService.addErrorMessage('Não é possivel gerar Divergencia dessas análises.');
        } else if (
                    !(this.checkToGenerateDivergence(this.firstAnaliseDivergencia)) &&
                    !(this.checkToGenerateDivergence(this.secondAnaliseDivergencia))
                    ){
            this.showDialogDivergence = false;
        } else {
            this.showDialogDivergence = true;
            this.changeOrderAnalise = false;
        }
    }

    public generateDivergence() {
        if (this.changeOrderAnalise) {
            const auxAnalise =  this.firstAnaliseDivergencia ;
            this.firstAnaliseDivergencia = this.secondAnaliseDivergencia;
            this.secondAnaliseDivergencia = auxAnalise;
        }
        this.blockUiService.show();
        this.analiseService.generateDivergence(this.firstAnaliseDivergencia, this.secondAnaliseDivergencia).subscribe(data => {
            this.showDialogDivergence = false;
            this.recarregarDataTable();
            this.datatable.filter();
            this.pageNotificationService.addSuccessMessage('O status da analise ' + data.identificadorAnalise + ' foi alterado.');
            this.blockUiService.hide();
        },
        err => this.pageNotificationService.addErrorMessage('Não foi possivel gerar a Divergência das Analises.'));
    }
    public confirmDivergenceGenerate(analise: Analise) {
        if (this.checkToGenerateDivergence(analise)) {
            this.confirmationService.confirm({
                message: this.getLabel('Tem certeza que deseja gerar Divergência para o registro ')
                                .concat(analise.identificadorAnalise)
                                .concat('?'),
                accept: () => {
                    this.blockUiService.show();
                    this.analiseService.generateDivergenceFromAnalise(analise.id).subscribe(
                        (analiseResp) => {
                        this.recarregarDataTable();
                        this.datatable.filter();
                        this.pageNotificationService.addSuccessMessage('Divergencia da análise \"' + analise.identificadorAnalise + '\" foi gerada com sucesso!');
                        this.blockUiService.hide();
                    },  err => {
                        this.pageNotificationService.addErrorMessage('Ocorreu um erro ao tentar gerar Divergência.');
                        console.log(err);
                    });
                }
            });
        }
    }
    checkToGenerateDivergence(analise: Analise): boolean {
        const canGenerateDivergence = this.tipoEquipesLoggedUser.find(
            (tipoEquipeResponsave) =>  tipoEquipeResponsave.id === analise.equipeResponsavel['id']
        );
        if (!canGenerateDivergence) {
            this.pageNotificationService.addErrorMessage(
                this.getLabel('Somente membros da equipe responsável podem gerar divergência esta análise!'));
            return false;
        }
        if (!(analise.bloqueiaAnalise) && analise.metodoContagem === MetodoContagem.INDICATIVA) {
            this.pageNotificationService.addErrorMessage(this.getLabel('Você não pode gerar divergência de uma análise que não esteja bloqueada.'));
            return false;
        }
        if (analise.metodoContagem === MetodoContagem.INDICATIVA) {
            this.pageNotificationService.addErrorMessage(this.getLabel('Você não pode gerar divergência uma análise que seja Indicativa.'));
            return false;
        }
        return true;
    }

    cancelGenerateDivergence() {
        this.showDialogDivergence = false;
        this.firstAnaliseDivergencia = new Analise();
        this.firstAnaliseDivergencia = new Analise();
    }
}
