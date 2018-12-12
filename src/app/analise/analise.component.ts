import { Manual } from './../manual/manual.model';
import { Sistema, SistemaService } from './../sistema';
import { TipoEquipe, TipoEquipeService } from './../tipo-equipe';
import { Organizacao, OrganizacaoService } from './../organizacao';
import { User, UserService } from '../user';
import { StringConcatService } from './../shared/string-concat.service';
import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, SelectItem } from 'primeng/primeng';
import {Analise, AnaliseService, MetodoContagem, AnaliseShareEquipe, GrupoService} from './';
import { DatatableComponent, DatatableClickEvent } from '@basis/angular-components';
import {ElasticQuery, PageNotificationService, ResponseWrapper} from '../shared';
import { MessageUtil } from '../util/message.util';
import { Response } from '@angular/http';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Grupo, SearchGroup } from './grupo/grupo.model';

@Component({
    selector: 'jhi-analise',
    templateUrl: './analise.component.html'
})
export class AnaliseComponent implements OnInit, AfterViewInit {

    @ViewChild(DatatableComponent) datatable: DatatableComponent;
    @BlockUI() blockUI: NgBlockUI;

    searchUrl: string = this.grupoService.grupoUrl;

    userAnaliseUrl: string  = this.searchUrl;

    rowsPerPageOptions: number[] = [5, 10, 20, 50, 100];

    analiseSelecionada: any = new Grupo();
    analiseReadyToClone: Analise;
    searchGroup: SearchGroup = new SearchGroup();
    nomeSistemas: Array<Sistema>;
    organizations: Array<Organizacao>;
    teams: Array<TipoEquipe>;
    equipeShare; analiseShared: Array<AnaliseShareEquipe> = [];
    selectedEquipes: Array<AnaliseShareEquipe>;
    selectedToDelete: AnaliseShareEquipe;
    loggedUser: User;

      metsContagens = [
        { label: '', value: ''},
        { label: 'DETALHADA', value: 'DETALHADA'},
        { label: 'INDICATIVA', value: 'INDICATIVA'},
        { label: 'ESTIMADA', value: 'ESTIMADA'}
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
        private stringConcatService: StringConcatService,
        private userService: UserService,
        private grupoService: GrupoService
    ) {}

    public ngOnInit() {
        this.userAnaliseUrl = this.changeUrl();
        this.estadoInicial();
    }

    estadoInicial() {
        this.getLoggedUser();
        this.recuperarAnalisesUsuario();            // Filtrando as análises que o usuário pode ver
        this.recuperarOrganizacoes();
        this.recuperarEquipe();
        this.recuperarSistema();
        this.inicial=false;

        this.datatable.pDatatableComponent.onRowSelect.subscribe((event) => {
            this.analiseReadyToClone = new Analise().copyFromJSON(event.data);
            this.analiseSelecionada = event.data;
            this.blocked = event.data.bloqueiaAnalise;
            this.inicial = true;
        });
        this.datatable.pDatatableComponent.onRowUnselect.subscribe((event) => {
            this.analiseSelecionada = undefined;
            this.analiseReadyToClone = undefined;
        });
    }
    /**
     * Função para recuperar os dados do usuário logado no momento
     */
    getLoggedUser() {
        this.userService.findCurrentUser().subscribe(res =>{
            this.loggedUser = res;
        });
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
        if (!this.analiseSelecionada.id){
            return "Selecione um registro para clonar";
        }
        return "Clonar";
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
                if(!this.checkIfUserCanEdit() && !this.checkUserAnaliseEquipes()){
                    this.pageNotificationService.addErrorMsg("Você não tem permissão para editar esta análise!")
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
            case 'compartilhar':
                if(this.checkUserAnaliseEquipes()){
                    this.openCompartilharDialog();
                } else {
                    this.pageNotificationService.addErrorMsg("Somente membros da equipe responsável podem compartilhar esta análise!");
                }
                break;
        }
    }
    checkUserAnaliseEquipes(){
        let retorno: boolean = false;
        this.loggedUser.tipoEquipes.forEach(equipe => {
            if (equipe.id === this.analiseSelecionada.equipeResponsavel.id){
                retorno = true;
            }
        });
        return retorno;
    }
    
