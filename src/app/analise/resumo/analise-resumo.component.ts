import { forEach } from '@angular/router/src/utils/collection';
import { LinhaResumo } from './../../analise-shared/resumo-funcoes';
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ResumoTotal} from '../../analise-shared/resumo-funcoes';
import {AnaliseSharedUtils} from '../../analise-shared/analise-shared-utils';
import {AnaliseSharedDataService, PageNotificationService} from '../../shared';
import {Analise} from '../analise.model';
import {Subscription} from 'rxjs/Subscription';
import {EsforcoFase} from '../../esforco-fase';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AnaliseService} from '../analise.service';
import {AnaliseShareEquipe} from '../analise-share-equipe.model';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {User, UserService} from '../../user';
import {ConfirmationService} from 'primeng/primeng';
import {Sistema, SistemaService} from '../../sistema';
import {FuncaoDadosService} from '../../funcao-dados/funcao-dados.service';
import {FuncaoTransacaoService} from '../../funcao-transacao/funcao-transacao.service';
import {TipoEquipe, TipoEquipeService} from '../../tipo-equipe';
import {Organizacao, OrganizacaoService} from '../../organizacao';
import {Contrato, ContratoService} from '../../contrato';
import {Manual, ManualService} from '../../manual';
import * as _ from 'lodash';
import {MessageUtil} from '../../util/message.util';
import {SelectItem} from 'primeng/api';
import {Resumo} from './resumo.model';
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
    @BlockUI() blockUI: NgBlockUI;
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
        private translate: TranslateService,
    ) {
    }

    getLabel(label) {
        let str: any;
        this.translate.get(label).subscribe((res: string) => {
            str = res;
        }).unsubscribe();
        return str;
    }

    ngOnInit() {
        this.getOrganizationsFromActiveLoggedUser();
        this.getLoggedUserId();
        this.getEquipesFromActiveLoggedUser();
        this.route.params.subscribe(params => {
            this.isView = params['view'] !== undefined;
            this.idAnalise = params['id'];
            if (this.idAnalise) {
                if(!this.isView){
                    this.analiseService.find(this.idAnalise).subscribe(analise => {
                        this.analiseSharedDataService.analise = analise;
                        this.analise = analise;
                        this.disableAba = analise.metodoContagem === MessageUtil.INDICATIVA;
                        this.complexidades = AnaliseSharedUtils.complexidades;
                        this.resumoTotal = this.analiseSharedDataService.analise.resumoTotal;
                        this.esforcoFases = this.analiseSharedDataService.analise.esforcoFases;
                        this.pfTotal = analise.pfTotal;
                        this.pfAjustada = analise.adjustPFTotal;
                        this.analiseService.getResumo(this.idAnalise).subscribe(res =>{
                            this.linhaResumo = res;
                            this.linhaResumo = Resumo.addTotalLine(this.linhaResumo);
                        });
                    },
                        err => {
                            this.pageNotificationService.addErrorMsg(
                                this.getLabel('Analise.Analise.Mensagens.msgSemPermissaoParaEditarAnalise')
                            );
                    });
                }else {
                    this.analiseService.findView(this.idAnalise).subscribe(analise => {
                        this.analiseSharedDataService.analise = analise;
                        this.analise = analise;
                        this.pfTotal = analise.pfTotal;
                        this.pfAjustada = analise.adjustPFTotal;
                        this.disableAba = analise.metodoContagem === MessageUtil.INDICATIVA;
                        this.analiseService.getResumo(this.idAnalise).subscribe(res =>{
                            this.linhaResumo = res;
                            this.linhaResumo = Resumo.addTotalLine(this.linhaResumo);
                        });
                    },
                        err => {
                            this.pageNotificationService.addErrorMsg(
                                this.getLabel('Analise.Analise.Mensagens.msgSemPermissaoParaEditarAnalise')
                            );
                    });

                }
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
                }else {
                    link = ['/analise/' + this.idAnalise + '/edit'];
                }
                break;
            case 1:
                if (this.isView) {
                    link = ['/analise/' + this.idAnalise + '/funcao-dados/view'];
                }else {
                    link = ['/analise/' + this.idAnalise + '/funcao-dados'];
                }
                break;
            case 2:
                if (this.isView) {
                    link = ['/analise/' + this.idAnalise + '/funcao-transacao/view'];
                }else {
                    link = ['/analise/' + this.idAnalise + '/funcao-transacao'];
                }
                break;
            case 3:
                return;
        }
        this.router.navigate(link);
    }

    public geraRelatorioExcelBrowser() {
        this.analiseService.gerarRelatorioExcel(this.idAnalise);
    }

    public geraRelatorioPdfDetalhadoBrowser() {
        this.analiseService.geraRelatorioPdfDetalhadoBrowser(this.idAnalise);
    }

    public bloquearAnalise() {
        if (!this.analise.dataHomologacao) {
            this.pageNotificationService.addInfoMsg(this.getLabel('Analise.Analise.Mensagens.msgINFORME_DATA_HOMOLOGACAO'));
        }

        if (this.analise.dataHomologacao) {
            this.confirmationService.confirm({
                message: this.getLabel('Analise.Analise.Mensagens.msgCONFIRMAR_BLOQUEIO')
                    .concat(this.analise.identificadorAnalise)
                    .concat('?'),
                accept: () => {
                    const copy = this.analise.toJSONState();
                    this.analiseService.block(copy).subscribe(() => {
                        this.pageNotificationService.addBlockMsgWithName(this.analise.identificadorAnalise);
                        this.router.navigate(['analise/']);
                    }, (error: Response) => {
                        switch (error.status) {
                            case 400: {
                                if (error) {
                                    this.pageNotificationService.addErrorMsg(
                                        this.getLabel('Analise.Analise.Mensagens.msgSomenteAdministradoresBloquearDesbloquear')
                                    );
                                } else {
                                    this.pageNotificationService
                                        .addErrorMsg(this.getLabel('Analise.Analise.Mensagens.msgSomenteEquipeBloquearAnalise'));
                                }
                            }
                        }
                    });
                }
            });
        }

    }

    public openCompartilharDialog() {
        if (this.checkUserAnaliseEquipes()) {
            this.equipeService.findAllCompartilhaveis(this.analise.organizacao.id,
                this.analise.id,
                this.analise.equipeResponsavel.id).subscribe((equipes) => {
                if (equipes.json) {
                    equipes.json.forEach((equipe) => {
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
                this.blockUI.stop();
            });
            this.analiseService.findAllCompartilhadaByAnalise(this.analise.id).subscribe((shared) => {
                this.analiseShared = shared.json;
            });
            this.mostrarDialog = true;
        } else {
            this.pageNotificationService.addErrorMsg(this.getLabel('Analise.Analise.Mensagens.msgSomenteEquipeCompartilharAnalise'));
        }
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
            this.organizacoes = res.json;
        });
    }

    getLoggedUserId() {
        this.userService.getLoggedUserWithId().subscribe(res => {
            this.loggedUser = res;
        });
    }

    getEquipesFromActiveLoggedUser() {
        this.equipeService.getEquipesActiveLoggedUser().subscribe(res => {
            this.tipoEquipesLoggedUser = res.json;
        });
    }
}

