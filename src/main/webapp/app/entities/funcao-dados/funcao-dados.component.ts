import { Component, OnInit, OnDestroy } from '@angular/core';
import { Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager, ParseLinks, PaginationUtil, JhiLanguageService, AlertService } from 'ng-jhipster';

import { FuncaoDados } from './funcao-dados.model';
import { FuncaoDadosService } from './funcao-dados.service';
import { ITEMS_PER_PAGE, Principal } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

@Component({
    selector: 'jhi-funcao-dados',
    templateUrl: './funcao-dados.component.html'
})
export class FuncaoDadosComponent implements OnInit, OnDestroy {
funcaoDados: FuncaoDados[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private funcaoDadosService: FuncaoDadosService,
        private alertService: AlertService,
        private eventManager: EventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
        this.jhiLanguageService.setLocations(['funcaoDados', 'tipoFuncaoDados', 'complexidade']);
    }

    loadAll() {
        if (this.currentSearch) {
            this.funcaoDadosService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: Response) => this.funcaoDados = res.json(),
                    (res: Response) => this.onError(res.json())
                );
            return;
       }
        this.funcaoDadosService.query().subscribe(
            (res: Response) => {
                this.funcaoDados = res.json();
                this.currentSearch = '';
            },
            (res: Response) => this.onError(res.json())
        );
    }

    search (query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
        this.loadAll();
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInFuncaoDados();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId (index: number, item: FuncaoDados) {
        return item.id;
    }



    registerChangeInFuncaoDados() {
        this.eventSubscriber = this.eventManager.subscribe('funcaoDadosListModification', (response) => this.loadAll());
    }


    private onError (error) {
        this.alertService.error(error.message, null, null);
    }
}
