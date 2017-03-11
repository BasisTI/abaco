import { Component, OnInit, OnDestroy } from '@angular/core';
import { Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager, ParseLinks, PaginationUtil, JhiLanguageService, AlertService } from 'ng-jhipster';

import { Sistema } from './sistema.model';
import { SistemaService } from './sistema.service';
import { SistemaPopupService } from './sistema-popup.service';
import { SistemaDialogComponent } from './sistema-dialog.component';
import { ModuloService } from '../modulo/modulo.service';
import { ITEMS_PER_PAGE, Principal } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

@Component({
    selector: 'jhi-sistema',
    templateUrl: './sistema.component.html'
})
export class SistemaComponent implements OnInit, OnDestroy {
sistemas: Sistema[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private sistemaService: SistemaService,
        private alertService: AlertService,
        private eventManager: EventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal,
        private sistemaPopupService: SistemaPopupService,
        private moduloService: ModuloService
    ) {
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
        this.jhiLanguageService.setLocations(['sistema']);
    }

    loadAll() {
        if (this.currentSearch) {
            this.sistemaService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: Response) => this.sistemas = res.json(),
                    (res: Response) => this.onError(res.json())
                );
            return;
       }
        this.sistemaService.query().subscribe(
            (res: Response) => {
                this.sistemas = res.json();
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
        this.registerChangeInSistemas();
        this.registerChangeInModulosDeSistema();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId (index: number, item: Sistema) {
        return item.id;
    }

    chamarPopupSistema () {
        console.log('Chamar popup aqui.');
        this.sistemaPopupService.openParaEditar(SistemaDialogComponent,this.moduloService.sistemaSendoCadastrado);

    }

    registerChangeInModulosDeSistema () {
        this.eventSubscriber = this.eventManager.subscribe('changeInModulosDeSistema', (response) => this.chamarPopupSistema());
    }

    registerChangeInSistemas() {
        this.eventSubscriber = this.eventManager.subscribe('sistemaListModification', (response) => this.loadAll());
    }


    private onError (error) {
        this.alertService.error(error.message, null, null);
    }
}
