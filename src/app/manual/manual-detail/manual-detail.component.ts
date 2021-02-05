import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Manual } from '../manual.model';
import { ManualService } from '../manual.service';
import { UploadService } from '../../upload/upload.service';
import { Upload } from 'src/app/upload/upload.model';

@Component({
  selector: 'jhi-manual-detail',
  templateUrl: './manual-detail.component.html',
})
export class ManualDetailComponent implements OnInit, OnDestroy {

  manual: Manual = new Manual() ;
  manualArray: Manual[] = [];
  private subscription: Subscription;
  arquivos: Upload[];


  constructor(
    private manualService: ManualService,
    private route: ActivatedRoute,
    private uploadService: UploadService,
  ) { }

  getLabel(label) {
    let str: any;
    return str;
  }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params) => {
      this.load(params['id']);
    });
  }

  load(id) {
    this.manualService.find(id).subscribe((manual) => {
      this.manual = this.manual.copyFromJSON(manual);
      if (manual.id) {
        this.getFileInfo();
      }
      this.manualArray.push(manual);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getFileInfo() {
    this.manualService.getFiles(this.manual.id).subscribe(response => {
        this.arquivos = response;
    })
  }
  
}
