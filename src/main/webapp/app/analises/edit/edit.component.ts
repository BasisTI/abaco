import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap';
import { FatorAjuste, FatorAjusteService } from '../../entities/fator-ajuste';
import { Response } from '@angular/http';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';
import { Funcionalidade, FuncionalidadeService } from '../../entities/funcionalidade';
import { Modulo, ModuloService } from '../../entities/modulo';
import {Complexity, LogicalFile, OutputTypes} from "./enums";
import {Process} from "./process.model";
import Any = jasmine.Any;


@Component({
    selector: 'jhi-analisedit',
    templateUrl: './edit.component.html'
})

export class AnalisEditComponent implements OnInit {

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


    logicalFiles:Object[];
    outputTypes:Object[];
    complexities:String[];
    elementaryProcess:String ="";
    elementaryTranProcess:String ="";
    ret:String = "0";
    det:String = "0";
    retTran:String = "0";
    detTran:String = "0";
    listOfProcess:Process[]=[];
    listOfTranProcess:Process[]=[];
    selectedProcess:Process;
    totals:TotalRecord[];
    totalsTran:TotalRecord[];


    constructor(
        private alertService: AlertService,
        private funcionalidadeService: FuncionalidadeService,
        private moduloService: ModuloService,
        private eventManager: EventManager,
        private  fatorAjusteService:FatorAjusteService
    ){
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
        //alert(JSON.stringify(this.complexities));
        this.selectedProcess = null;
        this.totals = [];
        this.totalsTran = [];
        this.initTotalsTable();
    };


    /**
     * Init summary tables
     */
    initTotalsTable(){
        this.totals[LogicalFile.ILF] = new TotalRecord(LogicalFile.ILF);
        this.totals[LogicalFile.EIF] = new TotalRecord(LogicalFile.EIF);
        this.totalsTran[OutputTypes.EI] = new TotalRecord(OutputTypes.EI);
        this.totalsTran[OutputTypes.EO] = new TotalRecord(OutputTypes.EO);
        this.totalsTran[OutputTypes.EQ] = new TotalRecord(OutputTypes.EQ);
    }




    ngOnInit () {
        this.fatorAjusteService.query().subscribe(
            (res: Response) => { this.factors = res.json(); }, (res: Response) => this.onError(res.json()));
        this.funcionalidadeService.query().subscribe(
            (res: Response) => { this.funcionalidades = res.json(); }, (res: Response) => this.onError(res.json()));
        this.moduloService.query().subscribe(
            (res: Response) => { this.modules = res.json(); }, (res: Response) => this.onError(res.json()));
        this.registerChangeInModulos();
        this.registerChangeInFunc()
    }


    private onError (error) {
        this.alertService.error(error.message, null, null);
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
        let newProcess = new Process();
        newProcess.id = new Date().getTime();
        newProcess.factor = this.selectedFactor;
        newProcess.module = this.selectedModulo;
        newProcess.func = this.selectedFunc;
        newProcess.classification = this.selectedLogicalFile.id;
        newProcess.name = this.elementaryProcess;
        newProcess.ret = Number(this.ret);
        newProcess.det = Number(this.det);
        newProcess.calculate();
        this.listOfProcess.push(newProcess);
        this.recalculateTotals();
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
        newProcess.ret = Number(this.retTran);
        newProcess.det = Number(this.detTran);
        newProcess.calculateTran();
        this.listOfTranProcess.push(newProcess);
        this.recalculateTranTotals();
    }

    remove(process){

        let searchedIndex=-1;
        for (var index in this.listOfProcess) {
            if (this.listOfProcess[index].id == process.id) {
                searchedIndex=Number(index);

            }
        }
        if (searchedIndex>=0) {
            this.listOfProcess.splice(searchedIndex,1);
            this.recalculateTotals();
        }
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
    }


    recalculateTranTotals() {
        this.totalsTran[OutputTypes.EO].init();
        this.totalsTran[OutputTypes.EI].init();
        this.totalsTran[OutputTypes.EQ].init();
        this.listOfTranProcess.forEach(process => {
            switch(process.complexity) {
                case Complexity.LOW:
                    this.totalsTran[process.classification].low++;
                    break;
                case Complexity.MEDIUM:
                    this.totalsTran[process.classification].medium++;
                    break;
                case Complexity.HIGH:
                    this.totalsTran[process.classification].high++;
                    break;
            };

            this.totalsTran[process.classification].total++;
            this.totalsTran[process.classification].pf+=process.pf;
        });
    }



    registerChangeInModulos() {
        this.eventSubscriber = this.eventManager.subscribe('moduloListModification', (response) => this.reloadModulesList());
    }

    registerChangeInFunc() {
        this.eventFuncSubscriber = this.eventManager.subscribe('funcionalidadeListModification', (response) => this.reloadFuncList());
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
