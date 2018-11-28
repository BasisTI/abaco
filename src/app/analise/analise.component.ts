import {Manual} from './../manual/manual.model';
import {Sistema, SistemaService} from './../sistema';
import {TipoEquipe, TipoEquipeService} from './../tipo-equipe';
import {Organizacao, OrganizacaoService} from './../organizacao';
import {User, UserService} from '../user';
import {StringConcatService} from './../shared/string-concat.service';
import {Component, ViewChild, OnInit, AfterViewInit} from '@angular/core';
import {Router} from '@angular/router';
import {ConfirmationService, SelectItem} from 'primeng/primeng';
import {Analise, AnaliseService, MetodoContagem, AnaliseShareEquipe} from './';
import {DatatableComponent, DatatableClickEvent} from '@basis/angular-components';
import {ElasticQuery, PageNotificationService} from '../shared';
import {MessageUtil} from '../util/message.util';
import {Response} from '@angular/http';
import {BlockUI, NgBlockUI} from 'ng-block-ui';

@Component({
    selector: 'jhi-analise',
    templateUrl: './analise.component.html'
})
export class AnaliseComponent implements OnInit, AfterViewInit {

    @ViewChild(DatatableComponent) datatable: DatatableComponent;
    // @BlockUI() blockUI: NgBlockUI;

    searchUrl: string = this.analiseService.searchUrl;

    userAnaliseUrl: string;

    elasticQuery: ElasticQuery = new ElasticQuery();

    rowsPerPageOptions: number[] = [5, 10, 20, 50, 100];

    analiseSelecionada: any = new Analise;
    analiseReadyToClone: Analise;
    nomeSistemas: Array<Sistema>;
    organizations: Array<Organizacao>;
    teams: Array<TipoEquipe>;
    equipeShare;
    analiseShared: Array<AnaliseShareEquipe> = [];
    selectedEquipes: Array<AnaliseShareEquipe>;
    selectedToDelete: AnaliseShareEquipe;
    loggedUser: User;
    searchParams: any = {
        identidicador: undefined,
        nomeSistema: undefined,
        metContagem: undefined,
        organizacao: undefined,
        team: undefined,
        descricao: undefined
    };

    metsContagens = [
        {value: '', text: ''},
        {value: 'DETALHADA', text: 'DETALHADA'},
        {value: 'INDICATIVA', text: 'INDICATIVA'},
        {value: 'ESTIMADA', text: 'ESTIMADA'}
    ];

