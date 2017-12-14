import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Manual } from './manual.model';
import { ManualService } from './manual.service';

@Component({
  selector: 'jhi-manual-detail',
  templateUrl: './manual-detail.component.html'
})
export class ManualDetailComponent implements OnInit, OnDestroy {

  manual: Manual;
  private subscription: Subscription;

  constructor(
    private manualService: ManualService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params) => {
      this.load(params['id']);
    });
  }

  load(id) {
    this.manualService.find(id).subscribe((manual) => {
      this.manual = manual;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
