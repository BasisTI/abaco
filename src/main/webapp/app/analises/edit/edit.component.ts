import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';

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
    modules: Modulo[];


    constructor(
        private alertService: AlertService,
        private funcionalidadeService: FuncionalidadeService,
        private moduloService: ModuloService,
        private  fatorAjusteService:FatorAjusteService
    ){};
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
    }


    private onError (error) {
        this.alertService.error(error.message, null, null);
    }

}