    blocked;
    inicial: boolean;
    mostrarDialog = false;

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
    ) {
    }

    public ngOnInit() {
        this.estadoInicial();
    }

    estadoInicial() {
        this.getLoggedUser();
        this.recuperarAnalisesUsuario();            // Filtrando as análises que o usuário pode ver
        this.recuperarOrganizacoes();
        this.recuperarEquipe();
        this.recuperarSistema();
        this.inicial = false;

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
        this.userService.findCurrentUser().subscribe(res => {
            this.loggedUser = res;
        });
    }

    /**
     * Função para recuperar análises da equipe do usuário
     */
    recuperarAnalisesUsuario() {
        // this.blockUI.start('Carregando análises...');
        const userSub = this.userService.findCurrentUser().subscribe(res => {
            this.userId = res.id;                 // Pegando id do usuário logado
            this.userAnaliseUrl = `${this.analiseService.resourceUrl}/user/${this.userId}`;       // Construindo URL para busca de análises
            this.buscarAnalises(this.userId);     // Buscando as benditas análises
        });
    }

    /**
     * Função que faz requisição das análises das equipes do usuário
     * @param idUser id do usuário logado
     */
    buscarAnalises(idUser: number) {
        const analiseSub = this.analiseService.findAnalisesUsuario(this.userId).subscribe(res => {
            this.datatable.pDatatableComponent.value = res;             // Atribuindo valores das análises para a datatable
            this.datatable.pDatatableComponent.dataToRender = res;      // Renderizando valores das análises na datatable
            // this.blockUI.stop();
        }, error => {
            if (error.status === 400) {
                switch (error.headers.toJSON()['x-abacoapp-error'][0]) {
                    case 'userSecurityBreachAtempt': {
                        this.pageNotificationService.addErrorMsg('Você não possui permissão para acessar dados de outro usuário.');
                        break;
                    }
                    case 'userNotFound': {
                        this.pageNotificationService.addErrorMsg('Você não é um usuário cadastrado para este sistema.');
                        break;
                    }
                }
            }
        });
    }

    clonarTooltip() {
        if (!this.analiseSelecionada.id){
            return "Selecione um registro para clonar"
        }

        return "Clonar"
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
            const emptyTeam = new TipoEquipe();
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
                if (!this.checkIfUserCanEdit() && !this.checkUserAnaliseEquipes()) {
                    this.pageNotificationService.addErrorMsg('Você não tem permissão para editar esta análise!');
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
            case 'relatorioBrowserDetalhado' :
                this.geraRelatorioPdfDetalhadoBrowser(event.selection);
                break;
            case 'clone' :
                this.clonar(this.analiseReadyToClone);
                break;
            case 'compartilhar':
                if (this.checkUserAnaliseEquipes()) {
                    this.openCompartilharDialog();
                } else {
                    this.pageNotificationService.addErrorMsg('Somente membros da equipe responsável podem compartilhar esta análise!');
                }
                break;
        }
    }

    checkUserAnaliseEquipes() {
        let retorno: boolean = false;
        if (this.loggedUser.tipoEquipe.id === this.analiseSelecionada.equipeResponsavel.id) {
            retorno = true;
        }
        return retorno;
    }

    /**
     * Checa se o usuário tem permissão para editar a Análise!
     */
    checkIfUserCanEdit() {
        let retorno = false;
        this.analiseSelecionada.compartilhadas.forEach(compartilhada => {
            if (this.loggedUser.tipoEquipe.id === compartilhada.equipeId) {
                if (!compartilhada.viewOnly) {
                    retorno = true;
                }
            }
        });
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
                    const menssagem: string = MessageUtil.ANALISE.concat(' ').concat(this.analiseSelecionada.identificadorAnalise).concat(MessageUtil.CLONAGEM_SUCESSO);

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
        if (this.analiseSelecionada.compartilhadas.length > 0) {
            this.pageNotificationService.addErrorMsg('Você não pode excluir uma análise compartilhada com outras equipes!');
            return;
        }
        this.confirmationService.confirm({
            message: MessageUtil.CONFIRMAR_EXCLUSAO.concat(analise.identificadorAnalise).concat('?'),
            accept: () => {
                // this.blockUI.start(MessageUtil.EXCLUINDO_REGISTRO);
                this.analiseService.delete(analise.id).subscribe(() => {
                    this.recarregarDataTable();
                    // this.blockUI.stop();
                    this.pageNotificationService.addDeleteMsgWithName(analise.identificadorAnalise);
                });
            }
        });
    }

    public switchUrlIdentificador() {
        if (((this.searchParams.identificadorAnalise === undefined) || (this.searchParams.identificadorAnalise === '')) &&
            ((this.searchParams.nomeSistema === undefined) || (this.searchParams.nomeSistema === '')) &&
            ((this.searchParams.metContagem === undefined) || (this.searchParams.metContagem === '')) &&
            ((this.searchParams.organizacao === undefined) || (this.searchParams.organizacao === '')) &&
            ((this.searchParams.team === undefined) || (this.searchParams.team === '')) &&
            ((this.searchParams.descricao === undefined) || (this.searchParams.descricao === ''))) {
            this.searchUrl = this.analiseService.fieldSearchIdentificadorUrl;
        } else {
            this.searchUrl = this.analiseService.searchUrl;
        }
    }

    public switchUrlSistema() {
        if (((this.searchParams.identificadorAnalise === undefined) || (this.searchParams.identificadorAnalise === '')) &&
            ((this.searchParams.nomeSistema === undefined) || (this.searchParams.nomeSistema !== '')) &&
            ((this.searchParams.metContagem === undefined) || (this.searchParams.metContagem === '')) &&
            ((this.searchParams.organizacao === undefined) || (this.searchParams.organizacao === '')) &&
            ((this.searchParams.team === undefined) || (this.searchParams.team === '')) &&
            ((this.searchParams.descricao === undefined) || (this.searchParams.descricao === ''))) {
            this.searchUrl = this.analiseService.fieldSearchSistemaUrl;
        } else {
            this.searchUrl = this.analiseService.searchUrl;
        }
    }

    public switchUrlMetodoContagem() {
        if (((this.searchParams.identificadorAnalise === undefined) || (this.searchParams.identificadorAnalise === '')) &&
            ((this.searchParams.nomeSistema === undefined) || (this.searchParams.nomeSistema === '')) &&
            ((this.searchParams.metContagem === undefined) || (this.searchParams.metContagem !== '')) &&
            ((this.searchParams.organizacao === undefined) || (this.searchParams.organizacao === '')) &&
            ((this.searchParams.team === undefined) || (this.searchParams.team === '')) &&
            ((this.searchParams.descricao === undefined) || (this.searchParams.descricao === ''))) {
            this.searchUrl = this.analiseService.fieldSearchMetodoContagemUrl;
        } else {
            this.searchUrl = this.analiseService.searchUrl;
        }
    }

    public switchUrlOrganizacao() {
        if (((this.searchParams.identificadorAnalise === undefined) || (this.searchParams.identificadorAnalise === '')) &&
            ((this.searchParams.nomeSistema === undefined) || (this.searchParams.nomeSistema === '')) &&
            ((this.searchParams.metContagem === undefined) || (this.searchParams.metContagem === '')) &&
            ((this.searchParams.organizacao === undefined) || (this.searchParams.organizacao !== '')) &&
            ((this.searchParams.team === undefined) || (this.searchParams.team === '')) &&
            ((this.searchParams.descricao === undefined) || (this.searchParams.descricao === ''))) {
            this.searchUrl = this.analiseService.fieldSearchOrganizacaoUrl;
        } else {
            this.searchUrl = this.analiseService.searchUrl;
        }
    }

    public switchUrlEquipe() {
        if (((this.searchParams.identificadorAnalise === undefined) || (this.searchParams.identificadorAnalise === '')) &&
            ((this.searchParams.nomeSistema === undefined) || (this.searchParams.nomeSistema === '')) &&
            ((this.searchParams.metContagem === undefined) || (this.searchParams.metContagem === '')) &&
            ((this.searchParams.organizacao === undefined) || (this.searchParams.organizacao === '')) &&
            ((this.searchParams.team === undefined) || (this.searchParams.team !== '')) &&
            ((this.searchParams.descricao === undefined) || (this.searchParams.descricao === ''))) {
            this.searchUrl = this.analiseService.fieldSearchEquipeUrl;
        } else {
            this.searchUrl = this.analiseService.searchUrl;
        }
    }

    public switchUrlDescricao() {
        if (((this.searchParams.identificadorAnalise === undefined) || (this.searchParams.identificadorAnalise === '')) &&
            ((this.searchParams.nomeSistema === undefined) || (this.searchParams.nomeSistema === '')) &&
            ((this.searchParams.metContagem === undefined) || (this.searchParams.metContagem === '')) &&
            ((this.searchParams.organizacao === undefined) || (this.searchParams.organizacao === '')) &&
            ((this.searchParams.team === undefined) || (this.searchParams.team === '')) &&
            ((this.searchParams.descricao === undefined) || (this.searchParams.descricao === ''))) {
            this.searchUrl = this.analiseService.searchUrl;
        } else {
            this.searchUrl = this.analiseService.searchUrl;
        }
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
        this.searchParams.descricao = undefined;
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
     
    public gerarRelatorioPdfArquivo(analise: Analise) {
        this.analiseService.gerarRelatorioPdfArquivo(analise.id);
    }*/

    /**
     * Método responsável pela a apresentação do relatório no browser.
     * @param analise
     
    public geraRelatorioPdfBrowser(analise: Analise) {
        this.analiseService.geraRelatorioPdfBrowser(analise.id);
    }*/

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
     
    public geraBaselinePdfBrowser() {
        this.analiseService.geraBaselinePdfBrowser();
    }

    private checkUndefinedParams() {
        (this.searchParams.identificador === '') ? (this.searchParams.identificador = undefined) : (this);
        (this.searchParams.nomeSistema !== undefined) ? (
            (this.searchParams.nomeSistema.nome === '') ? (this.searchParams.nomeSistema.nome = undefined) : (this)
        ) : (this);
        (this.searchParams.metContagem !== undefined) ? (
            (this.searchParams.metContagem.text === '') ? (this.searchParams.metContagem.text = undefined) : (this)
        ) : (this);
        (this.searchParams.team !== undefined) ? (
            (this.searchParams.team.nome === '') ? (this.searchParams.team.nome = undefined) : (this)
        ) : (this);
        (this.searchParams.organizacao !== undefined) ? (
            (this.searchParams.organizacao.nome === '') ? (this.searchParams.organizacao.nome = undefined) : (console.log(''))
        ) : (this);
        (this.searchParams.descricao === '') ? (this.searchParams.descricao = undefined) : (this);
    }

    private createStringParamsArray(): Array<string> {
        const stringParamsArray: Array<string> = [];

        (this.searchParams.identificador !== undefined) ? (stringParamsArray.push(this.searchParams.identificador)) : (this);
        (this.searchParams.nomeSistema !== undefined) ? (
            (this.searchParams.nomeSistema.nome !== undefined) ? (stringParamsArray.push(this.searchParams.nomeSistema.nome)) : (this)
        ) : (this);
        (this.searchParams.metContagem !== undefined) ? (
            (this.searchParams.metContagem.text !== undefined) ? (stringParamsArray.push(this.searchParams.metContagem.text)) : (this)
        ) : (this);
        (this.searchParams.team !== undefined) ? (
            (this.searchParams.team.nome !== undefined) ? (stringParamsArray.push(this.searchParams.team.nome)) : (this)
        ) : (this);
        (this.searchParams.organizacao !== undefined) ? (
            (this.searchParams.organizacao.nome !== undefined) ? (stringParamsArray.push(this.searchParams.organizacao.nome)) : (this)
        ) : (this);
        (this.searchParams.descricao !== undefined) ? (stringParamsArray.push(this.searchParams.descricao)) : (this);

        return stringParamsArray;
    }

    public performSearch() {

        this.searchUrl = this.analiseService.searchUrl;
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
     * Bloquear Análise
     */
    public bloqueiaRelatorio() {
        if (this.checkUserAnaliseEquipes()) {
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
            this.pageNotificationService.addErrorMsg('Somente membros da equipe responsável podem bloquear esta análise!');
        }
    }

    /**
     * Desbloquear Análise
     */
    public desbloqueiaRelatorio() {
        if (this.checkUserAnaliseEquipes()) {
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
            this.pageNotificationService.addErrorMsg('Somente membros da equipe responsável podem desbloquear esta análise!');
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
                        {
                            id: undefined,
                            equipeId: equipe.id,
                            analiseId: this.analiseSelecionada.id,
                            viewOnly: false, nomeEquipe: equipe.nome
                        });
                    this.equipeShare.push(entity);
                });
                // this.blockUI.stop();
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
        setTimeout(() => {
            this.analiseService.atualizarCompartilhar(this.selectedToDelete).subscribe((res) => {
                this.pageNotificationService.addSuccessMsg('Registro atualizado com sucesso!');
            });
        }, 250);
    }
}
