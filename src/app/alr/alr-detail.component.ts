import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Alr } from './alr.model';
import { AlrService } from './alr.service';

@Component({
  selector: 'jhi-alr-detail',
  templateUrl: './alr-detail.component.html'
})
export class AlrDetailComponent implements OnInit, OnDestroy {

  alr: Alr;
  private subscription: Subscription;

  constructor(
    private alrService: AlrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params) => {
      this.load(params['id']);
    });
  }

  load(id) {
    this.alrService.find(id).subscribe((alr) => {
      this.alr = alr;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
