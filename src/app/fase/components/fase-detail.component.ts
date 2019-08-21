import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { FaseService, Fase } from '../';

@Component({
    selector: 'jhi-tipo-fase-detail',
    templateUrl: './fase-detail.component.html'
})
export class FaseDetailComponent implements OnInit, OnDestroy {

    public fase: Fase;
    private subscriptionList: Subscription[] = [];

    constructor(
        private tipoFaseService: FaseService,
        private route: ActivatedRoute,
        private translate: TranslateService
    ) {
    }

    getLabel(label) {
        let str: any;
        this.subscriptionList.push( this.translate.get(label).subscribe((res: string) => {
          str = res;
        }) );
        return str;
    }

    ngOnInit() {
        this.subscriptionList.push( this.route.params.subscribe((params) => {
            this.load(params['id']);
        }) );
    }

    load(id) {
        this.subscriptionList.push( this.tipoFaseService.find(id).subscribe((tipoFase) => {
            this.fase = tipoFase;
        }) );
    }

    ngOnDestroy() {
        this.subscriptionList.forEach((sub) => sub.unsubscribe());
    }
}
