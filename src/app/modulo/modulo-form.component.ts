import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';
import { SelectItem } from 'primeng/primeng';

import { Modulo } from './modulo.model';
import { ModuloService } from './modulo.service';
// import { Sistema, SistemaService } from '../sistema';
import { ResponseWrapper } from '../shared';

@Component({
  selector: 'jhi-modulo-form',
  templateUrl: './modulo-form.component.html'
})
export class ModuloFormComponent implements OnInit, OnDestroy {

  // sistemas: Sistema[];
  modulo: Modulo;
  isSaving: boolean;
  private routeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private moduloService: ModuloService,
    // private sistemaService: SistemaService,
  ) {}

  ngOnInit() {
    this.isSaving = false;
    // this.sistemaService.query().subscribe((res: ResponseWrapper) => {
    //   this.sistemas = res.json;
    // });
    this.routeSub = this.route.params.subscribe(params => {
      this.modulo = new Modulo();
      if (params['id']) {
        this.moduloService.find(params['id']).subscribe(modulo => this.modulo = modulo);
      }
    });
  }

  save() {
    this.isSaving = true;
    if (this.modulo.id !== undefined) {
      this.subscribeToSaveResponse(this.moduloService.update(this.modulo));
    } else {
      this.subscribeToSaveResponse(this.moduloService.create(this.modulo));
    }
  }

  private subscribeToSaveResponse(result: Observable<Modulo>) {
    result.subscribe((res: Modulo) => {
      this.isSaving = false;
      this.router.navigate(['/modulo']);
    }, (res: Response) => {
      this.isSaving = false;
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
