import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import {NgxMaskModule} from 'ngx-mask';
import { Organizacao } from './organizacao.model';
import { OrganizacaoService } from './organizacao.service';
import { UploadService } from '../upload/upload.service';

@Component({
  selector: 'jhi-organizacao-detail',
  templateUrl: './organizacao-detail.component.html'
})
export class OrganizacaoDetailComponent implements OnInit, OnDestroy {

  organizacao: Organizacao;
  private subscription: Subscription;
  public logo: Blob;

  constructor(
    private organizacaoService: OrganizacaoService,
    private route: ActivatedRoute,
    private uploadService: UploadService
  ) {}

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params) => {
      this.load(params['id']);
    });
  }

  load(id) {
    this.organizacaoService.find(id).subscribe((organizacao) => {
      this.organizacao = organizacao;
      // this.uploadService.getFile(this.organizacao.logoId).subscribe(response => {
        
      // })
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
