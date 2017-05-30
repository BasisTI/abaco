import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import { Analise } from './analise.model';
import { AnalisePopupService } from './analise-popup.service';
import { AnaliseService } from './analise.service';
import { Sistema, SistemaService } from '../sistema';
import { FuncaoDados, FuncaoDadosService } from '../funcao-dados';
import { FuncaoTransacao, FuncaoTransacaoService } from '../funcao-transacao';

import { Funcionalidade, FuncionalidadeService } from '../funcionalidade';
import { Modulo, ModuloService } from '../modulo';
import {Complexity, LogicalFile, OutputTypes} from "./enums";
import {Process} from "./process.model";
import {TabsetComponent} from "ngx-bootstrap";
import {FatorAjuste} from "../fator-ajuste/fator-ajuste.model";
import {Subscription} from "rxjs/Subscription";
import {FatorAjusteService} from "../fator-ajuste/fator-ajuste.service";

@Component({
    selector: 'jhi-analise-dialog',
    templateUrl: './analise-dialog.component.html'

})
export class AnaliseDialogComponent implements OnInit {

    analise: Analise;
    authorities: any[];
    isSaving: boolean;

    sistemas: Sistema[];

    funcaodados: FuncaoDados[];

    funcaotransacaos: FuncaoTransacao[];

    @ViewChild('staticTabs') staticTabs: TabsetComponent;
    factors: FatorAjuste[];
    funcionalidades: Funcionalidade[];
    filteredFunc: Funcionalidade[];
    filteredTranFunc: Funcionalidade[];
    modules: Modulo[];
    eventSubscriber: Subscription;
    eventFuncSubscriber: Subscription;
    selectedModulo: Modulo;
    selectedFunc: Funcionalidade;
    selectedFactor: FatorAjuste;
    selectedLogicalFile: IdTitle;
    selectedOutputType: IdTitle;

    selectedTranModulo: Modulo;
    selectedTranFunc: Funcionalidade;
    selectedTranFactor: FatorAjuste;


    logicalFiles:IdTitle[];
    outputTypes:IdTitle[];
    complexities:String[];
    elementaryProcess:String ="";
    elementaryTranProcess:String ="";
    ret:String = "";
    det:String = "";
    retTran:String = "";
    detTran:String = "";
    listOfProcess:Process[]=[];
    listOfTranProcess:Process[]=[];
    selectedProcess:Process;
    totals:TotalRecord[];
    totalsTran:TotalRecord[];
    summary:TotalRecord[]=[];
    totalRow:TotalRecord = new TotalRecord(0);

