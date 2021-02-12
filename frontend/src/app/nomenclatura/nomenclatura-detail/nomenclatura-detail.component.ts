import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PageNotificationService } from '@nuvem/primeng-components';
import { NomenclaturaService } from '../nomenclatura.service';
import { Nomenclatura } from '../nomenclatura.model';

@Component({
  selector: 'app-nomenclatura-detail',
  templateUrl: './nomenclatura-detail.component.html'
})
export class NomenclaturaDetailComponent implements OnInit {

  nomenclatura: Nomenclatura;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private nomenclaturaService: NomenclaturaService,
    private pageNotificationService: PageNotificationService,
) {
}

ngOnInit() {
  this.route.params.subscribe(params => {
      if (params['id']) {
          this.nomenclaturaService.find(params['id']).subscribe(nomenclatura => this.nomenclatura = nomenclatura);
      } else {
        this.pageNotificationService.addErrorMessage('Não foi possível localizar a Nomenclatura.');
        this.router.navigate(['/nomenclatura']);
      }
  });
}

}
