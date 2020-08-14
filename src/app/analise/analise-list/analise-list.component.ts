import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableClickEvent, DatatableComponent, PageNotificationService } from '@nuvem/primeng-components';
import { ConfirmationService, LazyLoadEvent } from 'primeng';
import { Subscription } from 'rxjs';
import { Organizacao, OrganizacaoService } from 'src/app/organizacao';
import { Sistema, SistemaService } from 'src/app/sistema';
import { TipoEquipe, TipoEquipeService } from 'src/app/tipo-equipe';
import { User, UserService } from 'src/app/user';
import { AnaliseShareEquipe } from '../analise-share-equipe.model';
import { Analise } from '../analise.model';
import { AnaliseService } from '../analise.service';
import { SearchGroup } from '../grupo/grupo.model';
import { GrupoService } from '../grupo/grupo.service';

@Component({
    selector: 'app-analise',
    templateUrl: './analise-list.component.html',
    providers: [GrupoService, ConfirmationService]
})
export class AnaliseListComponent implements OnInit {

    @ViewChild(DatatableComponent) datatable: DatatableComponent ;

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

    idAnaliseCloneToEquipe: number;
    public equipeToClone?: TipoEquipe;

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
    mostrarDialog = false;
    enableTable: Boolean = false;
    notLoadFilterTable = false;
    analisesList: any[] = [];

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
        this.searchGroup = this.loadingGroupSearch();
        this.customOptions['metodoContagem'] = this.metsContagens;
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
        this.grupoService.all().subscribe((res) => {
            this.datatable.value = res.json;
        });
    }

    clonarTooltip() {
        if (!this.analiseSelecionada.id) {
            return this.getLabel('Selecione um registro para clonar');
        }
        return this.getLabel('Clonar');
    }
    clonarParaEquipeTooltip() {
        if (!this.analiseSelecionada.id) {
            return this.getLabel('Selecione um registro para clonar');
        }
        return this.getLabel('Clonar Para Equipe');
    }

    compartilharTooltip() {
        if (!this.analiseSelecionada.id) {
            return this.getLabel('Selecione um registro para compartilhar');
        }
        return this.getLabel('Compartilhar Analise');
    }

    relatorioTooltip() {
        if (!this.analiseSelecionada.id) {
            return this.getLabel('Selecione um registro para gerar o relatório');
        }
        return this.getLabel('Relatório Detalhado');
    }

    relatorioExcelTooltip() {
        if (!this.analiseSelecionada.id) {
            return this.getLabel('Selecione um registro para gerar o relatório');
        }
        return this.getLabel(' Relatório Excel');
    }

    relatorioContagemTooltip() {
        if (!this.analiseSelecionada.id) {
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
            this.customOptions['users'] = response.map((item) => {
                return {label: item.firstName + ' ' + item.lastName , value: item.id};
              });
        });
    }

    recuperarEquipe() {
        this.tipoEquipeService.dropDown().subscribe(response => {
            this.tipoEquipesToClone = response;
            const emptyTeam = new TipoEquipe();
            this.tipoEquipesToClone.unshift(emptyTeam);
            this.tipoEquipeService.dropDownByUser().subscribe(res => {
                this.teams = res;
                this.customOptions['equipeResponsavel.nome'] = res.map((item) => {
                    return {label: item.nome, value: item.id};
                  });
            });
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
                if (this.checkUserAnaliseEquipes()) {
                    this.openCompartilharDialog();
                } else {
                    this.pageNotificationService.addErrorMessage(
                        this.getLabel('Somente membros da equipe responsável podem compartilhar esta análise!')
                    );
                }
                break;
            case 'relatorioAnaliseContagem':
                this.gerarRelatorioContagem(event.selection);
                break;
        }
    }

    checkUserAnaliseEquipes() {
        let retorno = false;
        return this.analiseService.findWithFuncaos(this.analiseSelecionada.id).subscribe((res: any) => {
            const jsonResponse = res[0].json();
            jsonResponse['funcaoDados'] = res[1];
            jsonResponse['funcaoTransacaos'] = res[2];
            this.analiseTemp = this.analiseService.convertItemFromServer(jsonResponse);
            this.analiseTemp.createdBy = jsonResponse.createdBy;
            if (this.tipoEquipesLoggedUser) {
                this.tipoEquipesLoggedUser.forEach(equipe => {
                    if (equipe.id === this.analiseTemp.equipeResponsavel.id) {
                        retorno = true;
                    }
                });
            }
            return retorno;
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
        this.userAnaliseUrl = this.grupoService.grupoUrl + this.changeUrl();
        this.enableTable = false;
        this.recarregarDataTable();
    }

    public selectAnalise() {
        if (this.datatable && this.datatable.selectedRow) {
            this.inicial = true;
            this.analiseSelecionada = this.datatable.selectedRow;
            this.blocked = this.datatable.selectedRow.bloqueiaAnalise;
        }
    }

    public recarregarDataTable() {
        if (this.datatable) {
            this.datatable.filterParams = [''];
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
            this.datatable.filter();
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
    }

    public desabilitarBotaoRelatorio(): boolean {
        return !this.analiseSelecionada;
    }

    public bloqueiaAnalise(bloquear: boolean) {
        this.analiseService.find(this.analiseSelecionada.id).subscribe((res) => {
            this.analiseTemp = res;
            if (!this.analiseTemp.dataHomologacao && !bloquear) {
                this.analiseTemp.dataHomologacao  =  new Date();
                this.showDialogAnaliseBlock = true;
            } else {
                if (this.checkUserAnaliseEquipes()) {
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
            // this.pageNotificationService.addUnblockMsgWithName(nome);
        } else {
            // this.pageNotificationService.addBlockMsgWithName(nome);
        }
    }


    public openCompartilharDialog() {
        this.equipeShare = [];
        this.analiseService.findWithFuncaos(this.analiseSelecionada.id).subscribe((res: any) => {
            const jsonResponse = res[0].json();
            jsonResponse['funcaoDados'] = res[1];
            jsonResponse['funcaoTransacaos'] = res[2];
            this.analiseTemp = this.analiseService.convertItemFromServer(jsonResponse);
            this.analiseTemp.createdBy = jsonResponse.createdBy;
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
                });
        });

        this.analiseService.findAllCompartilhadaByAnalise(this.analiseSelecionada.id).subscribe((shared) => {
            this.analiseShared = shared;
        });
        this.mostrarDialog = true;
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
        if (this.selectedToDelete && this.selectedToDelete !== null) {
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
    public setParamsLoad() {
        this.recarregarDataTable();
    }
}
