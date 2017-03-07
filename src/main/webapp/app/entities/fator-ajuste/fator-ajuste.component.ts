import { Component, OnInit, OnDestroy } from '@angular/core';
import { Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager, ParseLinks, PaginationUtil, JhiLanguageService, AlertService } from 'ng-jhipster';

import { FatorAjuste } from './fator-ajuste.model';
import { FatorAjusteService } from './fator-ajuste.service';
import { ITEMS_PER_PAGE, Principal } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

@Component({
    selector: 'jhi-fator-ajuste',
    templateUrl: './fator-ajuste.component.html'
})
export class FatorAjusteComponent implements OnInit, OnDestroy {
fatorAjustes: FatorAjuste[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private fatorAjusteService: FatorAjusteService,
        private alertService: AlertService,
        private eventManager: EventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
        this.jhiLanguageService.setLocations(['fatorAjuste', 'tipoFatorAjuste', 'impactoFatorAjuste']);
    }

    loadAll() {
        if (this.currentSearch) {
            this.fatorAjusteService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: Response) => this.fatorAjustes = res.json(),
                    (res: Response) => this.onError(res.json())
                );
            return;
       }
        this.fatorAjusteService.query().subscribe(
            (res: Response) => {
                this.fatorAjustes = res.json();
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
        this.registerChangeInFatorAjustes();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId (index: number, item: FatorAjuste) {
        return item.id;
    }



    registerChangeInFatorAjustes() {
        this.eventSubscriber = this.eventManager.subscribe('fatorAjusteListModification', (response) => this.loadAll());
    }


    private onError (error) {
        this.alertService.error(error.message, null, null);
    }
}
