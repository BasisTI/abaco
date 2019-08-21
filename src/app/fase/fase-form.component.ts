import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';

import { Fase } from './model/fase.model';
import { FaseService } from './fase.service';
import { PageNotificationService } from '../shared';

@Component({
    selector: 'jhi-tipo-fase-form',
    templateUrl: './fase-form.component.html'
})
export class FaseFormComponent implements OnInit, OnDestroy {
    tipoFase: Fase;
    isSaving: boolean;

    private subscriptionList: Subscription[] = [];

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
        this.subscriptionList.push( this.translate.get(label).subscribe((res: string) => {
            str = res;
        }) );
        return str;
    }

    ngOnInit() {
        this.isSaving = false;
        this.subscriptionList.push( this.route.params.subscribe(params => {
            this.tipoFase = new Fase();
            if (params['id']) {
                this.tipoFaseService.find(params['id']).subscribe(tipoFase => this.tipoFase = tipoFase);
            }
        }) );
    }

    save(form) {
        if (!form.valid) {
            this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.FavorPreencherCampoObrigatorio'));
            return;
        }
        this.isSaving = true;
        this.subscribeToSaveResponse(this.tipoFaseService.create(this.tipoFase));
    }

    private subscribeToSaveResponse(result: Observable<Fase>) {
        this.subscriptionList.push( result.subscribe((res: Fase) => {
            this.isSaving = false;
            this.router.navigate(['/tipoFase']);
            (this.tipoFase.id === undefined) ? (this.pageNotificationService.addCreateMsg()) :
            (this.pageNotificationService.addUpdateMsg());

        }, (error: Response) => {
            this.isSaving = false;

            switch (error.status) {
                case 400: {
                    const fieldErrors = JSON.parse(error['_body']).fieldErrors;
                    const invalidFieldsString = this.pageNotificationService.getInvalidFields(fieldErrors);
                    this.pageNotificationService.addErrorMsg(
                        this.getLabel('Cadastros.TipoFase.Mensagens.msgCamposInvalidos') + invalidFieldsString);
                }
            }
        }) );
    }

    ngOnDestroy() {
        this.subscriptionList.forEach((sub) => sub.unsubscribe());
    }
}
