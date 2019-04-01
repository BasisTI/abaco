import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';

import { TipoFase } from './tipo-fase.model';
import { TipoFaseService } from './tipo-fase.service';
import { PageNotificationService } from '../shared';

@Component({
    selector: 'jhi-tipo-fase-form',
    templateUrl: './tipo-fase-form.component.html'
})
export class TipoFaseFormComponent implements OnInit, OnDestroy {
    tipoFase: TipoFase;
    isSaving: boolean;
    private routeSub: Subscription;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private tipoFaseService: TipoFaseService,
        private pageNotificationService: PageNotificationService,
        private translate: TranslateService
    ) {
    }

    getLabel(label) {
        let str: any;
        this.translate.get(label).subscribe((res: string) => {
            str = res;
        }).unsubscribe();
        return str;
    }

    ngOnInit() {
        this.isSaving = false;
        this.routeSub = this.route.params.subscribe(params => {
            this.tipoFase = new TipoFase();
            if (params['id']) {
                this.tipoFaseService.find(params['id']).subscribe(tipoFase => this.tipoFase = tipoFase);
            }
        });
    }

    save(form) {
        if (!form.valid) {
            this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.FavorPreencherCampoObrigatorio'));
            return;
        }
        this.tipoFaseService.query().subscribe(response => {
            const allPhases = response;

            if (this.checkPhaseNameIsValid()) {
                if (!this.checkIfPhaseAlreadyExist(allPhases.json)) {
                    this.isSaving = true;
                    if (this.tipoFase.id !== undefined) {
                        this.subscribeToSaveResponse(this.tipoFaseService.update(this.tipoFase));
                    } else {
                        this.subscribeToSaveResponse(this.tipoFaseService.create(this.tipoFase));
                    }
                }
            }
        });
    }

    private checkIfPhaseAlreadyExist(registeredPhases: Array<TipoFase>): boolean {
        let isAlreadyRegistered = false;
        if (registeredPhases) {
            registeredPhases.forEach(each => {
                if (each.nome.toUpperCase() === this.tipoFase.nome.toUpperCase() && each.id !== this.tipoFase.id) {
                    isAlreadyRegistered = true;
                    this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.TipoFase.Mensagens.msgJaExisteTipoFaseCadastradoComEsseNome'));
                }
            });
        }
        return isAlreadyRegistered;
    }

    private checkPhaseNameIsValid(): boolean {
        let isNameValid = false;

        if (this.tipoFase.nome !== null && this.tipoFase.nome !== undefined && this.tipoFase.nome !== '') {
            isNameValid = true;
            if (this.tipoFase.nome.length > 254) {
                this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.TipoFase.Mensagens.msgNomeFaseExcedeMaximoCaracteres'));
                isNameValid = false;
            }
        } else {
            this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.msgFavorInformarCamposObrigatorios'));
        }

        return isNameValid;
    }

    private subscribeToSaveResponse(result: Observable<TipoFase>) {
        result.subscribe((res: TipoFase) => {
            this.isSaving = false;
            this.router.navigate(['/tipoFase']);
            (this.tipoFase.id === undefined) ? (this.pageNotificationService.addCreateMsg()) : (this.pageNotificationService.addUpdateMsg());

        }, (error: Response) => {
            this.isSaving = false;

            switch (error.status) {
                case 400: {
                    const fieldErrors = JSON.parse(error['_body']).fieldErrors;
                    const invalidFieldsString = this.pageNotificationService.getInvalidFields(fieldErrors);
                    this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.TipoFase.Mensagens.msgCamposInvalidos') + invalidFieldsString);
                }
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
