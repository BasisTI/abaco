import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Sistema, SistemaService} from '../sistema/index';
import {Modulo, ModuloService} from '../modulo';
import {Funcionalidade, FuncionalidadeService} from '../funcionalidade';

import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { AnaliseSharedDataService } from '../shared/analise-shared-data.service';
import { PageNotificationService } from '@nuvem/primeng-components';
import { FuncaoDadosService } from '../funcao-dados/funcao-dados.service';
import { Analise } from '../analise/analise.model';

@Component({
    selector: 'app-analise-modulo-funcionalidade',
    templateUrl: './modulo-funcionalidade.component.html'
})

// TODO muito complexo. REFATORAR
// talvez quebrar num componente filho só para funcionalidade
// que observa um output daqui de modulo selecionado
export class ModuloFuncionalidadeComponent implements OnInit, OnDestroy {

    @Input()
    isFuncaoDados: boolean;

    @Input() moduloNameParam: boolean;

    @Input() analise: Analise;

    @Input() funcionalidade : Funcionalidade;

    @Input() modulosSistema: Modulo[];

    @Output()
    moduloSelectedEvent = new EventEmitter<Modulo>();

    @Output()
    funcionalidadeSelectedEvent = new EventEmitter<Funcionalidade>();

    private subscriptionSistemaSelecionado: Subscription;
    private subscriptionAnaliseSalva: Subscription;
    private subscriptionAnaliseCarregada: Subscription;
    private subscriptionFuncaoAnaliseCarregada: Subscription;
    private subscriptionFuncaoAnaliseDescarregada: Subscription;
    private oldModuloSelectedId = -1;
    modulos: Modulo[];
    mostrarDialogModulo = false;
    novoModulo: Modulo = new Modulo();
    moduloSelecionado: Modulo;
    @Input() erroModulo: boolean;
    funcionalidades: Funcionalidade[];
    mostrarDialogFuncionalidade = false;
    novaFuncionalidade: Funcionalidade = new Funcionalidade();
    funcionalidadeSelecionada: Funcionalidade;

    constructor(
        private analiseSharedDataService: AnaliseSharedDataService,
        private moduloService: ModuloService,
        private sistemaService: SistemaService,
        private funcionalidadeService: FuncionalidadeService,
        private changeDetectorRef: ChangeDetectorRef,
        private pageNotificationService: PageNotificationService,
        private funcaoDadosService: FuncaoDadosService,
    ) {
    }

    getLabel(label) {
        return label;
    }

    ngOnInit() {
        this.modulos = this.modulosSistema;
        this.analiseSharedDataService.analise = this.analise;
        if (_.isUndefined(this.isFuncaoDados)) {
            throw new Error('input isFuncaoDados é obrigatório.');
        }
        this.estadoinicial();
    }

    estadoinicial() {
        this.subscribeSistemaSelecionado();
        this.subscribeAnaliseCarregada();
        this.subscribeAnaliseSalva();
        this.subscribeFuncaoAnaliseCarregada();
        this.subscribeFuncaoAnaliseDescarregada();
        this.subscribeFuncionalideBaseline();
        this.carregarModulosQuandoTiverSistemaDisponivel();
    }

    private subscribeFuncionalideBaseline() {
        this.funcaoDadosService.dataModd$.subscribe(
            (data: Funcionalidade) => {
                if (data && data.modulo && data.modulo.funcionalidades) {
                    this.funcionalidades = data.modulo.funcionalidades;
                    this.selecionarModuloBaseline(data.modulo.id, data.id);
                }
            });
    }

    private subscribeSistemaSelecionado() {
        this.subscriptionSistemaSelecionado =
            this.analiseSharedDataService.getSistemaSelecionadoSubject().subscribe(() => {
                this.carregarModulosQuandoTiverSistemaDisponivel();
            });
    }

    // TODO Refatorar, pode estar gerando requisições multiplas.
    private carregarModulosQuandoTiverSistemaDisponivel() {
        if (!this.sistema) {
            return;
        }
        if(this.funcionalidade){
            this.selecionarModulo(this.funcionalidade.modulo.id);
        }

        const sistemaId = this.sistema.id;
        this.sistemaService.find(sistemaId).subscribe((sistemaRecarregado: Sistema) => {
            this.recarregarSistema(sistemaRecarregado);
            // this.modulos = sistemaRecarregado.modulos;
            // this.selecionarModulo(this.funcionalidade.modulo.id);
        });
        this.changeDetectorRef.detectChanges();
    }

