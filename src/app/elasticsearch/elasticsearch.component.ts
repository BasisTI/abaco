import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Router } from '@angular/router';
import { ElasticSearchService } from './elasticsearch.service';


@Component({
  templateUrl: './elasticsearch.component.html'
})
export class ElasticSearchComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  constructor(
    private elasticSearchService: ElasticSearchService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params) => {
      this.load();
    });
  }

  load() {
    this.elasticSearchService.reindexAll();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public return() {
    this.router.navigate(['/elasticsearch']);
  }
}
