import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageNotificationService } from '@nuvem/primeng-components';
import { Status } from '../status.model';
import { StatusService } from '../status.service';



@Component({
  selector: 'app-status-form',
  templateUrl: './status-form.component.html',
  styleUrls: ['./status-form.component.css']
})
export class StatusFormComponent implements OnInit {

  status: Status = new Status();

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private statusService: StatusService,
      private pageNotificationService: PageNotificationService,
  ) {
  }

  ngOnInit() {
      this.route.params.subscribe(params => {
          if (params['id']) {
              this.statusService.find(params['id']).subscribe(status => this.status = status);
          } else {
            this.status = new Status();
            this.status.ativo = true;
          }
      });
  }

  save(form) {
      if (!form.valid) {
          this.pageNotificationService.addErrorMessage('Por favor preencher o campo obrigatório!');
          return;
      }
      if (this.status && this.status.id) {
          this.statusService.update(this.status).subscribe(() => {
            this.router.navigate(['/status']);
                this.pageNotificationService.addUpdateMsg();
          });
      } else {
        this.statusService.create(this.status).subscribe(() => {
          this.router.navigate(['/status']);
          this.pageNotificationService.addCreateMsg();
        });
      }
  }
}
