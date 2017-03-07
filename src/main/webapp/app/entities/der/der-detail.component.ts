import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { Der } from './der.model';
import { DerService } from './der.service';

@Component({
    selector: 'jhi-der-detail',
    templateUrl: './der-detail.component.html'
})
export class DerDetailComponent implements OnInit, OnDestroy {

    der: Der;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private derService: DerService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['der']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.derService.find(id).subscribe(der => {
            this.der = der;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
