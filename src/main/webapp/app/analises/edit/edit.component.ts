import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { TabsetComponent } from 'ngx-bootstrap';
import { FatorAjuste, FatorAjusteService } from '../../entities/fator-ajuste';
import { Response } from '@angular/http';
import { EventManager, AlertService, JhiLanguageService } from 'ng-jhipster';
import { Funcionalidade, FuncionalidadeService } from '../../entities/funcionalidade';
import { Modulo, ModuloService } from '../../entities/modulo';


@Component({
    selector: 'jhi-analisedit',
    templateUrl: './edit.component.html'
})
export class AnalisEditComponent implements OnInit {

    @ViewChild('staticTabs') staticTabs: TabsetComponent;
    factors: FatorAjuste[];
    funcionalidades: Funcionalidade[];
    filteredFunc: Funcionalidade[];
    modules: Modulo[];
    eventSubscriber: Subscription;
    eventFuncSubscriber: Subscription;
    selectedModulo: Modulo;
    selectedFunc: Funcionalidade;

    constructor(
        private alertService: AlertService,
        private funcionalidadeService: FuncionalidadeService,
        private moduloService: ModuloService,
        private eventManager: EventManager,
        private  fatorAjusteService:FatorAjusteService
    ){
        this.selectedModulo=null;
        this.selectedFunc = null;
    };
    selectTab(tab_id: number) {
        this.staticTabs.tabs[tab_id].active = true;
    }

    disableEnable() {
        this.staticTabs.tabs[2].disabled = !this.staticTabs.tabs[2].disabled
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


    registerChangeInModulos() {
        this.eventSubscriber = this.eventManager.subscribe('moduloListModification', (response) => this.reloadModulesList());
    }

    registerChangeInFunc() {
        this.eventFuncSubscriber = this.eventManager.subscribe('funcionalidadeListModification', (response) => this.reloadFuncList());
    }

}
