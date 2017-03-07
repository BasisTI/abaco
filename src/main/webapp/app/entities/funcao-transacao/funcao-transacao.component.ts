import { Component, OnInit, OnDestroy } from '@angular/core';
import { Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager, ParseLinks, PaginationUtil, JhiLanguageService, AlertService } from 'ng-jhipster';

import { FuncaoTransacao } from './funcao-transacao.model';
import { FuncaoTransacaoService } from './funcao-transacao.service';
import { ITEMS_PER_PAGE, Principal } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

@Component({
    selector: 'jhi-funcao-transacao',
    templateUrl: './funcao-transacao.component.html'
})
export class FuncaoTransacaoComponent implements OnInit, OnDestroy {
funcaoTransacaos: FuncaoTransacao[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private funcaoTransacaoService: FuncaoTransacaoService,
        private alertService: AlertService,
        private eventManager: EventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
        this.jhiLanguageService.setLocations(['funcaoTransacao', 'tipoFuncaoTransacao', 'complexidade']);
    }

    loadAll() {
        if (this.currentSearch) {
            this.funcaoTransacaoService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: Response) => this.funcaoTransacaos = res.json(),
                    (res: Response) => this.onError(res.json())
                );
            return;
       }
        this.funcaoTransacaoService.query().subscribe(
            (res: Response) => {
                this.funcaoTransacaos = res.json();
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
        this.registerChangeInFuncaoTransacaos();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId (index: number, item: FuncaoTransacao) {
        return item.id;
    }



    registerChangeInFuncaoTransacaos() {
        this.eventSubscriber = this.eventManager.subscribe('funcaoTransacaoListModification', (response) => this.loadAll());
    }


    private onError (error) {
        this.alertService.error(error.message, null, null);
    }
}
