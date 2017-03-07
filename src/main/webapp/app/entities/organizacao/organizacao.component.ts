import { Component, OnInit, OnDestroy } from '@angular/core';
import { Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager, ParseLinks, PaginationUtil, JhiLanguageService, AlertService } from 'ng-jhipster';

import { Organizacao } from './organizacao.model';
import { OrganizacaoService } from './organizacao.service';
import { ITEMS_PER_PAGE, Principal } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

@Component({
    selector: 'jhi-organizacao',
    templateUrl: './organizacao.component.html'
})
export class OrganizacaoComponent implements OnInit, OnDestroy {
organizacaos: Organizacao[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private organizacaoService: OrganizacaoService,
        private alertService: AlertService,
        private eventManager: EventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
        this.jhiLanguageService.setLocations(['organizacao']);
    }

    loadAll() {
        if (this.currentSearch) {
            this.organizacaoService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: Response) => this.organizacaos = res.json(),
                    (res: Response) => this.onError(res.json())
                );
            return;
       }
        this.organizacaoService.query().subscribe(
            (res: Response) => {
                this.organizacaos = res.json();
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
        this.registerChangeInOrganizacaos();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId (index: number, item: Organizacao) {
        return item.id;
    }



    registerChangeInOrganizacaos() {
        this.eventSubscriber = this.eventManager.subscribe('organizacaoListModification', (response) => this.loadAll());
    }


    private onError (error) {
        this.alertService.error(error.message, null, null);
    }
}
