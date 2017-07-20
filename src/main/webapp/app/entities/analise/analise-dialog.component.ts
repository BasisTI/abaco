import {Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, ElementRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';

import {Analise, MetodoContagem} from './analise.model';
import { AnalisePopupService } from './analise-popup.service';
import { AnaliseService } from './analise.service';
import { Sistema, SistemaService } from '../sistema';
import { FuncaoDados, FuncaoDadosService } from '../funcao-dados';
import { FuncaoTransacao, FuncaoTransacaoService } from '../funcao-transacao';

import { Funcionalidade, FuncionalidadeService } from '../funcionalidade';
import { Modulo, ModuloService } from '../modulo';
import {Complexity, LogicalFile, OutputTypes} from "./enums";
import {Process, UploadedFile} from "./process.model";
import {TabsetComponent} from "ngx-bootstrap";
import {FatorAjuste} from "../fator-ajuste/fator-ajuste.model";
import {Subscription} from "rxjs/Subscription";
import {FatorAjusteService} from "../fator-ajuste/fator-ajuste.service";
import {Complexidade, TipoFuncaoDados} from "../funcao-dados/funcao-dados.model";
import {Organizacao} from "../organizacao/organizacao.model";
import {Contrato} from "../contrato/contrato.model";
import {ContratoService} from "../contrato/contrato.service";
import {OrganizacaoService} from "../organizacao/organizacao.service";
import {ModalComponent} from "ng2-bs3-modal/ng2-bs3-modal";

@Component({
    selector: 'jhi-analise-dialog',
    templateUrl: './analise-dialog.component.html'

})
export class AnaliseDialogComponent implements OnInit {

    private UPLOADED_FILE_MAX_SIZE:number = 15000000;

    analise: Analise = new Analise();
    authorities: any[];
    isSaving: boolean;

    sistemas: Sistema[];

    organizations:Organizacao[];
    contracts:Contrato[];
    funcaodados: FuncaoDados[];
    funcaotransacaos: FuncaoTransacao[];

    @ViewChild('staticTabs') staticTabs: TabsetComponent;

    @ViewChild('modal') modal1: ModalComponent;

    // Define that RET and DET are disabled/enabled
    is_disabled:boolean=false;

    // Define that RET and DET are disabled/enabled in FuncaoTransacao tab
    is_disabledTran:boolean=false;


    factors: FatorAjuste[];
    funcionalidades: Funcionalidade[];
    filteredFunc: Funcionalidade[];
    filteredTranFunc: Funcionalidade[];
    allModules: Modulo[];
    modules: Modulo[];
    eventSubscriber: Subscription;
     eventFuncSubscriber: Subscription;
    selectedModulo: Modulo;
    selectedFunc: Funcionalidade;
    selectedFactor: FatorAjuste;
    selectedLogicalFile: IdTitle;
    selectedOutputType: IdTitle;
    sustantationTran:String;
    sustantation:String;

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
    previousCountingType:any;

    editedProcess:Process=null; // Define the process that it is in editabled mode
    editedTranProcess:Process=null;

    files:UploadedFile[]=[]; // List of uploaded files
    filesTran:UploadedFile[]=[];
    hasBaseDropZoneOverTran: boolean = false;
    allowedExtensions:String[] = ['png', 'jpg', 'pdf', 'doc', 'docx', 'odt', 'gif'];
    uploadFile: String;
    hasBaseDropZoneOver: boolean = false;
    options: Object = {
        url: '/upload',
        //filterExtensions: true,
        //allowedExtensions: ['png', 'jpg', 'pdf', 'doc', 'docx', 'odt', 'gif']
    };

    optionsTran: Object = {
        url: '/upload',
        //filterExtensions: true,
        //allowedExtensions: ['png', 'jpg', 'pdf', 'doc', 'docx', 'odt', 'gif']
    };

    constructor(
       // public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private alertService: AlertService,
        private analiseService: AnaliseService,
        private sistemaService: SistemaService,
        private funcaoDadosService: FuncaoDadosService,
        private funcaoTransacaoService: FuncaoTransacaoService,
        private eventManager: EventManager,
        private funcionalidadeService: FuncionalidadeService,
        private moduloService: ModuloService,
        private fatorAjusteService:FatorAjusteService,
        private route: ActivatedRoute,
        private contratoService:ContratoService,
        private organizationService:OrganizacaoService,
        private router: Router,
        private changeDetector: ChangeDetectorRef
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

        //this.contratoService.query().subscribe(
        //    (res: Response) => { this.contracts = res.json(); }, (res: Response) => this.onError(res.json()));

        this.organizationService.query().subscribe(
            (res: Response) => { this.organizations = res.json(); }, (res: Response) => this.onError(res.json()));

        this.route.params.subscribe(params => {
            if (params['id']!=0) {
                this.load(params['id']);
            } else {
                this.moduloService.query().subscribe(
                    (res: Response) => { this.allModules = res.json();  this.onSystemChange(null);}, (res: Response) => this.onError(res.json()));
            }
        });


        //alert(JSON.stringify(this.jhiLanguageService));
    }


    clear () {
        //window.history.back();
        this.router.navigate(['analise'])
       // this.activeModal.dismiss('cancel');
    }


    /**
     *
     * Load analise by ID
     *
     * @param id
     */
    load(id){
        this.analiseService.find(id).subscribe(analise=>{
        this.analise=analise;
        this.organizationSelect(null);

        this.moduloService.query().subscribe(
            (res: Response) => { this.allModules = res.json();  this.onSystemChange(null);}, (res: Response) => this.onError(res.json()));
        this.registerChangeInModulos();
        this.registerChangeInFunc();


        if (this.analise.funcaoTransacaos!=null) {
            this.analise.funcaoTransacaos.forEach(f=>{
                let process:Process = new Process();
                process.convertFromTransacao(f, this.analise.tipoContagem);
                this.listOfTranProcess.push(process);
            });
        }
        this.recalculateTranTotals();

        if (this.analise.funcaoDados!=null) {

            for (var index in this.analise.funcaoDados) {
                let funcaoDados:FuncaoDados = this.analise.funcaoDados[index] as FuncaoDados;
                let process:Process = new Process();
                process.id = funcaoDados.id;
                process.pf = funcaoDados.pf;
                process.func = funcaoDados.funcionalidade;
                process.factor = funcaoDados.fatorAjuste;
                process.module = funcaoDados.funcionalidade.modulo;
                process.detStr = funcaoDados.detStr;
                process.retStr = funcaoDados.retStr;
                process.name = funcaoDados.name;
                process.sustantation = funcaoDados.sustantation;
                process.files = [].concat(funcaoDados.files);

                if (funcaoDados.tipo.toString() == 'ALI') {
                    process.classification = LogicalFile.ILF;
                } else {
                    process.classification = LogicalFile.EIF;
                }
                switch (funcaoDados.complexidade) {
                    case Complexidade.SEM: process.complexity = Complexity.NONE;break;
                    case Complexidade.BAIXA: process.complexity = Complexity.LOW; break;
                    case Complexidade.MEDIA: process.complexity = Complexity.MEDIUM; break;
                    case Complexidade.ALTA: process.complexity = Complexity.HIGH; break;
                }

                process.calculate(this.analise.tipoContagem);
                this.listOfProcess.push(process);

            }
            this.recalculateTotals();

            }

        });

    }



    organizationSelect(event){
        if (!this.analise.organizacao){
            return;
        }
       this.sistemaService.findByOrganization(this.analise.organizacao).subscribe(
           (res: Response) => {
               this.sistemas = res.json();
               if (event) {
                   this.analise.sistema=null;
               }
           }, (res: Response) => this.onError(res.json()));

       this.contratoService.findByOrganization(this.analise.organizacao).subscribe(
           (res: Response) => {
               this.contracts = res.json();
               if (event) {
                   this.analise.contrato=null;
                }
           }, (res: Response) => this.onError(res.json()));
    }


    /**
     * Convert process list to FuncaoDados entity
     */
    prepareFuncaoDadosArray(){

        this.analise.funcaoDados = [];
        this.listOfProcess.forEach(process => {
        let funcaoDados:FuncaoDados = new FuncaoDados();
            funcaoDados.convertFromProcess(process);
            this.analise.funcaoDados.push(funcaoDados);
        });
    }


    prepareFuncaoTransacaoArray(){

        this.analise.funcaoTransacaos = [];
        this.listOfTranProcess.forEach(process => {
            let funcaoTransacao:FuncaoTransacao = new FuncaoTransacao();
            funcaoTransacao.convertFromProcess(process);
            this.analise.funcaoTransacaos.push(funcaoTransacao);
        });
    }


    save () {
        this.prepareFuncaoDadosArray();
        this.prepareFuncaoTransacaoArray();
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
        this.router.navigate(['analise'])

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


    /**
     *
     * Select system event
     *
     * @param item
     */
    onSystemChange(item:any){
        if (this.analise==null || this.analise.sistema==null) {
            return;
        }
        this.modules = this.allModules.filter(m=>{
            return m.sistema.id=this.analise.sistema.id;
        });

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
        if (this.files.length>0 && (this.sustantation=="" || this.sustantation==null)){
            //alert("You have attached some files. Please fill field 'Sustantation'");
            this.alertService.error("You have attached some files. Please fill field 'Sustantation'",null,null);
            return;
        }
        let newProcess = (this.editedProcess!=null)? this.editedProcess: new Process();
        if (this.editedProcess==null) newProcess.id = new Date().getTime();
        newProcess.factor = this.selectedFactor;
        newProcess.module = this.selectedModulo;
        newProcess.func = this.selectedFunc;
        newProcess.classification = this.selectedLogicalFile.id;
        newProcess.name = this.elementaryProcess;
        newProcess.retStr = this.ret;
        newProcess.detStr = this.det;
        newProcess.sustantation= this.sustantation;
        newProcess.files=[];
        newProcess.files = newProcess.files.concat(this.files);
        this.files = [];
        newProcess.calculate(this.analise.tipoContagem);
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
        if (this.filesTran.length>0 && (this.sustantationTran=="" || this.sustantationTran==null)){
            alert("You have attached some files. Please fill field 'Sustantation'");
            return;
        }
        let newProcess = (this.editedTranProcess!=null)? this.editedTranProcess: new Process();
        if (this.editedTranProcess==null) newProcess.id = new Date().getTime();
        newProcess.id = new Date().getTime();
        newProcess.factor = this.selectedTranFactor;
        newProcess.module = this.selectedTranModulo;
        newProcess.func = this.selectedTranFunc;
        newProcess.classification = this.selectedOutputType.id;
        newProcess.name = this.elementaryTranProcess;
        newProcess.sustantation = this.sustantationTran;
        newProcess.retStr = this.retTran;
        newProcess.detStr = this.detTran;
        newProcess.files = [].concat(this.filesTran);
        this.filesTran = [];
        newProcess.calculateTran(this.analise.tipoContagem);
        if (this.editedTranProcess==null) {
            this.listOfTranProcess.push(newProcess);
        } else {
            let searchedIndex=this.getIndexOfProcessById(this.listOfTranProcess,this.editedTranProcess.id);
            if (searchedIndex>=0) {
                this.listOfTranProcess[searchedIndex] = newProcess;
            }
        }
        this.recalculateTranTotals();
        this.editedTranProcess = null;
        document.getElementById("buttonAddTran").innerText = "Adicionar";
    }


    remove(process){
        let searchedIndex=this.getIndexOfProcessById(this.listOfProcess,process.id);
        if (searchedIndex>=0) {
            this.listOfProcess.splice(searchedIndex,1);
            this.recalculateTotals();
        }
    }


    /**
     *
     * Find index of process in array by Id. If not found - return -1
     *
     * @param list
     *           given list of processes
     * @param id
     *          the id of searched process
     * @returns {number}
     *           index of process. If process not found - will be returned -1
     */
    getIndexOfProcessById(list:Process[], id:number){
        let searchedIndex=-1;
        searchedIndex = list.findIndex(process=>{
           return process.id == id;
        });
        return searchedIndex;
    }


    cast<T>(obj, cl): T {
        obj.__proto__ = cl.prototype;
        return obj;
    }



    checkIfAlreadyUploaded(files:UploadedFile[], file:UploadedFile){
        let result:boolean=false;
        let index:number = -1;
        index = files.findIndex(f=>{
            return f.originalName==file.originalName;
        });
        return index>=0;
    }


    handleUpload(data): void {
        if (data && data.response) {
            //data = JSON.parse(data.response);
            //this.uploadFile = data;
            //alert(JSON.stringify(data));
            let file:UploadedFile = this.cast<UploadedFile>(JSON.parse(data.response),UploadedFile);
            if (this.staticTabs.tabs[1].active){
                if (!this.checkIfAlreadyUploaded(this.files,file)) {
                    this.files.push(file);
                }
            } else {
                if (!this.checkIfAlreadyUploaded(this.filesTran,file)) {
                    this.filesTran.push(file);
                }
            }

            this.uploadFile = "";

        }
    }

    fileOverBase(e:any):void {
        this.hasBaseDropZoneOver = e;
    }



    beforeUpload(uploadingFile): void {
        //alert(JSON.stringify(uploadingFile));
        if (uploadingFile.size > this.UPLOADED_FILE_MAX_SIZE) {
            uploadingFile.setAbort();
            alert('File is too large');
            return;
        }


        let ext:String = uploadingFile.originalName.split('.').pop();

        if (!(this.allowedExtensions.find(e=>{
           return e.toLocaleLowerCase().trim()==ext.trim();
        }))){
            uploadingFile.setAbort();
            alert('This file type is not supported.');
            return;
        };

        let index:number=-1;
        if (this.staticTabs.tabs[1].active) {
            index = this.files.findIndex(f => {
                return f.originalName == uploadingFile.originalName;
            });
        } else {
            index = this.filesTran.findIndex(f => {
                return f.originalName == uploadingFile.originalName;
            });
        }
        if (index>=0){
            uploadingFile.setAbort();
            alert('File already exists...');
        }


    }


    handleTranUpload(data): void {
        if (data && data.response) {
            let file:any = JSON.parse(data.response);
            this.filesTran.push(file);
        }
    }

    fileTranOverBase(e:any):void {
        this.hasBaseDropZoneOverTran = e;
    }



    beforeTranUpload(uploadingFile): void {
        if (uploadingFile.size > this.UPLOADED_FILE_MAX_SIZE) {
            uploadingFile.setAbort();
            alert('File is too large');
            return;
        }

        if (this.filesTran.find(f=>{
                return f.originalName==uploadingFile.originalName;
            })){
            uploadingFile.setAbort();
            alert('File already exists...');
        }

    }



    removeFile(file) {
        //alert(JSON.stringify(file));
        let index:number=-1;
        index=this.files.findIndex(f=>{
           return f.id==file.id;
        });

        //alert('223344');
        if (index>=0) {
            this.files.splice(index,1);
        }
    }


    removeTranFile(file) {

        let index:number=-1;
        index=this.filesTran.findIndex(f=>{
            return f.id==file.id;
        });


        if (index>=0) {
            this.filesTran.splice(index,1);
        }
    }


    getFactorTitle(factor:FatorAjuste){
        let f:FatorAjuste = this.cast<FatorAjuste>(factor, FatorAjuste);
        return f.getTitleWithValue();
    }


    // Disable or enable RET and DET fields according to selected Fator Adjuste
    onFactorChange(factor:FatorAjuste){
        if (this.selectedFactor==null) {
            this.is_disabled=false;
            return;
        }

        if (this.selectedFactor.tipoAjuste.toString()=='PERCENTUAL') {
            this.is_disabled=false;
        } else {
            this.det="";
            this.ret="";
            this.is_disabled=true;
        }
    }


    // Disable or enable RET and DET for FuncaoDados fields according to selected Fator Adjuste
    onFactorChangeTran(factor:FatorAjuste){
        if (this.selectedTranFactor==null) {
            this.is_disabledTran=false;
            return;
        }

        if (this.selectedTranFactor.tipoAjuste.toString()=='PERCENTUAL') {
            this.is_disabledTran=false;
        } else {
            this.detTran="";
            this.retTran="";
            this.is_disabledTran=true;
        }
    }



    savePreviousValue(){
     this.previousCountingType = this.analise.tipoContagem;
    }


    onCountingTypeConfirm(){
        this.listOfProcess = [];
        this.listOfTranProcess = [];

        if (this.analise.tipoContagem.toString() == "INDICATIVA") {
            this.is_disabled = true;
            this.staticTabs.tabs[2].disabled = true;
        } else {
            this.is_disabled = false;
            this.staticTabs.tabs[2].disabled = false;
        }
    }



    oncOuntingTypeDismiss(){
        let p = this.previousCountingType;
        //alert(JSON.stringify(p));
        this.analise.tipoContagem=null;
        this.changeDetector.detectChanges();
        this.analise.tipoContagem=p;
        this.changeDetector.detectChanges();
    }

    /**
     *  Counting type is changed
     */
    onCountingTypeChange(type){
        //Clear lists with processes
        //let s:string = document.getElementById("confirmText").innerText;
        //alert(JSON.stringify(this.modal1));
        this.modal1.open();

    }


    onContractChange(type){
        this.recalculateSummary();
    }





    getModuleById(id:number){
         let module:Modulo = null;
        this.modules.forEach(m=>{
           if (m.id==id) module=m;
        });
        return module;
    }

    getFuncById(id:number){
        let func:Funcionalidade = null;
        this.filteredFunc.forEach(f=>{
            if (f.id==id) func=f;
        });
        return func;
    }



    getFuncTranById(id:number){
        let func:Funcionalidade = null;
        this.filteredTranFunc.forEach(f=>{
            if (f.id==id) func=f;
        });
        return func;
    }

    getFactorsById(id:number){
        let factor:FatorAjuste = null;
        this.factors.forEach(f=>{
            if (f.id==id) factor=f;
        });
        return factor;
    }

    /**
     * Fired when process is in edit mode
     *
     * @param process
     */
    edit(process:Process) {
        this.editedProcess = process;
        this.selectedModulo = this.getModuleById(process.module.id);
        this.filteredFunc = this.filteredFunctionsByModule(this.selectedModulo);
        this.selectedFactor = (process.factor!=null)?this.getFactorsById(process.factor.id):null;
        this.selectedFunc = this.getFuncById(process.func.id);
        this.selectedLogicalFile = this.logicalFiles[process.classification];
        this.elementaryProcess = process.name;
        this.sustantation = process.sustantation;
        this.files=[];
        if (process.files!=null) {
            this.files = this.files.concat(process.files);
        }
        this.det = process.detStr;
        this.ret = process.retStr;
        document.getElementById("buttonAdd").innerText = "Accept changes";
    }

    /**
     * Fired when process is in edit mode
     *
     * @param process
     */
    editTran(process:Process) {
        this.editedTranProcess = process;
        this.selectedTranModulo = this.getModuleById(process.module.id);
        this.filteredTranFunc = this.filteredFunctionsByModule(this.selectedTranModulo);
        this.selectedTranFactor = (process.factor!=null)?this.getFactorsById(process.factor.id):null;
        this.selectedTranFunc = this.getFuncTranById(process.func.id);
        this.selectedOutputType = this.outputTypes[process.classification-2];
        this.elementaryTranProcess = process.name;
        this.sustantationTran = process.sustantation;
        this.detTran = process.detStr;
        this.retTran = process.retStr;
        if (process.files!=null) {
            this.filesTran = [].concat(process.files);
        }
        document.getElementById("buttonAddTran").innerText = "Accept changes";
    }



    removeTran(process){

        let searchedIndex=-1;

        searchedIndex = this.listOfTranProcess.findIndex(p=>{
            return p.id == process.id;
        });

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
            this.totalRow.none+=this.summary[index].none;
            this.totalRow.low+=this.summary[index].low;
            this.totalRow.medium+=this.summary[index].medium;
            this.totalRow.high+=this.summary[index].high;
            this.totalRow.total+=this.summary[index].total;
            this.totalRow.pf+=this.summary[index].pf;
        }
      let adjustTotal = this.totalRow.pf;
      if (this.analise.contrato!=null && this.analise.contrato.manual!=null && this.analise.contrato.manual) {
          if (this.analise.tipoContagem.toString()=="ESTIMADA") {
              adjustTotal+=adjustTotal*this.analise.contrato.manual.valorVariacaoEstimada;
          }
          if (this.analise.tipoContagem.toString()=="INDICATIVA") {
              adjustTotal+=adjustTotal*this.analise.contrato.manual.valorVariacaoIndicativa;
          }

          this.analise.valorAjuste = adjustTotal-this.totalRow.pf;
      }
      this.analise.adjustPFTotal = adjustTotal.toFixed(2).toString();
      this.analise.pfTotal = this.totalRow.pf.toFixed(2).toString();
    }



    recalculateTotals() {
        this.totals[LogicalFile.ILF].init();
        this.totals[LogicalFile.EIF].init();
        this.listOfProcess.forEach(process => {
            switch(process.complexity) {
                case Complexity.NONE:
                    this.totals[process.classification].none++;
                    break;
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
                case Complexity.NONE:
                    this.totalsTran[process.classification-2].none++;
                    break;
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


    public humanFileSize(size:number) {
        var thresh = 1024;
        if(Math.abs(size) < thresh) {
            return size + ' B';
        }
        var units =  ['kB','MB','GB','TB','PB','EB','ZB','YB'];
        var u = -1;
        do {
            size /= thresh;
            ++u;
        } while(Math.abs(size) >= thresh && u < units.length - 1);
        return size.toFixed(1)+' '+units[u];
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
    public none:number=0;

    constructor(input:number) {
        this.input=input;
    }

    public init(){
        this.none=0;
        this.low=0;
        this.medium=0;
        this.high=0;
        this.total=0;
        this.pf=0;
    }
}
