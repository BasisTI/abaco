import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager, ParseLinks, PaginationUtil, JhiLanguageService, AlertService } from 'ng-jhipster';

import { Modulo } from './modulo.model';
import { ModuloService } from './modulo.service';
import { ITEMS_PER_PAGE, Principal } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import { SistemaService } from '../sistema';
import { Sistema } from '../sistema/sistema.model';

@Component({
    selector: 'jhi-modulo',
    templateUrl: './modulo.component.html'
})
export class ModuloComponent implements OnInit, OnDestroy {
modulos: Modulo[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    @Input() sistema: Sistema;
    @Input() noCadastroDeSistema: boolean;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private moduloService: ModuloService,
        private alertService: AlertService,
        private eventManager: EventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal,
        private sistemaService: SistemaService
    ) {
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
        //this.jhiLanguageService.setLocations(['modulo']);

        
    }

    loadAll() {
        if (this.currentSearch) {
            /*this.moduloService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: Response) => this.modulos = res.json(),
                    (res: Response) => this.onError(res.json())
                );*/
            return;
       }
        if (this.noCadastroDeSistema){
          this.modulos = this.sistema.modulos;
          console.log('saiu');
          return;
        }

        this.moduloService.query().subscribe(
            (res: Response) => {
                this.modulos = res.json();
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
        if (this.moduloService.sistemaSendoCadastrado == undefined) {
            this.moduloService.sistemaSendoCadastrado = this.sistema;        
        }
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInModulos();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId (index: number, item: Modulo) {
        return item.id;
    }



    registerChangeInModulos() {
        this.eventSubscriber = this.eventManager.subscribe('moduloListModification', (response) => this.loadAll());
    }


    private onError (error) {
        this.alertService.error(error.message, null, null);
    }
}