    private get sistema(): Sistema {
        if (this.analiseSharedDataService.analise && this.analiseSharedDataService.analise.sistema) {
            return this.analiseSharedDataService.analise.sistema;
        }
        return null;
    }

    private subscribeAnaliseCarregada() {
        this.subscriptionAnaliseCarregada = this.analiseSharedDataService.getLoadSubject().subscribe(() => {
            if (this.sistema) {
                this.carregarModulosQuandoTiverSistemaDisponivel();
            }
        });
    }

    private subscribeAnaliseSalva() {
        this.subscriptionAnaliseSalva = this.analiseSharedDataService.getSaveSubject().subscribe(() => {
            this.modulos = this.sistema.modulos.slice();
            this.selectModuloOnAnaliseSalva();
            this.changeDetectorRef.detectChanges();
        });
    }

    private selectModuloOnAnaliseSalva() {
        const moduloASelecionar = this.getModuloASelecionarDeAcordoComTipoFuncaoDoComponente();
        if (moduloASelecionar) {
            this.selecionarModulo(moduloASelecionar.id);
        }
    }

    private getModuloASelecionarDeAcordoComTipoFuncaoDoComponente(): Modulo {
        if (this.currentFuncaoAnalise.funcionalidade) {
            return this.currentFuncaoAnalise.funcionalidade.modulo;
        }
    }

    // TODO pode retornar interface FuncaoAnalise. mas precisa ser complementada
    private get currentFuncaoAnalise() {
        if (this.isFuncaoDados) {
            return this.analiseSharedDataService.currentFuncaoDados;
        } else {
            return this.analiseSharedDataService.currentFuncaoTransacao;
        }
    }

    // Para selecionar no dropdown, o objeto selecionado tem que ser o mesmo da lista de opções
    private selecionarModulo(moduloId: number) {
        for (let index = 0; index < this.modulos.length; index++) {
            const element = this.modulos[index];
            if(element.id == moduloId){
                this.moduloSelecionado = element;
            }
        }
        // this.moduloSelecionado = _.find(this.modulos, {'id': moduloId});
        this.moduloSelected(this.moduloSelecionado);
    }

    /* Seleciona no dropdown o modulo da Baseline recebido do componente funcao-dados-form-component.ts*/
    private selecionarModuloBaseline(moduloId: number, funcionalideId: number) {
        this.moduloSelecionado = _.find(this.modulos, {'id': moduloId});
        this.funcionalidadeSelecionada = _.find(this.funcionalidades, {'id': funcionalideId});
    }

    private subscribeFuncaoAnaliseCarregada() {
        this.subscriptionFuncaoAnaliseCarregada =
            this.analiseSharedDataService.getFuncaoAnaliseCarregadaSubject().subscribe(() => {
                this.carregarTudoOnFuncaoAnaliseCarregada();
            });
    }

    private carregarTudoOnFuncaoAnaliseCarregada() {
        if (this.isCurrentFuncaoAnaliseDefined()) {
            this.doCarregarTudoOnFuncaoAnaliseCarregada();
        }
    }

    private isCurrentFuncaoAnaliseDefined(): boolean {
        // TODO inappropriate intimacy. Pode ir pra interface FuncaoAnalise
        if (this.currentFuncaoAnalise === undefined || this.currentFuncaoAnalise.id === undefined || this.currentFuncaoAnalise.artificialId === undefined) {
            return false;
        } else {
            return true;
        }
    }

    // TODO avaliar duplicacoes e refatorar
    private doCarregarTudoOnFuncaoAnaliseCarregada() {
        const currentFuncionalidade: Funcionalidade = this.currentFuncaoAnalise.funcionalidade;
        const currentModulo: Modulo = currentFuncionalidade.modulo;

        this.modulos = this.sistema.modulos;
        this.selecionarModulo(currentModulo.id);

        this.funcionalidades = currentModulo.funcionalidades;
        this.funcionalidadeSelecionada = _.find(this.funcionalidades, {'id': currentFuncionalidade.id});
        this.funcionalidadeSelected(this.funcionalidadeSelecionada);
    }

