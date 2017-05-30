import { Component, OnInit, OnDestroy } from '@angular/core';
import { Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager, ParseLinks, PaginationUtil, JhiLanguageService, AlertService } from 'ng-jhipster';

import { Analise } from './analise.model';
import { AnaliseService } from './analise.service';
import { ITEMS_PER_PAGE, Principal } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

@Component({
    selector: 'jhi-analise',
    templateUrl: './analise.component.html',
    styleUrls: ['./analise-dialog.component.css']
})
export class AnaliseComponent implements OnInit, OnDestroy {
analises: Analise[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private analiseService: AnaliseService,
        private alertService: AlertService,
        private eventManager: EventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
        this.jhiLanguageService.setLocations(['analise', 'metodoContagem', 'tipoAnalise']);
    }

    loadAll() {
        if (this.currentSearch) {
            this.analiseService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: Response) => this.analises = res.json(),
                    (res: Response) => this.onError(res.json())
                );
            return;
       }
        this.analiseService.query().subscribe(
            (res: Response) => {
                this.analises = res.json();
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
        this.registerChangeInAnalises();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId (index: number, item: Analise) {
        return item.id;
    }



    registerChangeInAnalises() {
        this.eventSubscriber = this.eventManager.subscribe('analiseListModification', (response) => this.loadAll());
    }


    private onError (error) {
        this.alertService.error(error.message, null, null);
    }
}
