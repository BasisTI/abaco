import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Fase } from '../model/fase.model';
import { FaseService } from '../fase.service';

@Component({
    selector: 'app-fase-detail',
    templateUrl: './fase-detail.component.html'
})
export class FaseDetailComponent implements OnInit {

    public fase: Fase = new Fase();

    constructor(
        private tipoFaseService: FaseService,
        private route: ActivatedRoute,
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
