import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { FaseService, Fase } from '../';

@Component({
    selector: 'jhi-tipo-fase-detail',
    templateUrl: './fase-detail.component.html'
})
export class FaseDetailComponent implements OnInit {

    public fase: Fase;

    constructor(
        private tipoFaseService: FaseService,
        private route: ActivatedRoute,
        private translate: TranslateService
    ) {
    }

    ngOnInit() {
         this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
    }

    load(id) {
        this.tipoFaseService.find(id).subscribe((fase) => {
            this.fase = fase;
        });
    }
}
