import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { Organizacao } from './organizacao.model';
import { OrganizacaoService } from './organizacao.service';

@Component({
    selector: 'jhi-organizacao-detail',
    templateUrl: './organizacao-detail.component.html'
})
export class OrganizacaoDetailComponent implements OnInit, OnDestroy {

    organizacao: Organizacao;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private organizacaoService: OrganizacaoService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['organizacao']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.organizacaoService.find(id).subscribe(organizacao => {
            this.organizacao = organizacao;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
