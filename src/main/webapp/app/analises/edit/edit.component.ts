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
import {Complexity, LogicalFile} from "./enums";
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

    selectedTranModulo: Modulo;
    selectedTranFunc: Funcionalidade;
    selectedTranFactor: FatorAjuste;


    logicalFiles:Object[];
    complexities:String[];
    elementaryProcess:String ="";
    ret:String = "0";
    det:String = "0";
    listOfProcess:Process[]=[];
    selectedProcess:Process;
    totals:TotalRecord[];


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
        this.logicalFiles = Object.keys(LogicalFile).filter(v=> v==String(Number(v))).map(k => new IdTitle(Number(k),LogicalFile[k]));
        this.complexities = Object.keys(Complexity).filter(v=> v==String(Number(v))).map(k => Complexity[k]);
        //alert(JSON.stringify(this.complexities));
        this.selectedProcess = null;
        this.totals = [];
        this.initTotalsTable();
    };


    initTotalsTable(){
        let row1 = new TotalRecord();
        row1.input = LogicalFile.ILF
        let row2 = new TotalRecord();
        row2.input = LogicalFile.EIF
        this.totals[LogicalFile.ILF] = row1;
        this.totals[LogicalFile.EIF] = row2;
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



    refreshFunctionsList(){
        if (this.selectedModulo==null) {
            this.filteredFunc = [];
            this.selectedFunc = null;
        }
        this.filteredFunc=this.funcionalidades.filter(f=>{
            return f.modulo.id==this.selectedModulo.id;
        });
    }


    onModuleChange(item:any)
    {
        this.refreshFunctionsList();
        this.selectedFunc = null;
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
                }, (res: Response) => this.onError(res.json()));
    }



    reloadFuncList(){
        this.funcionalidadeService.query().subscribe(
            (res: Response) => {
                this.funcionalidades = res.json();
                this.onModuleChange(null);
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

    public init(){
        this.low=0;
        this.medium=0;
        this.high=0;
        this.total=0;
        this.pf=0;
    }
}
