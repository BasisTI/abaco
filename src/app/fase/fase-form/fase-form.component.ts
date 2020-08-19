import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PageNotificationService } from '@nuvem/primeng-components';
import { Fase } from '../model/fase.model';
import { FaseService } from '../fase.service';

@Component({
    selector: 'app-fase-form',
    templateUrl: './fase-form.component.html'
})
export class FaseFormComponent implements OnInit {
    fase: Fase = new Fase();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private tipoFaseService: FaseService,
        private pageNotificationService: PageNotificationService,
    ) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.tipoFaseService.find(params['id']).subscribe(fase => this.fase = fase);
            }
        });
    }

    save(form) {
        if (!form.valid) {
            this.pageNotificationService.addErrorMessage('Por favor preencher o campo obrigatório!');
            return;
        }
        this.tipoFaseService.create(this.fase).subscribe(() => {
            this.router.navigate(['/fase']);
            if (this.fase.id == null) {
                this.pageNotificationService.addCreateMsg();
            } else {
                this.pageNotificationService.addUpdateMsg();
            }
        });
    }
}
