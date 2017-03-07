import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { Contrato } from './contrato.model';
import { ContratoService } from './contrato.service';

@Component({
    selector: 'jhi-contrato-detail',
    templateUrl: './contrato-detail.component.html'
})
export class ContratoDetailComponent implements OnInit, OnDestroy {

    contrato: Contrato;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private contratoService: ContratoService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['contrato']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.contratoService.find(id).subscribe(contrato => {
            this.contrato = contrato;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
