import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { DatatableComponent, DatatableClickEvent } from '@basis/angular-components';

import { environment } from '../../environments/environment';
import { Analise } from './analise.model';
import { AnaliseService } from './analise.service';
import { ElasticQuery } from '../shared';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'jhi-analise',
  templateUrl: './analise.component.html'
})
export class AnaliseComponent implements AfterViewInit {

  @ViewChild(DatatableComponent) datatable: DatatableComponent;

  searchUrl: string = this.analiseService.searchUrl;

  paginationParams = { contentIndex: null };
  elasticQuery: ElasticQuery = new ElasticQuery();

  constructor(
    private router: Router,
    private analiseService: AnaliseService,
    private confirmationService: ConfirmationService
  ) { }

  ngAfterViewInit() {
    this.datatable.refresh(this.elasticQuery.query);
  }

}
