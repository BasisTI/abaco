import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { Modulo } from './modulo.model';
import { ModuloService } from './modulo.service';

@Component({
    selector: 'jhi-modulo-detail',
    templateUrl: './modulo-detail.component.html'
})
export class ModuloDetailComponent implements OnInit, OnDestroy {

    modulo: Modulo;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private moduloService: ModuloService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['modulo']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.moduloService.find(id).subscribe(modulo => {
            this.modulo = modulo;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
