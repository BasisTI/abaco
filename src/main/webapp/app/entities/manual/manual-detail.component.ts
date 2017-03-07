import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService, DataUtils } from 'ng-jhipster';
import { Manual } from './manual.model';
import { ManualService } from './manual.service';

@Component({
    selector: 'jhi-manual-detail',
    templateUrl: './manual-detail.component.html'
})
export class ManualDetailComponent implements OnInit, OnDestroy {

    manual: Manual;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private dataUtils: DataUtils,
        private manualService: ManualService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['manual']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.manualService.find(id).subscribe(manual => {
            this.manual = manual;
        });
    }
    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
