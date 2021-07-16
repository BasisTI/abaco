import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageNotificationService } from '@nuvem/primeng-components';
import * as _ from 'lodash';
import { ConfirmationService } from 'primeng/';
import { SelectItem } from 'primeng/api';
import { AnaliseSharedDataService } from 'src/app/shared/analise-shared-data.service';
import { AnaliseSharedUtils } from '../../analise-shared/analise-shared-utils';
import { ResumoTotal } from '../../analise-shared/resumo-funcoes';
import { Contrato } from '../../contrato';
import { EsforcoFase } from '../../esforco-fase';
import { Manual } from '../../manual';
import { Organizacao, OrganizacaoService } from '../../organizacao';
import { Sistema } from '../../sistema';
import { TipoEquipe, TipoEquipeService } from '../../tipo-equipe';
import { User, UserService } from '../../user';
import { MessageUtil } from '../../util/message.util';
import { AnaliseShareEquipe } from '../analise-share-equipe.model';
import { Analise } from '../analise.model';
import { AnaliseService } from '../analise.service';
import { Resumo } from './resumo.model';
import { BlockUiService } from '@nuvem/angular-base';
import { AuthService } from 'src/app/util/auth.service';

@Component({
    selector: 'app-analise-resumo',
    templateUrl: './analise-resumo.component.html'
})
export class AnaliseResumoComponent implements OnInit {

    resumoTotal: ResumoTotal;
    public linhaResumo: Resumo[] = [];
    public pfTotal: string;
    public pfAjustada: string;
    complexidades: string[];

    public analise: Analise = null;
    disableAba: Boolean = false;
    analiseShared: Array<AnaliseShareEquipe> = [];
    selectedEquipes: Array<AnaliseShareEquipe>;
    selectedToDelete: AnaliseShareEquipe;
    mostrarDialog = false;
    isEdit: boolean;
    isSaving: boolean;
    dataHomologacao: any;
    loggedUser: User;
    tipoEquipesLoggedUser: TipoEquipe[] = [];
    organizacoes: Organizacao[];
    contratos: Contrato[];
    sistemas: Sistema[];
    esforcoFases: EsforcoFase[] = [];
    fatoresAjuste: SelectItem[] = [];
    equipeResponsavel: SelectItem[] = [];
    manual: Manual;
    users: User[] = [];
    equipeShare = [];
    public isView: boolean;
    idAnalise: Number;

    fatorCriticidade: boolean = false;
    pfCriticidade;

    constructor(
        private confirmationService: ConfirmationService,
        private router: Router,
        private route: ActivatedRoute,
        private analiseService: AnaliseService,
        private analiseSharedDataService: AnaliseSharedDataService,
        private equipeService: TipoEquipeService,
        private organizacaoService: OrganizacaoService,
        private pageNotificationService: PageNotificationService,
        private userService: UserService,
        private blockUiService: BlockUiService,
        private authService: AuthService
    ) {
    }

    getLabel(label) {
        return label;
    }

