import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Manual, ManualService } from 'src/app/manual';
import { Contrato } from '../contrato.model';
import { Subscription, Observable } from 'rxjs';
import { ContratoService } from '../contrato.service';
import { PageNotificationService } from '@nuvem/primeng-components';
import { ResponseWrapper } from 'src/app/shared';

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
  ) { }

  getLabel(label) {
    let str: any;
    return str;
  }

  ngOnInit() {
    this.isSaving = false;
    this.isEdit = false;
    this.manualService.query().subscribe((res) => {
      this.manuals = res;
    });
    this.routeSub = this.route.params.subscribe(params => {
      this.contrato = new Contrato();
      if (params['id']) {
        this.contratoService.find(params['id']).subscribe(contrato => this.contrato = contrato);
      }
    });
  }

  save() {
    if (!(this.contrato.dataInicioValida())) {
      this.pageNotificationService.addErrorMessage('A data de início da vigência não pode ser posterior à data de término da vigência!');
      document.getElementById('login').setAttribute('style', 'border-color: red;');

      return
    }
    this.isSaving = true;
    if (this.contrato.id !== undefined) {
      this.isEdit = true;
      this.subscribeToSaveResponse(this.contratoService.update(this.contrato));
    } else {
      this.isEdit = false;
      this.subscribeToSaveResponse(this.contratoService.create(this.contrato));
    }
  }
  z
  private subscribeToSaveResponse(result: Observable<Contrato>) {
    result.subscribe((res: Contrato) => {
      this.isSaving = false;
      this.router.navigate(['/contrato']);

      this.isEdit ? this.pageNotificationService.addUpdateMsg() : this.pageNotificationService.addCreateMsg();
    }, (error: Response) => {
      this.isSaving = false;
      if (error.status === 400) {
        let errorType: string = error.headers['x-abacoapp-error'][0];

        switch (errorType) {
          case "error.beggindateGTenddate": {
            this.pageNotificationService.addErrorMessage('Início Vigência não pode ser posterior a Final Vigência');
            document.getElementById('login').setAttribute('style', 'border-color: red;');
          }
        }

        const fieldErrors = JSON.parse(error['_body']).fieldErrors;
        this.pageNotificationService.addErrorMessage('Campos inválidos:' + fieldErrors);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