    private selecionaFuncionalidadeFromCurrentAnalise(modulo) {
        if (!(this.currentFuncaoAnalise && this.currentFuncaoAnalise.funcionalidade)) {
            return;
        }
        const currentFuncionalidade: Funcionalidade = this.currentFuncaoAnalise.funcionalidade;
        if (currentFuncionalidade != null) {
            this.funcionalidadeSelecionada = _.find(this.funcionalidades, {'id': currentFuncionalidade.id});
            this.funcionalidadeSelecionada.modulo = modulo;
            this.funcionalidadeSelectedEvent.emit(this.funcionalidadeSelecionada);
        }
    }

    private subscribeFuncaoAnaliseDescarregada() {
        this.subscriptionFuncaoAnaliseDescarregada =
            this.analiseSharedDataService.getFuncaoAnaliseDescarregadaSubject().subscribe(() => {
                this.limpaSelecoes();
            });
    }

    private limpaSelecoes() {
        // TODO undefined? new?
        this.moduloSelecionado = undefined;
        this.funcionalidadeSelecionada = undefined;
    }

    moduloName() {
        if (this.isModuloSelected()) {
            return this.moduloSelecionado.nome;
        }
    }

    isSistemaSelected(): boolean {
        return !_.isUndefined(this.sistema);
    }

    moduloDropdownPlaceholder(): string {
        if (this.isSistemaSelected()) {
            return this.moduloDropdownPlaceholderComSistemaSelecionado();
        } else {
            return this.getLabel('Selecione um Sistema na aba \'Geral\' para carregar os Módulos');
        }
    }

    private moduloDropdownPlaceholderComSistemaSelecionado(): string {
        if (this.sistemaTemModulos()) {
            return this.getLabel('Selecione um Módulo');
        } else {
            return this.getLabel('Nenhum Módulo cadastrado');
        }
    }

    private sistemaTemModulos(): boolean {
        return this.sistema.modulos && this.sistema.modulos.length > 0;
    }

    abrirDialogModulo() {
        if (this.isSistemaSelected()) {
            this.mostrarDialogModulo = true;
            // XXX problema em dar new toda hora?
            this.novoModulo = new Modulo();
        }
    }

    fecharDialogModulo() {
        this.mostrarDialogModulo = false;
    }

    isModuloSelected(): boolean {
        return !_.isUndefined(this.moduloSelecionado);
    }

    moduloSelected(modulo: Modulo) {
        this.deselecionaFuncionalidadeSeModuloSelecionadoForDiferente();

        const moduloId = modulo.id;
        this.funcionalidadeService.findFuncionalidadesDropdownByModulo(moduloId).subscribe((funcionalidades: Funcionalidade[]) => {
            this.funcionalidades = funcionalidades;
            this.selecionaFuncionalidadeFromCurrentAnalise(modulo);
        });
        this.moduloSelectedEvent.emit(modulo);
    }

    private deselecionaFuncionalidadeSeModuloSelecionadoForDiferente() {
        if (this.moduloSelecionado.id !== this.oldModuloSelectedId) {
            this.funcionalidadeSelecionada = undefined;
        }
    }

    adicionarModulo() {
        if (!this.novoModulo.nome) {
            this.pageNotificationService.addErrorMessage(this.getLabel('Por favor preencher o campo obrigatório!'));
            return;
        }
        const sistemaId = this.sistema.id;
        // TODO inserir um spinner, talvez bloquear a UI
        this.moduloService.create(this.novoModulo, sistemaId).subscribe((moduloCriado: Modulo) => {
            this.estadoinicial();
            this.sistemaService.find(sistemaId).subscribe((sistemaRecarregado: Sistema) => {
                this.recarregarSistema(sistemaRecarregado);
                this.selecionarModulo(moduloCriado.id);
                this.criarMensagemDeSucessoDaCriacaoDoModulo(moduloCriado.nome, sistemaRecarregado.nome);
            });
        });

        this.fecharDialogModulo();
    }

