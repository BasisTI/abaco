import { Component, OnInit, OnDestroy } from '@angular/core';
import { Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager, ParseLinks, PaginationUtil, JhiLanguageService, AlertService } from 'ng-jhipster';

import { Contrato } from './contrato.model';
import { ContratoService } from './contrato.service';
import { ITEMS_PER_PAGE, Principal } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import {Organizacao} from "../organizacao/organizacao.model";
import {OrganizacaoService} from "../organizacao/organizacao.service";

@Component({
    selector: 'jhi-contrato',
    templateUrl: './contrato.component.html'
})
export class ContratoComponent implements OnInit, OnDestroy {
contratoes: Contrato[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;


    constructor(
        private jhiLanguageService: JhiLanguageService,
        private contratoService: ContratoService,
        private alertService: AlertService,
        private eventManager: EventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
        this.jhiLanguageService.setLocations(['contrato']);
    }

    loadAll() {
        if (this.currentSearch) {
            this.contratoService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: Response) => this.contratoes = res.json(),
                    (res: Response) => this.onError(res.json())
                );
            return;
       }



        this.contratoService.query().subscribe(
            (res: Response) => {
                this.contratoes = res.json();
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
        this.registerChangeInContratoes();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId (index: number, item: Contrato) {
        return item.id;
    }



    registerChangeInContratoes() {
        this.eventSubscriber = this.eventManager.subscribe('contratoListModification', (response) => this.loadAll());
    }


    private onError (error) {
        this.alertService.error(error.message, null, null);
    }
}
