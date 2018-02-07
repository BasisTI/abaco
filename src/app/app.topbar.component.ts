import { Component } from '@angular/core';
import { AppComponent } from './app.component';
import { LoginService } from './login';
import { User } from './user';
import { AuthService } from '@basis/angular-components';
import { Router } from '@angular/router';

@Component({
    selector: 'app-topbar',
    template: `
        <div class="topbar clearfix">
            <div class="topbar-left">
                <div class="logo"></div>
            </div>

            <div class="topbar-right">
                <a id="menu-button" href="#" (click)="app.onMenuButtonClick($event)">
                    <i></i>
                </a>

                <a id="topbar-menu-button" href="#" (click)="app.onTopbarMenuButtonClick($event)">
                    <i class="material-icons">menu</i>
                </a>

                <ul class="topbar-items animated fadeInDown" [ngClass]="{'topbar-items-visible': app.topbarMenuActive}">
                    <li #login [ngClass]="{'active-top-menu':app.activeTopbarItem === login}">

                        <a href="#" (click)="app.onTopbarItemClick($event,login)"
                          title="Sair">
                            <i class="topbar-icon material-icons">power_settings_new</i>
                            <span class="topbar-item-name">Login/Logout</span>
                        </a>

                        <ul class="ultima-menu animated fadeInDown">
                            <li role="menuitem">
                                <a href="#" (click)="logout()">
                                    <span>Sair</span>
                                </a>
                            </li>
                        </ul>

                    </li>
                    <li #language [ngClass]="{'active-top-menu':app.activeTopbarItem === language}">
                        <a (click)="app.onTopbarItemClick($event,language)"
                          title="Idioma">
                            <i class="topbar-icon material-icons">language</i>
                            <span class="topbar-item-name">Idioma</span>
                        </a>
                        <ul class="ultima-menu animated fadeInDown">
                            <li role="menuitem">
                                <a name="es" (click)="setLanguage($event.target)">
                                    <span>Espanhol</span>
                                </a>
                            </li>
                            <li role="menuitem">
                                <a name="en" (click)="setLanguage($event.target)">
                                    <span>Inglês</span>
                                </a>
                            </li>
                            <li role="menuitem">
                                <a name="pt" (click)="setLanguage($event.target)">
                                    <span>Português</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    `
})
export class AppTopBarComponent {
    constructor(
        public app: AppComponent,
        private loginService: LoginService,
        private authService: AuthService<User>,
        private router: Router
    ) { }

    logout() {
        this.loginService.logout();
        this.authService.logout();
    }

    setLanguage(element) {
      sessionStorage.setItem("language", element.name);
      location.reload();
    }
}
