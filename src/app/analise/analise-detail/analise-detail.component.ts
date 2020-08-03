import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Analise } from '../analise.model';
import { Subscription } from 'rxjs';
import { AnaliseService } from '../analise.service';


@Component({
  selector: 'jhi-analise-detail',
  templateUrl: './analise-detail.component.html'
  })
export class AnaliseDetailComponent implements OnInit, OnDestroy {

  analise: Analise;
  private subscription: Subscription;


  constructor(
    private analiseService: AnaliseService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params) => {
      this.load(params['id']);
    });
  }

  load(id) {
    this.analiseService.findWithFuncaos(id).subscribe((analise) => {
      const jsonResponse = analise[0].json();
      jsonResponse['funcaoDados'] = analise[1];
      jsonResponse['funcaoTransacaos'] = analise[2];
      analise = this.analiseService.convertItemFromServer(jsonResponse);
      analise.createdBy = jsonResponse.createdBy;
      this.analise = analise;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
