import { Component, OnInit, OnDestroy } from '@angular/core';
import { Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager, ParseLinks, PaginationUtil, JhiLanguageService, AlertService } from 'ng-jhipster';

import { EsforcoFase } from './esforco-fase.model';
import { EsforcoFaseService } from './esforco-fase.service';
import { ITEMS_PER_PAGE, Principal } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

@Component({
    selector: 'jhi-esforco-fase',
    templateUrl: './esforco-fase.component.html'
})
export class EsforcoFaseComponent implements OnInit, OnDestroy {
esforcoFases: EsforcoFase[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private esforcoFaseService: EsforcoFaseService,
        private alertService: AlertService,
        private eventManager: EventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
        this.jhiLanguageService.setLocations(['esforcoFase']);
    }

    loadAll() {
        if (this.currentSearch) {
            this.esforcoFaseService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: Response) => this.esforcoFases = res.json(),
                    (res: Response) => this.onError(res.json())
                );
            return;
       }
        this.esforcoFaseService.query().subscribe(
            (res: Response) => {
                this.esforcoFases = res.json();
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
        this.registerChangeInEsforcoFases();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId (index: number, item: EsforcoFase) {
        return item.id;
    }



    registerChangeInEsforcoFases() {
        this.eventSubscriber = this.eventManager.subscribe('esforcoFaseListModification', (response) => this.loadAll());
    }


    private onError (error) {
        this.alertService.error(error.message, null, null);
    }
}
