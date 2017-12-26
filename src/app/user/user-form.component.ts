import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';
import { SelectItem } from 'primeng/primeng';

import { User } from './user.model';
import { UserService } from './user.service';
import { TipoEquipe, TipoEquipeService } from '../tipo-equipe';
import { ResponseWrapper } from '../shared';

@Component({
  selector: 'jhi-user-form',
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit, OnDestroy {

  tipoequipes: TipoEquipe[];
  user: User;
  isSaving: boolean;
  private routeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private tipoEquipeService: TipoEquipeService,
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.tipoEquipeService.query().subscribe((res: ResponseWrapper) => {
      this.tipoequipes = res.json;
    });
    this.routeSub = this.route.params.subscribe(params => {
      this.user = new User();
      if (params['id']) {
        this.userService.find(params['id']).subscribe(user => this.user = user);
      }
    });
  }

  save() {
    this.isSaving = true;
    if (this.user.id !== undefined) {
      this.subscribeToSaveResponse(this.userService.update(this.user));
    } else {
      this.subscribeToSaveResponse(this.userService.create(this.user));
    }
  }

  private subscribeToSaveResponse(result: Observable<User>) {
    result.subscribe((res: User) => {
      this.isSaving = false;
      this.router.navigate(['/user']);
    }, (res: Response) => {
      this.isSaving = false;
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