    ngOnInit() {
        this.getOrganizationsFromActiveLoggedUser();
        this.getLoggedUserId();
        this.getEquipesFromActiveLoggedUser();
        this.route.params.subscribe(params => {
            this.isView = params['view'] !== undefined;
            this.idAnalise = params['id'];
            this.blockUiService.show();
            if (this.idAnalise) {
                if (!this.isView) {
                    this.analiseService.find(this.idAnalise).subscribe(analise => {
                        this.analiseSharedDataService.analise = new Analise().copyFromJSON(analise);
                        this.analise =  new Analise().copyFromJSON(analise);
                        this.disableAba = analise.metodoContagem === MessageUtil.INDICATIVA;
                        this.complexidades = AnaliseSharedUtils.complexidades;
                        this.resumoTotal = this.analiseSharedDataService.analise.resumoTotal;
                        this.esforcoFases = this.analiseSharedDataService.analise.esforcoFases;
                        this.pfTotal = analise.pfTotal;
                        this.pfAjustada = analise.adjustPFTotal;
                        this.fatorCriticidade = analise.fatorCriticidade;
                        if(this.fatorCriticidade === true){
                            this.pfCriticidade =  Number(this.pfAjustada) * 1.35;
                            this.pfCriticidade = this.pfCriticidade.toFixed(2);
                        }
                        this.analiseService.getResumo(this.idAnalise)
                        .subscribe(res => {
                            const jsonResponse = res;
                                const lstResumo: Resumo[] = [];
                                jsonResponse.forEach(
                                    elem => {
                                        lstResumo.push( new Resumo(
                                            elem.pfAjustada,
                                            elem.pfTotal,
                                            elem.quantidadeTipo,
                                            elem.sem,
                                            elem.baixa,
                                            elem.media, elem.alta,
                                            elem.inm,
                                            elem.tipo
                                        ).clone());
                                });
                                this.linhaResumo = lstResumo;
                                this.linhaResumo = Resumo.addTotalLine(this.linhaResumo);
                        });
                    },
                        err => {
                            this.pageNotificationService.addErrorMessage(
                                this.getLabel('Você não tem permissão para editar esta análise, redirecionando para a tela de visualização...')
                            );
                    });
                } else {
                    this.analiseService.findView(this.idAnalise).subscribe(analise => {
                        this.analiseSharedDataService.analise = analise;
                        this.analise = analise;
                        this.pfTotal = analise.pfTotal;
                        this.pfAjustada = analise.adjustPFTotal;
                        this.disableAba = analise.metodoContagem === MessageUtil.INDICATIVA;
                        this.analiseService.getResumo(this.idAnalise)
                            .subscribe(res => {
                                this.linhaResumo = res;
                                this.linhaResumo = Resumo.addTotalLine(this.linhaResumo);
                            });
                    },
                        err => {
                            this.pageNotificationService.addErrorMessage(
                                this.getLabel('Você não tem permissão para editar esta análise, redirecionando para a tela de visualização...')
                            );
                    });

                }
                this.blockUiService.hide();
            }
        });
    }

    private totalEsforcoFases(): number {
        const initialValue = 0;
        if (this.esforcoFases) {
            return this.esforcoFases.reduce((val, ef) => val + ef.esforco, initialValue);
        }
        return 1;
    }

    private aplicaTotalEsforco(pf: number): number {
        return (pf * this.totalEsforcoFases()) / 100;
    }

    handleChange(e) {
        const index = e.index;
        let link;
        switch (index) {
            case 0:
                if (this.isView) {
                    link = ['/analise/' + this.idAnalise + '/view'];
                } else {
                    link = ['/analise/' + this.idAnalise + '/edit'];
                }
                break;
            case 1:
                if (this.isView) {
                    link = ['/analise/' + this.idAnalise + '/funcao-dados/view'];
                } else {
                    link = ['/analise/' + this.idAnalise + '/funcao-dados'];
                }
                break;
            case 2:
                if (this.isView) {
                    link = ['/analise/' + this.idAnalise + '/funcao-transacao/view'];
                } else {
                    link = ['/analise/' + this.idAnalise + '/funcao-transacao'];
                }
                break;
            case 3:
                return;
        }
        this.router.navigate(link);
    }

    public geraRelatorioExcelBrowser() {
        if (this.authService.possuiRole(AuthService.PREFIX_ROLE + "ANALISE_EXPORTAR_RELATORIO_EXCEL") == false) {
            return false;
        }
        this.analiseService.gerarRelatorioExcel(this.idAnalise);
    }

    public geraRelatorioPdfDetalhadoBrowser() {
        if (this.authService.possuiRole(AuthService.PREFIX_ROLE + "ANALISE_EXPORTAR_RELATORIO_DETALHADO") == false) {
            return false;
        }
        this.analiseService.geraRelatorioPdfDetalhadoBrowser(this.idAnalise);
    }

