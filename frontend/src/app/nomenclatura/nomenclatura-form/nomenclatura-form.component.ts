import { Component, OnInit } from '@angular/core';
import { Nomenclatura } from '../nomenclatura.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NomenclaturaService } from '../nomenclatura.service';
import { PageNotificationService } from '@nuvem/primeng-components';

@Component({
  selector: 'app-nomenclatura-form',
  templateUrl: './nomenclatura-form.component.html'
})
export class NomenclaturaFormComponent implements OnInit {

  nomenclatura: Nomenclatura = new Nomenclatura();

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private nomenclaturaService: NomenclaturaService,
      private pageNotificationService: PageNotificationService,
  ) {
  }

  ngOnInit() {
      this.route.params.subscribe(params => {
          if (params['id']) {
              this.nomenclaturaService.find(params['id']).subscribe(nomenclatura => this.nomenclatura = nomenclatura);
          } else {
            this.nomenclatura = new Nomenclatura();
          }
      });
  }

  save(form) {
      if (!form.valid) {
          this.pageNotificationService.addErrorMessage('Por favor preencher o campo obrigatório!');
          return;
      }
      if (this.nomenclatura && this.nomenclatura.id) {
          this.nomenclaturaService.update(this.nomenclatura).subscribe(() => {
            this.router.navigate(['/nomenclatura']);
                this.pageNotificationService.addUpdateMsg();
          });
      } else {
        this.nomenclaturaService.create(this.nomenclatura).subscribe(() => {
          this.router.navigate(['/nomenclatura']);
          this.pageNotificationService.addCreateMsg();
        });
      }
  }
}
