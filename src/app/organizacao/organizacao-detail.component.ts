import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Organizacao } from './organizacao.model';
import { OrganizacaoService } from './organizacao.service';
import { UploadService } from '../upload/upload.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-organizacao-detail',
  templateUrl: './organizacao-detail.component.html'
})
export class OrganizacaoDetailComponent implements OnInit, OnDestroy {

  organizacao: Organizacao;
  private subscription: Subscription;
  public logo: File;

  constructor(
    private organizacaoService: OrganizacaoService,
    private route: ActivatedRoute,
    private uploadService: UploadService,
    private translate: TranslateService
  ) { }

  getLabel(label) {
    let str: any;
    this.translate.get(label).subscribe((res: string) => {
      str = res;
    }).unsubscribe();
    return str;
  }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params) => {
      this.load(params['id']);
    });
  }

  load(id) {
    this.organizacaoService.find(id).subscribe(organizacao => {
      this.organizacao = organizacao;
      if (this.organizacao.logoId != undefined && this.organizacao.logoId != null)
        this.uploadService.getLogo(organizacao.logoId).subscribe(response => {
          this.logo = response.logo;
        });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