    private recarregarSistema(sistemaRecarregado: Sistema) {
        this.analiseSharedDataService.analise.sistema = sistemaRecarregado;
        this.modulos = sistemaRecarregado.modulos;
    }

    private criarMensagemDeSucessoDaCriacaoDoModulo(nomeModulo: string, nomeSistema: string) {
        this.pageNotificationService
            .addSuccessMessage(`${this.getLabel('Módulo ')} ${nomeModulo} ${this.getLabel(' criado para o Sistema')} ${nomeSistema}`);
    }

    funcionalidadeDropdownPlaceholder() {
        if (this.isModuloSelected()) {
            return this.funcionalidadeDropdownPlaceHolderComModuloSelecionado();
        } else {
            return this.getLabel('Selecione um Módulo para carregar as Funcionalidades');
        }
    }

    private funcionalidadeDropdownPlaceHolderComModuloSelecionado(): string {
        if (this.moduloSelecionadoTemFuncionalidade()) {
            return this.getLabel('Selecione uma Funcionalidade');
        } else {
            return this.getLabel('Nenhuma Funcionalidade Cadastrada');
        }
    }

    private moduloSelecionadoTemFuncionalidade(): boolean {
        return this.moduloSelecionado.funcionalidades && this.moduloSelecionado.funcionalidades.length > 0;
    }

    abrirDialogFuncionalidade() {
        if (this.isModuloSelected()) {
            this.mostrarDialogFuncionalidade = true;
            this.novaFuncionalidade = new Funcionalidade();
        }
    }

    fecharDialogFuncionalidade() {
        this.mostrarDialogFuncionalidade = false;
    }

    adicionarFuncionalidade() {
        if (this.novaFuncionalidade.nome === undefined) {
            this.pageNotificationService.addErrorMessage(this.getLabel('Por favor preencher o campo obrigatório!'));
            return;
        }
        const moduloId = this.moduloSelecionado.id;
        const sistemaId = this.sistema.id;
        // TODO inserir um spinner
        this.funcionalidadeService.create(this.novaFuncionalidade, moduloId)
            .subscribe((funcionalidadeCriada: Funcionalidade) => {
                this.sistemaService.find(sistemaId).subscribe((sistemaRecarregado: Sistema) => {
                    this.recarregarSistema(sistemaRecarregado);
                    this.selecionarModulo(moduloId);
                    this.selecionarFuncionalidadeRecemCriada(funcionalidadeCriada);
                    this.criarMensagemDeSucessoDaCriacaoDaFuncionalidade(funcionalidadeCriada.nome,
                        this.moduloSelecionado.nome, sistemaRecarregado.nome);
                });
            });

        this.fecharDialogFuncionalidade();
    }

    funcionalidadeSelected(funcionalidade: Funcionalidade) {
        if (funcionalidade.modulo === undefined || funcionalidade == null) {
            this.moduloService.findByFuncionalidade(funcionalidade.id).subscribe(
                modulo => {
                    funcionalidade.modulo = modulo;
                    this.funcionalidadeSelectedEvent.emit(funcionalidade);
                }
            );
        } else {
            this.funcionalidadeSelectedEvent.emit(funcionalidade);
        }
    }

    private selecionarFuncionalidadeRecemCriada(funcionalidadeCriada: Funcionalidade) {
        this.funcionalidadeSelecionada = _.find(this.moduloSelecionado.funcionalidades,
            {'id': funcionalidadeCriada.id});
        this.funcionalidadeSelected(this.funcionalidadeSelecionada);
    }

    private criarMensagemDeSucessoDaCriacaoDaFuncionalidade(nomeFunc: string, nomeModulo: string, nomeSistema: string) {
        this.pageNotificationService
            .addSuccessMessage(`${this.getLabel('Funcionalidade ')} ${nomeFunc} ${this.getLabel(' criado no módulo ')} ${nomeModulo} ${this.getLabel(' do Sistema ')} ${nomeSistema}`);
    }

    ngOnDestroy() {
        this.subscriptionSistemaSelecionado.unsubscribe();
        this.subscriptionAnaliseCarregada.unsubscribe();
        this.subscriptionAnaliseSalva.unsubscribe();
        this.subscriptionFuncaoAnaliseCarregada.unsubscribe();
        this.changeDetectorRef.detach();
    }
}
