import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';

import { Analise } from './analise.model';
import { AnaliseService } from './analise.service';
import { ResponseWrapper } from '../shared';
import { Organizacao, OrganizacaoService } from '../organizacao';
import { Contrato, ContratoService } from '../contrato';
import { Sistema, SistemaService } from '../sistema';

@Component({
  selector: 'jhi-analise-form',
  templateUrl: './analise-form.component.html'
})
export class AnaliseFormComponent implements OnInit, OnDestroy {

  isSaving: boolean;
  analise: Analise;

  organizacoes: Organizacao[];
  contratos: Contrato[];
  sistemas: Sistema[];

  private routeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private analiseService: AnaliseService,
    private organizacaoService: OrganizacaoService,
    private contratoService: ContratoService,
    private sistemaService: SistemaService,
  ) { }

  ngOnInit() {
    this.isSaving = false;
    this.organizacaoService.query().subscribe((res: ResponseWrapper) => {
      this.organizacoes = res.json;
    });
    this.routeSub = this.route.params.subscribe(params => {
      this.analise = new Analise();
      if (params['id']) {
        this.analiseService.find(params['id']).subscribe(analise => {
          this.analise = analise;
        });
      }
    });
  }

  organizacaoSelected(org: Organizacao) {
    this.contratos = org.contracts;
    this.sistemaService.findAllByOrganizacaoId(org.id).subscribe((res: ResponseWrapper) => {
      this.sistemas = res.json;
    });
  }

  contratoDropdownPlaceholder() {
    if (this.contratos && this.contratos.length > 0) {
      return 'Contrato';
    } else {
      return 'Contrato - Selecione uma Organização para carregar os Contratos';
    }
  }

  sistemaDropdownPlaceholder() {
    if (this.sistemas && this.sistemas.length > 0) {
      return 'Sistema';
    } else {
      return 'Sistema - Selecione uma Organização para carregar os Sistemas';
    }
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

}