    public bloquearAnalise() {
        if (this.authService.possuiRole(AuthService.PREFIX_ROLE + "ANALISE_BLOQUEAR_DESBLOQUEAR") == false) {
            return false;
        }
        if (!this.analise.dataHomologacao) {
            this.pageNotificationService.addInfoMessage(this.getLabel('Informe a data de homolagação para continuar'));
        }

        if (this.analise.dataHomologacao) {
            this.confirmationService.confirm({
                message: this.getLabel('Tem certeza que deseja bloquear o registro ?')
                    .concat(this.analise.identificadorAnalise)
                    .concat('?'),
                accept: () => {
                    const copy = this.analise.toJSONState();
                    this.analiseService.block(copy).subscribe(() => {
                        this.pageNotificationService.addSuccessMessage(this.analise.identificadorAnalise);
                        this.router.navigate(['analise/']);
                    }, (error: Response) => {
                        switch (error.status) {
                            case 400: {
                                if (error) {
                                    this.pageNotificationService.addErrorMessage(
                                        this.getLabel('Somente administradores podem bloquear/desbloquear análises!')
                                    );
                                } else {
                                    this.pageNotificationService
                                        .addErrorMessage(
                                            this.getLabel('Somente membros da equipe responsável podem bloquear esta análise!'));
                                }
                            }
                        }
                    });
                }
            });
        }

    }

    public openCompartilharDialog() {
        if (this.authService.possuiRole(AuthService.PREFIX_ROLE + "ANALISE_COMPARTILHAR") == false) {
            return false;
        }
        if (this.checkUserAnaliseEquipes()) {
            this.equipeService.findAllCompartilhaveis(this.analise.organizacao.id,
                this.analise.id,
                this.analise.equipeResponsavel.id).subscribe((equipes) => {
                if (equipes) {
                    equipes.forEach((equipe) => {
                        const entity: AnaliseShareEquipe = Object.assign(new AnaliseShareEquipe(),
                            {
                                id: undefined,
                                equipeId: equipe.id,
                                analiseId: this.analise.id,
                                viewOnly: false,
                                nomeEquipe: equipe.nome
                            });
                        this.equipeShare.push(entity);
                    });
                }
            });
            this.analiseService.findAllCompartilhadaByAnalise(this.analise.id).subscribe((shared) => {
                this.analiseShared = shared;
            });
            this.mostrarDialog = true;
        } else {
            this.pageNotificationService.addErrorMessage(this.getLabel('Somente membros da equipe responsável podem compartilhar esta análise!'));
        }
    }

    public salvarCompartilhar() {
        if (this.selectedEquipes && this.selectedEquipes.length !== 0) {
            this.analiseService.salvarCompartilhar(this.selectedEquipes).subscribe((res) => {
                this.mostrarDialog = false;
                this.analise.compartilhadas = this.analise.compartilhadas.concat(this.selectedEquipes);
                this.selectedEquipes.forEach( item => {
                    this.equipeShare = this.equipeShare.filter(
                        compartilha => {
                            return compartilha.id !== item.id ? true : false;
                        });
                });
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
                this.analise.compartilhadas = this.analise.compartilhadas.filter(
                    compartilha => {
                       return compartilha.id !== this.selectedToDelete.id ? true : false;
                    });
                this.mostrarDialog = false;
                this.pageNotificationService.addSuccessMessage(this.getLabel('Compartilhamento removido com sucesso!'));
                this.limparSelecaoCompartilhar();
            });
        } else {
            this.pageNotificationService.addInfoMessage(this.getLabel('Selecione pelo menos um registro para poder remover ou clique no X para sair!'));
        }
    }

    public limparSelecaoCompartilhar() {
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

    checkUserAnaliseEquipes() {
        let retorno = false;
        if (this.tipoEquipesLoggedUser) {
            this.tipoEquipesLoggedUser.forEach(equipe => {
                if (equipe.id === this.analise.equipeResponsavel.id) {
                    retorno = true;
                }
            });
        }
        return retorno;
    }

    showResumo(): Boolean {
        if (this.analise && this.analise.resumoTotal && this.analise.resumoTotal.all) {
            return true;
        } else {
            return false;
        }
    }

    private carregarEsforcoFases(manual: Manual) {
        this.esforcoFases = _.cloneDeep(manual.esforcoFases);
    }

    getOrganizationsFromActiveLoggedUser() {
        this.organizacaoService.dropDownActiveLoggedUser().subscribe(res => {
            this.organizacoes = res;
        });
    }

    getLoggedUserId() {
        this.userService.getLoggedUserWithId().subscribe(res => {
            this.loggedUser = res;
        });
    }

    getEquipesFromActiveLoggedUser() {
        this.equipeService.getEquipesActiveLoggedUser().subscribe(res => {
            this.tipoEquipesLoggedUser = res;
        });
    }
}

