import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';

import { FaseService, Fase } from '../';
import { PageNotificationService } from '../../shared';

@Component({
    selector: 'jhi-tipo-fase-form',
    templateUrl: './fase-form.component.html'
})
export class FaseFormComponent implements OnInit {
    fase: Fase = new Fase();
    isSaving: boolean;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private tipoFaseService: FaseService,
        private pageNotificationService: PageNotificationService,
        private translate: TranslateService
    ) {
    }

    getLabel(label) {
        let str: any;
        this.translate.get(label).subscribe((res: string) => {
            str = res;
        });
        return str;
    }

    ngOnInit() {
        this.isSaving = false;
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.tipoFaseService.find(params['id']).subscribe(fase => this.fase = fase);
            }
        });
    }

    save(form) {
        if (!form.valid) {
            this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.FavorPreencherCampoObrigatorio'));
            return;
        }
        this.isSaving = true;
        this.handleCreateResponse(this.tipoFaseService.create(this.fase));
    }

    private handleCreateResponse(result: Observable<boolean>) {
        result.subscribe(() => {
            this.isSaving = false;
            this.router.navigate(['/fase']);
            (this.fase.id === undefined) ? (this.pageNotificationService.addCreateMsg()) :
            (this.pageNotificationService.addUpdateMsg());

        }, (error: Response) => {
            this.isSaving = false;

            switch (error.status) {
                case 400: {
                    const fieldErrors = JSON.parse(error['_body']).fieldErrors;
                    const invalidFieldsString = this.pageNotificationService.getInvalidFields(fieldErrors);
                    this.pageNotificationService.addErrorMsg(
                        this.getLabel('Cadastros.fase.Mensagens.msgCamposInvalidos') + invalidFieldsString);
                }
            }
        });
    }
}