    editedProcess:Process=null; // Define the process that it is in editabled mode




    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private analiseService: AnaliseService,
        private sistemaService: SistemaService,
        private funcaoDadosService: FuncaoDadosService,
        private funcaoTransacaoService: FuncaoTransacaoService,
        private eventManager: EventManager,
        private funcionalidadeService: FuncionalidadeService,
        private moduloService: ModuloService,
        private  fatorAjusteService:FatorAjusteService
    ) {
        this.jhiLanguageService.setLocations(['analise', 'metodoContagem', 'tipoAnalise']);
        this.selectedModulo=null;
        this.selectedFunc = null;
        this.selectedFactor = null;
        this.selectedTranModulo=null;
        this.selectedTranFunc = null;
        this.selectedTranFactor = null;
        this.selectedLogicalFile = null;
        this.selectedOutputType = null;

        this.logicalFiles = Object.keys(LogicalFile).filter(v=> v==String(Number(v))).map(k => new IdTitle(Number(k),LogicalFile[k]));
        this.outputTypes = Object.keys(OutputTypes).filter(v=> v==String(Number(v))).map(k => new IdTitle(Number(k),OutputTypes[k]));
        this.complexities = Object.keys(Complexity).filter(v=> v==String(Number(v))).map(k => Complexity[k]);
        this.selectedProcess = null;
        this.totals = [];
        this.totalsTran = [];
        this.initTotalsTable();
    }


    /**
     * Init summary tables
     */
    initTotalsTable(){
        this.totals[LogicalFile.ILF] = new TotalRecord(LogicalFile.ILF);
        this.totals[LogicalFile.EIF] = new TotalRecord(LogicalFile.EIF);
        this.totalsTran[OutputTypes.EI-2] = new TotalRecord(OutputTypes.EI);
        this.totalsTran[OutputTypes.EO-2] = new TotalRecord(OutputTypes.EO);
        this.totalsTran[OutputTypes.EQ-2] = new TotalRecord(OutputTypes.EQ);

        this.summary[LogicalFile.ILF] = new TotalRecord(LogicalFile.ILF);
        this.summary[LogicalFile.EIF] = new TotalRecord(LogicalFile.EIF);
        this.summary[OutputTypes.EI] = new TotalRecord(OutputTypes.EI);
        this.summary[OutputTypes.EO] = new TotalRecord(OutputTypes.EO);
        this.summary[OutputTypes.EQ] = new TotalRecord(OutputTypes.EQ);
    }



    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.sistemaService.query().subscribe(
            (res: Response) => { this.sistemas = res.json(); }, (res: Response) => this.onError(res.json()));
        this.funcaoDadosService.query().subscribe(
            (res: Response) => { this.funcaodados = res.json(); }, (res: Response) => this.onError(res.json()));
        this.funcaoTransacaoService.query().subscribe(
            (res: Response) => { this.funcaotransacaos = res.json(); }, (res: Response) => this.onError(res.json()));

        this.fatorAjusteService.query().subscribe(
            (res: Response) => { this.factors = res.json(); }, (res: Response) => this.onError(res.json()));
        this.funcionalidadeService.query().subscribe(
            (res: Response) => { this.funcionalidades = res.json(); }, (res: Response) => this.onError(res.json()));
        this.moduloService.query().subscribe(
            (res: Response) => { this.modules = res.json(); }, (res: Response) => this.onError(res.json()));
        this.registerChangeInModulos();
        this.registerChangeInFunc()
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.analise.id !== undefined) {
            this.analiseService.update(this.analise)
                .subscribe((res: Analise) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.analiseService.create(this.analise)
                .subscribe((res: Analise) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: Analise) {
        this.eventManager.broadcast({ name: 'analiseListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError (error) {
        this.isSaving = false;
        this.onError(error);
    }

    private onError (error) {
        this.alertService.error(error.message, null, null);
    }

    trackSistemaById(index: number, item: Sistema) {
        return item.id;
    }

    trackFuncaoDadosById(index: number, item: FuncaoDados) {
        return item.id;
    }

    trackFuncaoTransacaoById(index: number, item: FuncaoTransacao) {
        return item.id;
    }


    trackModulleById(index: number, item: Funcionalidade) {
        return item.id;
    }


    /**
     * Get list of functions by selected module
     *
     * @param model
     *          given module
     *
     */
    filteredFunctionsByModule(model:Modulo){
        if (model==null) {
            return [];
        }
        let func:Funcionalidade[];
        func=this.funcionalidades.filter(f=>{
            return f.modulo.id==model.id;
        });

        return func;
    }


    onModuleChange(item:any)
    {
        this.filteredFunc = this.filteredFunctionsByModule(this.selectedModulo);
        this.selectedFunc = null;
    }


    onModuleTranChange(item:any){
        this.filteredTranFunc = this.filteredFunctionsByModule(this.selectedTranModulo);
        this.selectedTranFunc = null;
    }


    trackFuncById(index: number, item: Modulo) {
        return item.id;
    }

    trackProcessById(index: number, item: Process) {
        return item.id;
    }


    reloadModulesList() {
        this.moduloService.query().subscribe(
            (res: Response) => {
                this.modules = res.json();
                this.selectedModulo=null;
                this.selectedTranModulo=null;
            }, (res: Response) => this.onError(res.json()));
    }



    reloadFuncList(){
        this.funcionalidadeService.query().subscribe(
            (res: Response) => {
                this.funcionalidades = res.json();
                this.onModuleChange(null);
                this.onModuleTranChange(null);
            }, (res: Response) => this.onError(res.json()));
    }


    /*
     Add new elementary process for "de Dados" page
     */
    add(){
        let newProcess = (this.editedProcess!=null)? this.editedProcess: new Process();
        if (this.editedProcess==null) newProcess.id = new Date().getTime();
        newProcess.factor = this.selectedFactor;
        newProcess.module = this.selectedModulo;
        newProcess.func = this.selectedFunc;
        newProcess.classification = this.selectedLogicalFile.id;
        newProcess.name = this.elementaryProcess;
        newProcess.retStr = this.ret;
        newProcess.detStr = this.det;
        newProcess.calculate();
        if (this.editedProcess==null) {
            this.listOfProcess.push(newProcess);
        } else {

            let searchedIndex=this.getIndexOfProcessById(this.listOfProcess,this.editedProcess.id);
            if (searchedIndex>=0) {
                this.listOfProcess[searchedIndex] = newProcess;
            }
        }
        this.recalculateTotals();
        this.editedProcess = null;
        document.getElementById("buttonAdd").innerText = "Adicionar";
    }


    /*
     Add new elementary process for "de Transacao" page
     */
    addTran(){
        let newProcess = new Process();
        newProcess.id = new Date().getTime();
        newProcess.factor = this.selectedTranFactor;
        newProcess.module = this.selectedTranModulo;
        newProcess.func = this.selectedTranFunc;
        newProcess.classification = this.selectedOutputType.id;
        newProcess.name = this.elementaryTranProcess;

        newProcess.retStr = this.retTran;
        newProcess.detStr = this.detTran;
        newProcess.calculateTran();
        this.listOfTranProcess.push(newProcess);
        this.recalculateTranTotals();
    }

    remove(process){

        let searchedIndex=this.getIndexOfProcessById(this.listOfProcess,process.id);

        if (searchedIndex>=0) {
            this.listOfProcess.splice(searchedIndex,1);
            this.recalculateTotals();
        }
    }



    getIndexOfProcessById(list:Process[], id:number){
        let searchedIndex=-1;
        for (var index in list) {
            if (list[index].id == id) {
                searchedIndex=Number(index);

            }
        }

        return searchedIndex;
    }

    /**
     * Fired when process is in edit mode
     *
     * @param process
     */
    edit(process:Process) {
        this.editedProcess = process;
        this.selectedModulo = process.module;
        this.selectedFactor = process.factor;
        this.selectedFunc = process.func;
        this.selectedLogicalFile = this.logicalFiles[process.classification];
        this.elementaryProcess = process.name;
        this.det = process.detStr;
        this.ret = process.retStr;
        document.getElementById("buttonAdd").innerText = "Accept changes";
    }


    removeTran(process){

        let searchedIndex=-1;
        for (var index in this.listOfTranProcess) {
            if (this.listOfTranProcess[index].id == process.id) {
                searchedIndex=Number(index);

            }
        }
        if (searchedIndex>=0) {
            this.listOfTranProcess.splice(searchedIndex,1);
            this.recalculateTranTotals();
        }
    }


    recalculateSummary(){
        this.summary[LogicalFile.ILF] = this.totals[LogicalFile.ILF];
        this.summary[LogicalFile.EIF] = this.totals[LogicalFile.EIF];
        this.summary[OutputTypes.EO] = this.totalsTran[OutputTypes.EO-2];
        this.summary[OutputTypes.EI] = this.totalsTran[OutputTypes.EI-2];
        this.summary[OutputTypes.EQ] = this.totalsTran[OutputTypes.EQ-2];
        this.totalRow.init();
        let index:any;
        for(index in this.summary){
            this.totalRow.low+=this.summary[index].low;
            this.totalRow.medium+=this.summary[index].medium;
            this.totalRow.high+=this.summary[index].high;
            this.totalRow.total+=this.summary[index].total;
            this.totalRow.pf+=this.summary[index].pf;
        }
    }



    recalculateTotals() {
        this.totals[LogicalFile.ILF].init();
        this.totals[LogicalFile.EIF].init();
        this.listOfProcess.forEach(process => {
            switch(process.complexity) {
                case Complexity.LOW:
                    this.totals[process.classification].low++;
                    break;
                case Complexity.MEDIUM:
                    this.totals[process.classification].medium++;
                    break;
                case Complexity.HIGH:
                    this.totals[process.classification].high++;
                    break;
            };

            this.totals[process.classification].total++;
            this.totals[process.classification].pf+=process.pf;
        });
        this.recalculateSummary();
    }


    recalculateTranTotals() {
        this.totalsTran[OutputTypes.EO-2].init();
        this.totalsTran[OutputTypes.EI-2].init();
        this.totalsTran[OutputTypes.EQ-2].init();
        this.listOfTranProcess.forEach(process => {
            switch(process.complexity) {
                case Complexity.LOW:
                    this.totalsTran[process.classification-2].low++;
                    break;
                case Complexity.MEDIUM:
                    this.totalsTran[process.classification-2].medium++;
                    break;
                case Complexity.HIGH:
                    this.totalsTran[process.classification-2].high++;
                    break;
            };

            this.totalsTran[process.classification-2].total++;
            this.totalsTran[process.classification-2].pf+=process.pf;
        });
        this.recalculateSummary();
    }



    registerChangeInModulos() {
        this.eventSubscriber = this.eventManager.subscribe('moduloListModification', (response) => this.reloadModulesList());
    }

    registerChangeInFunc() {
        this.eventFuncSubscriber = this.eventManager.subscribe('funcionalidadeListModification', (response) => this.reloadFuncList());
    }


}

@Component({
    selector: 'jhi-analise-popup',
    template: ''
})
export class AnalisePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private analisePopupService: AnalisePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.analisePopupService
                    .open(AnaliseDialogComponent, params['id']);
            } else {
                this.modalRef = this.analisePopupService
                    .open(AnaliseDialogComponent);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}

/**
 * Class that represent simple Object with ID and title
 */
class IdTitle{

    public id:number;
    public title:String;

    constructor(id:number, title:String){
        this.id=id;
        this.title=title;
    }
}

/**
 * Class that represent one record of table with total counts
 */
class TotalRecord{
    public input:number; // Define first column in record
    public low:number=0;
    public medium:number=0;
    public high:number=0;
    public total:number=0;
    public pf:number=0;

    constructor(input:number) {
        this.input=input;
    }

    public init(){
        this.low=0;
        this.medium=0;
        this.high=0;
        this.total=0;
        this.pf=0;
    }
}
