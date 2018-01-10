import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';
import { SelectItem } from 'primeng/primeng';

import { Manual } from './manual.model';
import { ManualService } from './manual.service';

@Component({
  selector: 'jhi-manual-form',
  templateUrl: './manual-form.component.html'
})
export class ManualFormComponent implements OnInit, OnDestroy {
  manual: Manual;
  isSaving: boolean;
  private routeSub: Subscription;
  arquivoManual: File;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private manualService: ManualService,
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.routeSub = this.route.params.subscribe(params => {
      this.manual = new Manual();
      if (params['id']) {
        this.manualService.find(params['id']).subscribe(manual => this.manual = manual);
      }
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
}
