import { MenuItem } from 'primeng/primeng';
import { Injectable } from '@angular/core';
import { AuthService } from '@basis/angular-components';
import { User } from '../user';

@Injectable()
export class MenuItemsService {

  constructor(private authService: AuthService<User>) { }

  get all(): MenuItem[] {
    return [
      { label: 'Login', routerLink: 'login' },
      {
        label: 'Administração', icon: 'supervisor_account',
        visible: this.isLoggedAdmin(),
        items: [
          { label: 'Tipo de Equipe', routerLink: 'tipoEquipe' },
          { label: 'Usuários', routerLink: 'user' }
        ]
      },
      {
        label: 'Cadastros Básicos', icon: 'description',
        visible: this.authService.isAuthenticated(),
        items: [
          { label: 'Tipo de Fase', routerLink: 'tipoFase' },
          { label: 'Manual', routerLink: 'manual' },
          { label: 'Organização', routerLink: 'organizacao' },
          { label: 'Sistema', routerLink: 'sistema' }
        ]
      },
      {
        label: 'Análise', icon: 'insert_chart',
        visible: this.authService.isAuthenticated(),
        items: [
          { label: 'Análise' },
          { label: 'Validação' }
        ]
      }
    ];
  }

  private isLoggedAdmin(): boolean {
    return this.authService.isAuthenticated && this.authService.hasRole('ROLE_ADMIN');
  }

}
