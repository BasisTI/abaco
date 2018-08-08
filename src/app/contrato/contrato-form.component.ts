import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';
import { SelectItem } from 'primeng/primeng';

import { Contrato } from './contrato.model';
import { ContratoService } from './contrato.service';
import { Manual, ManualService } from '../manual';
import { ResponseWrapper } from '../shared';
import { PageNotificationService } from '../shared/page-notification.service';

@Component({
  selector: 'jhi-contrato-form',
  templateUrl: './contrato-form.component.html'
})
export class ContratoFormComponent implements OnInit, OnDestroy {

  manuals: Manual[];
  contrato: Contrato;
  isSaving; isEdit: boolean;
  private routeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contratoService: ContratoService,
    private manualService: ManualService,
    private pageNotificationService: PageNotificationService,
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.manualService.query().subscribe((res: ResponseWrapper) => {
      this.manuals = res.json;
    });
    this.routeSub = this.route.params.subscribe(params => {
      this.contrato = new Contrato();
      if (params['id']) {
        this.contratoService.find(params['id']).subscribe(contrato => this.contrato = contrato);
      }
    });
  }

  save() {
    this.isSaving = true;
    if (this.contrato.id !== undefined) {
      this.isEdit = true;
      this.subscribeToSaveResponse(this.contratoService.update(this.contrato));
    } else {
      this.isEdit = false;
      this.subscribeToSaveResponse(this.contratoService.create(this.contrato));
    }
  }

  private subscribeToSaveResponse(result: Observable<Contrato>) {
    result.subscribe((res: Contrato) => {
      this.isSaving = false;
      this.router.navigate(['/contrato']);

      this.isEdit ? this.pageNotificationService.addUpdateMsg() :  this.pageNotificationService.addCreateMsg();
    }, (error: Response) => {
      this.isSaving = false;
      if(error.status === 400){
        let errorType : string = error.headers.toJSON()['x-abacoapp-error'][0];

        switch(errorType){
          case "error.beggindateGTenddate" : {
            console.log("Entrei no case pelo contrato-form.components");
            this.pageNotificationService.addErrorMsg('"Início Vigência" não pode ser posterior a "Final Vigência"');
            document.getElementById('login').setAttribute('style', 'border-color: red;');
          }
        }

        let invalidFieldNamesString = '';
        const fieldErrors = JSON.parse(error['_body']).fieldErrors;
        invalidFieldNamesString = this.pageNotificationService.getInvalidFields(fieldErrors);
        this.pageNotificationService.addErrorMsg('Campos inválidos: ' + invalidFieldNamesString);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
