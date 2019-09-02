import {MenuItem} from 'primeng/primeng';
import {Injectable} from '@angular/core';
import {AuthService} from '@basis/angular-components';
import {User} from '../user';
import {SenhaComponent} from '../senha';
import {ADMIN_ROLE, ROLE_ANALISTA, ROLE_USER, ROLE_VIEW} from './constants';

@Injectable()
export class MenuItemsService {

    constructor(private authService: AuthService<User>) {
    }

    get all(): MenuItem[] {
        return [
            {
                label: `MenuPrincipal.Configuracao.Configuracao`, icon: 'settings',
                visible: this.authService.isAuthenticated(),
                items: [
                    { label: 'MenuPrincipal.Configuracao.Reindexar', routerLink: 'elasticsearch', icon: 'refresh' },
                    { label: 'MenuPrincipal.Configuracao.EditarUsuario', routerLink: `usuario/edit`, icon: 'tag_faces' },
                    { label: 'MenuPrincipal.Configuracao.AlterarSenha', routerLink: `senha`, icon: 'security' }
                ]
            },
            {
                label: 'MenuPrincipal.Cadastros.Cadastros', icon: 'description',
                visible: this.isLoggedCadastrosBasicos(),
                items: [
                    { label: 'MenuPrincipal.Cadastros.Fase', routerLink: 'fase', icon: 'beenhere' },
                    { label: 'MenuPrincipal.Cadastros.Manual', routerLink: 'manual', icon: 'description' },
                    { label: 'MenuPrincipal.Cadastros.Organizacao', routerLink: 'organizacao', icon: 'business' },
                    { label: 'MenuPrincipal.Cadastros.Sistema', routerLink: 'sistema', icon: 'laptop' },
                    { label: 'MenuPrincipal.Administracao.TipoEquipe', routerLink: 'admin/tipoEquipe', icon: 'people' },
                    { label: 'MenuPrincipal.Administracao.Usuarios', routerLink: 'admin/user', icon: 'person' }
                ]
            },
            {
                label: 'MenuPrincipal.Analise.Analise', icon: 'insert_chart',
                visible: this.authService.isAuthenticated(),
                items: [
                    { label: 'MenuPrincipal.Analise.Analise', routerLink: 'analise', icon: 'description' },
                    { label: 'MenuPrincipal.Analise.Baseline', routerLink: 'baseline', icon: 'view_list' },
                    // { label: 'Compare' }
                    // { label: 'Validação' }
                ]
            }
            
            
        ];
    }

    private isLoggedAdmin(): boolean {
        return this.authService.isAuthenticated && this.authService.hasRole(ADMIN_ROLE);
    }

    private isLoggedCadastrosBasicos(): boolean {
        return this.authService.hasRole(ADMIN_ROLE)
            || this.authService.hasRole(ROLE_USER)
            || this.authService.hasRole(ROLE_VIEW);
    }

}
