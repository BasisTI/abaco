import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { Sistema } from './sistema.model';
import { SistemaService } from './sistema.service';

@Component({
    selector: 'jhi-sistema-detail',
    templateUrl: './sistema-detail.component.html'
})
export class SistemaDetailComponent implements OnInit, OnDestroy {

    sistema: Sistema;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private sistemaService: SistemaService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['sistema']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.sistemaService.find(id).subscribe(sistema => {
            this.sistema = sistema;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
