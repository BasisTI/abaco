import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';
import { SelectItem } from 'primeng/primeng';

import { Manual } from './manual.model';
import { ManualService } from './manual.service';
import { EsforcoFaseService } from '../esforco-fase/esforco-fase.service';
import { ResponseWrapper } from '../shared';
import { EsforcoFase } from '../esforco-fase/esforco-fase.model';
import { TipoFaseService } from '../tipo-fase/tipo-fase.service';
import { TipoFase } from '../tipo-fase/tipo-fase.model';
import { DatatableClickEvent } from '@basis/angular-components';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';

@Component({
  selector: 'jhi-manual-form',
  templateUrl: './manual-form.component.html'
})
export class ManualFormComponent implements OnInit, OnDestroy {
  manual: Manual;
  isSaving: boolean;
  private routeSub: Subscription;
  arquivoManual: File;
  esforcoFases: Array<EsforcoFase>;
  showDialogPhaseEffort: boolean = false;
  showDialogEditPhaseEffort: boolean = false;
  tipoFases: Array<TipoFase> = [];
  percentual: number;
  newPhaseEffort: EsforcoFase = new EsforcoFase();
  editedPhaseEffort: EsforcoFase = new EsforcoFase();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private manualService: ManualService,
    private esforcoFaseService: EsforcoFaseService,
    private tipoFaseService: TipoFaseService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.routeSub = this.route.params.subscribe(params => {
      this.manual = new Manual();
      if (params['id']) {
        this.manualService.find(params['id']).subscribe(manual => this.manual = manual);
      }
    });

    this.esforcoFaseService.query().subscribe((response: ResponseWrapper) => {
      this.manual.esforcoFases = response.json;
    });

    this.tipoFaseService.query().subscribe((response: ResponseWrapper) => {
      this.tipoFases = response.json;
    });

  }

  save() {
    this.isSaving = true;
    if (this.manual.id !== undefined) {
      this.subscribeToSaveResponse(this.manualService.update(this.manual));
    } else {
      this.subscribeToSaveResponse(this.manualService.create(this.manual, this.arquivoManual));
    }
  }

  private subscribeToSaveResponse(result: Observable<Manual>) {
    result.subscribe((res: Manual) => {
      this.isSaving = false;
      this.router.navigate(['/manual']);
    }, (res: Response) => {
      this.isSaving = false;
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  uploadFile(event) {
    this.arquivoManual = event.target.files[0];
  }

  datatableClick(event: DatatableClickEvent) {
    if (!event.selection) {
      return;
    }
    switch (event.button) {
      case 'edit':
        this.editedPhaseEffort = event.selection.clone();
        this.openDialogEditPhaseEffort();
        break;
      case 'delete':
      console.log(event.selection);
        this.editedPhaseEffort = event.selection.clone();
        this.confirmDeletePhaseEffort();
    }
  }

  confirmDeletePhaseEffort() {
    this.manual.deleteEsforcoFase(this.editedPhaseEffort);
    this.editedPhaseEffort = new EsforcoFase();
  }

  openDialogPhaseEffort() {
    this.showDialogPhaseEffort = true;
  }

  openDialogEditPhaseEffort() {
      this.showDialogEditPhaseEffort = true;
  }

  editPhaseEffort() {
    this.manual.updateEsforcoFases(this.editedPhaseEffort);
    this.closeDialogEditPhaseEffort();
  }

  private closeDialogPhaseEffort() {
    this.newPhaseEffort = new EsforcoFase();
    this.showDialogPhaseEffort = false;
  }

  private closeDialogEditPhaseEffort() {
    this.editedPhaseEffort = new EsforcoFase();
    this.showDialogEditPhaseEffort = false;
  }

  addPhaseEffort() {
    this.manual.addEsforcoFases(this.newPhaseEffort);
    this.closeDialogPhaseEffort();
  }

  getPhaseEffortTotalPercentual() {
    let total = 0;

    this.manual.esforcoFases.forEach(each => {
        total = total + each.percentual;
    });

    return total;
  }



}
