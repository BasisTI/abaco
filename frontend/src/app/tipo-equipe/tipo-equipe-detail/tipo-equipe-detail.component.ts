import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { TipoEquipe } from '../tipo-equipe.model';
import { Subscription } from 'rxjs';
import { TipoEquipeService } from '../tipo-equipe.service';

@Component({
  selector: 'jhi-tipo-equipe-detail',
  templateUrl: './tipo-equipe-detail.component.html'
})
export class TipoEquipeDetailComponent implements OnInit, OnDestroy {

  tipoEquipe: TipoEquipe;
  private subscription: Subscription;

  constructor(
    private tipoEquipeService: TipoEquipeService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  getLabel(label) {
    return label;
  }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params) => {
      this.load(params['id']);
    });
  }

  load(id) {
    this.tipoEquipeService.find(id).subscribe((tipoEquipe) => {
      this.tipoEquipe = tipoEquipe;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public return() {
    this.router.navigate(['/admin/tipoEquipe']);
  }
}
