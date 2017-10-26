import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager, ParseLinks, PaginationUtil, JhiLanguageService, AlertService } from 'ng-jhipster';

import {Analise, TipoAnalise} from './analise.model';
import { AnaliseService } from './analise.service';
import { ITEMS_PER_PAGE, Principal } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import {Organizacao} from "../organizacao/organizacao.model";
import {OrganizacaoService} from "../organizacao/organizacao.service";
import {ModalComponent} from "ng2-bs3-modal/ng2-bs3-modal";
import {SistemaService} from "../sistema/sistema.service";
import {Sistema} from "../sistema/sistema.model";

@Component({
    selector: 'jhi-analise',
    templateUrl: './analise.component.html'
})
export class AnaliseComponent implements OnInit, OnDestroy {

    REPORT_SIMPLE_TYPE:String="SIMPLE";
    REPORT_DETAILED_TYPE:String="DETAILED";
    currentAccount: any;
    analises: Analise[];
    error: any;
    success: any;
    eventSubscriber: Subscription;
    currentSearch: string;
    routeData: any;
    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    predicate: any;
    previousPage: any;
    reverse: any;
    selectedAnalise:Analise;
    organizations:Organizacao[];
    sistemas: Sistema[];
    selectType:String=this.REPORT_SIMPLE_TYPE;
    selectOrganization:Organizacao=null;
    selectSystema:Sistema=null;
    selectTipoAnalise:TipoAnalise=null;
    @ViewChild('reportModal') reportModal: ModalComponent;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private analiseService: AnaliseService,
        private parseLinks: ParseLinks,
        private alertService: AlertService,
        private principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: EventManager,
        private paginationUtil: PaginationUtil,
        private paginationConfig: PaginationConfig,
        private organizationService:OrganizacaoService,
        private sistemaService: SistemaService
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe(data => {
            this.page = data['pagingParams'].page;
            this.previousPage = data['pagingParams'].page;
            this.reverse = data['pagingParams'].ascending;
            this.predicate = data['pagingParams'].predicate;
        });
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
        this.jhiLanguageService.setLocations(['analise', 'metodoContagem', 'tipoAnalise']);
    }

    loadAll() {
        if (this.currentSearch) {
            this.analiseService.search({
                query: this.currentSearch,
                size: this.itemsPerPage,
                sort: this.sort()}).subscribe(
                    (res: Response) => this.onSuccess(res.json(), res.headers),
                    (res: Response) => this.onError(res.json())
                );
            return;
        }
        this.analiseService.query({
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort()}).subscribe(
            (res: Response) => this.onSuccess(res.json(), res.headers),
            (res: Response) => this.onError(res.json())
        );
    }
    loadPage (page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }
    transition() {
        this.router.navigate(['/analise'], {queryParams:
            {
                page: this.page,
                size: this.itemsPerPage,
                search: this.currentSearch,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        });
        this.loadAll();
    }

    clear() {
        this.page = 0;
        this.currentSearch = '';
        this.router.navigate(['/analise', {
            page: this.page,
            sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
        }]);
        this.loadAll();
    }
    search (query) {
        if (!query) {
            return this.clear();
        }
        this.page = 0;
        this.currentSearch = query;
        this.router.navigate(['/analise', {
            search: this.currentSearch,
            page: this.page,
            sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
        }]);
        this.loadAll();
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.organizationService.query().subscribe(
            (res: Response) => { this.organizations = res.json(); }, (res: Response) => this.onError(res.json()));

        this.sistemaService.query().subscribe(
            (res: Response) => { this.sistemas = res.json(); }, (res: Response) => this.onError(res.json()));
        this.registerChangeInAnalises();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId (index: number, item: Analise) {
        return item.id;
    }


    showReportForm(analise:Analise){
        this.selectedAnalise=analise;
        this.reportModal.open();
    }



    onNavigate(){
        window.open("./report/analiseReport/simple/"+this.selectedAnalise.id,"_blank");
    }

    registerChangeInAnalises() {
        this.eventSubscriber = this.eventManager.subscribe('analiseListModification', (response) => this.loadAll());
    }

    sort () {
        let result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    private onSuccess (data, headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        // this.page = pagingParams.page;
        this.analises = data;
    }

    private onError (error) {
        this.alertService.error(error.message, null, null);
    }
}
