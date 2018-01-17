import { Component, OnDestroy } from '@angular/core';
import { AppComponent } from './app.component';
import { BreadcrumbService } from './shared/breadcrumb.service';
import { Subscription } from 'rxjs/Subscription';
import { MenuItem } from 'primeng/primeng';
import { LoginService } from './login';
import { User } from './user';
import { AuthService } from '@basis/angular-components';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './app.breadcrumb.component.html'
})
export class AppBreadcrumbComponent implements OnDestroy {

  subscription: Subscription;

  items: MenuItem[];

  constructor(private loginService: LoginService,
    private authService: AuthService<User>,
    public breadcrumbService: BreadcrumbService) {
    this.subscription = breadcrumbService.itemsHandler.subscribe(response => {
      this.items = response;
    });
  }

  logout() {
    this.loginService.logout();
    this.authService.logout();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