    /**
     * Checa se o usuário tem permissão para editar a Análise!
     */
    checkIfUserCanEdit(){
        let retorno: boolean = false;
        this.loggedUser.tipoEquipes.forEach(equipe => {
            this.analiseSelecionada.compartilhadas.forEach(compartilhada => {
                if(equipe.id === compartilhada.equipeId){
                    if(!compartilhada.viewOnly){
                        retorno = true;
                    }
                }
            });
        });
        return retorno;
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
                analiseClonada.compartilhadas = undefined;

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
        if (this.analiseSelecionada.compartilhadas.length > 0){
            this.pageNotificationService.addErrorMsg("Você não pode excluir uma análise compartilhada com outras equipes!");
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

    public changeUrl(){

        let querySearch = '?identificador=';
        querySearch = querySearch.concat((this.searchGroup.identificadorAnalise) ? this.searchGroup.identificadorAnalise + '&' : '&' );
        querySearch = querySearch.concat((this.searchGroup.sistema && this.searchGroup.sistema.nome) ? 'sistema=' + this.searchGroup.sistema.nome + '&' : '' );
        querySearch = querySearch.concat((this.searchGroup.metodoContagem) ? 'metodo=' + this.searchGroup.metodoContagem + '&' : '' );
        querySearch = querySearch.concat((this.searchGroup.organizacao && this.searchGroup.organizacao.nome) ? 'organizacao=' + this.searchGroup.organizacao.nome + '&' : '' );
        querySearch = querySearch.concat((this.searchGroup.equipe && this.searchGroup.equipe.nome) ? 'equipe=' + this.searchGroup.equipe.nome : '' );
        querySearch = (querySearch === '?') ? '' : querySearch;
        querySearch = (querySearch.endsWith('&')) ? querySearch.slice(0, -1) : querySearch;;

        return this.grupoService.grupoUrl + querySearch;
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
    public bloqueiaRelatorio() {
        if(this.checkUserAnaliseEquipes()){
            this.confirmationService.confirm({
                message: MessageUtil.CONFIRMAR_DESBLOQUEIO.concat('?'),
                accept: () => {
                    const copy = this.analiseSelecionada.toJSONState();
                    copy.bloqueiaAnalise = true;
                    this.analiseService.block(copy).subscribe(() => {
                        this.estadoInicial();
                        const nome = this.analiseSelecionada.name;
                        this.blocked = false;
                        this.pageNotificationService.addBlockMsgWithName(nome);
                    });
                }
            });
        } else {
            this.pageNotificationService.addErrorMsg("Somente membros da equipe responsável podem bloquear esta análise!");
        }
    }

    /**
     * Desbloquear Análise
     */
    public desbloqueiaRelatorio() {
        if(this.checkUserAnaliseEquipes()){
            this.confirmationService.confirm({
                message: MessageUtil.CONFIRMAR_DESBLOQUEIO.concat('?'),
                accept: () => {
                    const copy = this.analiseSelecionada.toJSONState();
                    copy.bloqueiaAnalise = false;
                    this.analiseService.unblock(copy).subscribe(() => {
                        this.estadoInicial();
                        const nome = copy.name;
                        this.blocked = true;
                        this.pageNotificationService.addUnblockMsgWithName(nome);
                    }, (error: Response) => {
                        switch (error.status) {
                            case 400: {
                                if (error.headers.toJSON()['x-abacoapp-error'][0] === 'error.notadmin') {
                                    this.pageNotificationService.addErrorMsg('Somente administradores podem bloquear/desbloquear análises!');
                                }
                            }
                        }
                    });
                }
            });
        } else {
            this.pageNotificationService.addErrorMsg("Somente membros da equipe responsável podem desbloquear esta análise!");
        }
    }

    public openCompartilharDialog() {
        this.equipeShare = [];
        this.tipoEquipeService
            .findAllCompartilhaveis(this.analiseSelecionada.organizacao.id,
                                    this.analiseSelecionada.id,
                                    this.analiseSelecionada.equipeResponsavel.id)
                .subscribe((equipes) => {
            equipes.json.forEach((equipe) => {
                const entity: AnaliseShareEquipe = Object.assign(new AnaliseShareEquipe(),
                                                                    {id: undefined,
                                                                     equipeId: equipe.id,
                                                                     analiseId: this.analiseSelecionada.id,
                                                                     viewOnly: false, nomeEquipe: equipe.nome });
                this.equipeShare.push(entity);
            });
            this.blockUI.stop();
        });

        this.analiseService.findAllCompartilhadaByAnalise(this.analiseSelecionada.id).subscribe((shared) => {
            this.analiseShared = shared.json;
        });
        this.mostrarDialog = true;
    }

    public salvarCompartilhar() {
        if (this.selectedEquipes && this.selectedEquipes.length !== 0) {
            this.analiseService.salvarCompartilhar(this.selectedEquipes).subscribe((res) => {
                this.mostrarDialog = false;
                this.pageNotificationService.addSuccessMsg('Análise compartilhada com sucesso!');
                this.limparSelecaoCompartilhar();
            });
        } else {
            this.pageNotificationService.addInfoMsg('Selecione pelo menos um registro para poder adicionar ou clique no X para sair!');
        }
    }

    public deletarCompartilhar() {
        if (this.selectedToDelete && this.selectedToDelete !== null) {
            this.analiseService.deletarCompartilhar(this.selectedToDelete.id).subscribe((res) => {
                this.mostrarDialog = false;
                this.pageNotificationService.addSuccessMsg('Compartilhamento removido com sucesso!');
                this.limparSelecaoCompartilhar();
            });
        } else {
            this.pageNotificationService.addInfoMsg('Selecione pelo menos um registro para poder remover ou clique no X para sair!');
        }
    }

    public limparSelecaoCompartilhar() {
        this.recarregarDataTable();
        this.selectedEquipes = undefined;
        this.selectedToDelete = undefined;
    }

    public updateViewOnly() {
       setTimeout(() => { this.analiseService.atualizarCompartilhar(this.selectedToDelete).subscribe((res) => {
           this.pageNotificationService.addSuccessMsg('Registro atualizado com sucesso!');
       }); }, 250);
    }
}
