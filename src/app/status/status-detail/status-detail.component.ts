import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Status } from '../status.model';
import { StatusService } from '../status.service';

@Component({
  selector: 'app-status-detail',
  templateUrl: './status-detail.component.html',
  styleUrls: ['./status-detail.component.css']
})
export class StatusDetailComponent implements OnInit {

  status: Status = new Status();

  constructor(
      private route: ActivatedRoute,
      private statusService: StatusService,
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

}
