import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
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
import {SistemaService} from '../../sistema';
import {FuncaoDadosService} from '../../funcao-dados/funcao-dados.service';
import {FuncaoTransacaoService} from '../../funcao-transacao/funcao-transacao.service';
import {TipoEquipeService} from '../../tipo-equipe';
import {OrganizacaoService} from '../../organizacao';
import {ContratoService} from '../../contrato';
import {Manual, ManualService} from '../../manual';
import * as _ from 'lodash';
import {MessageUtil} from '../../util/message.util';

@Component({
    selector: 'app-analise-resumo',
    templateUrl: './analise-resumo.component.html'
})
export class AnaliseResumoComponent implements OnInit {

    resumoTotal: ResumoTotal;

    complexidades: string[];

    esforcoFases: EsforcoFase[];

    private analiseCarregadaSubscription: Subscription;

    public analise: Analise;
    selectedToDelete: any;
    equipeShare: any;
    mostrarDialog: any;
    selectedEquipes: any;
    @BlockUI() blockUI: NgBlockUI;
    private analiseShared: any;
    private users: User[] = [];
    private tipoEquipesLoggedUser: any;
    disableAba: Boolean = false ;

    constructor(
        private confirmationService: ConfirmationService,
        private router: Router,
        private route: ActivatedRoute,
        private analiseService: AnaliseService,
        private sistemaService: SistemaService,
        private funcaoDadosService: FuncaoDadosService,
        private funcaoTransacaoService: FuncaoTransacaoService,
        private analiseSharedDataService: AnaliseSharedDataService,
        private equipeService: TipoEquipeService,
        private organizacaoService: OrganizacaoService,
        private pageNotificationService: PageNotificationService,
        private userService: UserService,
        private contratoService: ContratoService,
        private manualService: ManualService,
        private translate: TranslateService,
        private changeDetectorRef: ChangeDetectorRef,
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
        this.analiseSharedDataService.init();
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.analiseService.findWithFuncaos(params['id']).subscribe(analise => {
                        this.analiseSharedDataService.analise = analise;
                        this.disableAba =  analise.metodoContagem === MessageUtil.INDICATIVA;
                        this.analise = this.analiseSharedDataService.analise;
                        this.carregarEsforcoFases(analise.manual);
                        this.esforcoFases = analise.esforcoFases;
                        this.analiseCarregadaSubscription = this.analiseSharedDataService.getLoadSubject().subscribe(() => {
                            this.resumoTotal = this.analiseSharedDataService.analise.resumoTotal;
                            this.changeDetectorRef.detectChanges();
                            this.complexidades = AnaliseSharedUtils.complexidades;
                        });
                    },
                    err => {
                        this.pageNotificationService.addErrorMsg(
                            this.getLabel('Analise.Analise.Mensagens.msgSemPermissaoParaEditarAnalise')
                        );
                        this.router.navigate(['/analise']);
                    });
            }
        });
    }

    handleChange(e) {
        const index = e.index;
        let link;
        switch (index) {
            case 0:
                link = ['/analise/' + this.analise.id + '/edit'];
                break;
            case 1:
                link = ['/analise/' + this.analise.id + ' /funcao-dados'];
                break;
            case 2:
                link = ['/analise/' + this.analise.id + '/funcao-transacao'];
                break;
            case 3:
                return;
        }
        this.router.navigate(link);
    }

    public geraRelatorioExcelBrowser() {
        this.analiseService.gerarRelatorioExcel(this.analise.id);
    }

    public geraRelatorioPdfDetalhadoBrowser() {
        this.analiseService.geraRelatorioPdfDetalhadoBrowser(this.analise.id);
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

}
