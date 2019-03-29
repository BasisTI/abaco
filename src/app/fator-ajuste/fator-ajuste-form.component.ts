import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';
import { SelectItem } from 'primeng/primeng';

import { FatorAjuste } from './fator-ajuste.model';
import { FatorAjusteService } from './fator-ajuste.service';
import { Manual, ManualService } from '../manual';
import { ResponseWrapper } from '../shared';

@Component({
  selector: 'jhi-fator-ajuste-form',
  templateUrl: './fator-ajuste-form.component.html'
})
export class FatorAjusteFormComponent implements OnInit, OnDestroy {

  dropdownTipoFatorAjuste: SelectItem[] = [
    { label: 'PERCENTUAL', value: 'PERCENTUAL' },
    { label: 'UNITARIO', value: 'UNITARIO' }
  ];

  dropdownImpactoFatorAjuste: SelectItem[] = [
    { label: 'INCLUSAO', value: 'INCLUSAO' },
    { label: 'ALTERACAO', value: 'ALTERACAO' },
    { label: 'EXCLUSAO', value: 'EXCLUSAO' },
    { label: 'CONVERSAO', value: 'CONVERSAO' },
    { label: 'ITENS_NAO_MENSURAVEIS', value: 'ITENS_NAO_MENSURAVEIS' }
  ];

  manuals: Manual[];
  fatorAjuste: FatorAjuste;
  isSaving: boolean;
  private routeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fatorAjusteService: FatorAjusteService,
    private manualService: ManualService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.manualService.query().subscribe((res: ResponseWrapper) => {
      this.manuals = res.json;
    });
    this.routeSub = this.route.params.subscribe(params => {
      this.fatorAjuste = new FatorAjuste();
      if (params['id']) {
        this.fatorAjusteService.find(params['id']).subscribe(fatorAjuste => this.fatorAjuste = fatorAjuste);
      }
    });
  }

  save() {
    this.isSaving = true;
    if (this.fatorAjuste.id !== undefined) {
      this.subscribeToSaveResponse(this.fatorAjusteService.update(this.fatorAjuste));
    } else {
      this.subscribeToSaveResponse(this.fatorAjusteService.create(this.fatorAjuste));
    }
  }

  private subscribeToSaveResponse(result: Observable<FatorAjuste>) {
    result.subscribe((res: FatorAjuste) => {
      this.isSaving = false;
      this.router.navigate(['/fatorAjuste']);
    }, (res: Response) => {
      this.isSaving = false;
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
