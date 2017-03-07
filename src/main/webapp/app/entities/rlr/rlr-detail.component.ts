import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { Rlr } from './rlr.model';
import { RlrService } from './rlr.service';

@Component({
    selector: 'jhi-rlr-detail',
    templateUrl: './rlr-detail.component.html'
})
export class RlrDetailComponent implements OnInit, OnDestroy {

    rlr: Rlr;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private rlrService: RlrService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['rlr']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.rlrService.find(id).subscribe(rlr => {
            this.rlr = rlr;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
