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
import { AnaliseShareEquipe } from '../../analise/analise-share-equipe.model';
import { Analise } from '../../analise/analise.model';
import { AnaliseService } from '../../analise/analise.service';
import { Resumo } from './resumo.model';
import { BlockUiService } from '@nuvem/angular-base';
import { DivergenciaService } from '../divergencia.service';

@Component({
    selector: 'app-analise-resumo',
    templateUrl: './divergencia-resumo.component.html'
})
export class DivergenciaResumoComponent implements OnInit {

    resumoTotal: ResumoTotal;
    public linhaResumo: Resumo[] = [];
    public pfTotal: number;
    public pfAjustada: number;
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

    constructor(
        private confirmationService: ConfirmationService,
        private router: Router,
        private route: ActivatedRoute,
        private analiseSharedDataService: AnaliseSharedDataService,
        private equipeService: TipoEquipeService,
        private organizacaoService: OrganizacaoService,
        private pageNotificationService: PageNotificationService,
        private userService: UserService,
        private blockUiService: BlockUiService,
        private divergenciaService: DivergenciaService,
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
                    this.divergenciaService.find(this.idAnalise).subscribe(analise => {
                        this.analiseSharedDataService.analise = new Analise().copyFromJSON(analise);
                        this.analise =  new Analise().copyFromJSON(analise);
                        this.disableAba = analise.metodoContagem === MessageUtil.INDICATIVA;
                        this.complexidades = AnaliseSharedUtils.complexidades;
                        this.resumoTotal = this.analiseSharedDataService.analise.resumoTotal;
                        this.esforcoFases = this.analiseSharedDataService.analise.esforcoFases;
                        this.pfTotal = parseFloat(analise.pfTotal);
                        this.pfAjustada = parseFloat(analise.adjustPFTotal);
                        this.divergenciaService.getDivergenciaResumo(this.idAnalise)
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
                    this.divergenciaService.findView(this.idAnalise).subscribe(analise => {
                        this.analiseSharedDataService.analise = analise;
                        this.analise = analise;
                        this.pfTotal = parseFloat(analise.pfTotal);
                        this.pfAjustada = parseFloat(analise.adjustPFTotal);
                        this.disableAba = analise.metodoContagem === MessageUtil.INDICATIVA;
                        this.divergenciaService.getDivergenciaResumo(this.idAnalise)
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
                    link = ['/divergencia/' + this.idAnalise + '/view'];
                } else {
                    link = ['/divergencia/' + this.idAnalise + '/edit'];
                }
                break;
            case 1:
                if (this.isView) {
                    link = ['/divergencia/' + this.idAnalise + '/funcao-dados/view'];
                } else {
                    link = ['/divergencia/' + this.idAnalise + '/funcao-dados'];
                }
                break;
            case 2:
                if (this.isView) {
                    link = ['/divergencia/' + this.idAnalise + '/funcao-transacao/view'];
                } else {
                    link = ['/divergencia/' + this.idAnalise + '/funcao-transacao'];
                }
                break;
            case 3:
                return;
        }
        this.router.navigate(link);
    }

    public iteratorLinhaResumoPfTotal(){
        this.pfTotal = 0;
        this.linhaResumo.forEach(element => {
            this.pfTotal = element.pfTotal
            
        });
        
        return this.pfTotal.toFixed(2);;
    }

    public iteratorLinhaResumopfAjustada(){
        this.pfAjustada = 0;
        this.linhaResumo.forEach(element => {
            this.pfAjustada = element.pfAjustada
            
        });
        
        return this.pfAjustada.toFixed(2);
    }

    public geraRelatorioExcelBrowser() {
        this.divergenciaService.gerarRelatorioExcel(this.idAnalise);
    }

    public geraRelatorioPdfDetalhadoBrowser() {
        this.divergenciaService.geraRelatorioPdfDetalhadoBrowser(this.idAnalise);
    }


    public limparSelecaoCompartilhar() {
        this.selectedEquipes = undefined;
        this.selectedToDelete = undefined;
    }

    public updateViewOnly() {
        setTimeout(() => {
            this.divergenciaService.atualizarCompartilhar(this.selectedToDelete).subscribe((res) => {
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

