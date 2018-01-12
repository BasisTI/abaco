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
  showDialogFaseEffort: boolean = false;
  tipoFases: Array<TipoFase> = [];
  percentual: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private manualService: ManualService,
    private esforcoFaseService: EsforcoFaseService,
    private tipoFaseService: TipoFaseService
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
      this.esforcoFases = response.json;
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

  openDialogFaseEffort() {
    this.showDialogFaseEffort = true;
  }


}
