import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Divergencia } from '../divergencia.model';
import { Subscription } from 'rxjs';
import { DivergenciaService } from '../divergencia.service';


@Component({
  selector: 'app-divergencia-detail',
  templateUrl: './divergencia-detail.component.html'
  })
export class DivergenciaDetailComponent implements OnInit, OnDestroy {

  analise: Divergencia;
  private subscription: Subscription;


  constructor(
    private analiseService: DivergenciaService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params) => {
      this.load(params['id']);
    });
  }

  load(id) {
    // this.analiseService.findWithFuncaos(id).subscribe((analise) => {
    //   const jsonResponse = analise[0].json();
    //   jsonResponse['funcaoDados'] = analise[1];
    //   jsonResponse['funcaoTransacaos'] = analise[2];
    //   analise = this.analiseService.convertItemFromServer(jsonResponse);
    //   analise.createdBy = jsonResponse.createdBy;
    //   this.analise = analise;
    // });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
