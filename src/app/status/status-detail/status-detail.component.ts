import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Status } from '../status.model';
import { StatusService } from '../status.service';
import { PageNotificationService } from '@nuvem/primeng-components';

@Component({
  selector: 'app-status-detail',
  templateUrl: './status-detail.component.html',
  styleUrls: ['./status-detail.component.css']
})
export class StatusDetailComponent implements OnInit {

  status: Status = new Status();

  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private statusService: StatusService,
      private pageNotificationService: PageNotificationService,
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
        if (params['id']) {
            this.statusService.find(params['id']).subscribe(status => this.status = status);
        } else {
          this.pageNotificationService.addErrorMessage('Não foi possível localizar o Status.');
          this.router.navigate(['/status']);
        }
    });
  }
}
