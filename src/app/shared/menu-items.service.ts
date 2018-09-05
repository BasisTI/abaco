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
                label: 'Administração', icon: 'supervisor_account',
                visible: this.isLoggedAdmin(),
                items: [
                    {label: 'Reindexar', routerLink: 'elasticsearch', icon: 'refresh'},
                    {label: 'Tipo de Equipe', routerLink: 'admin/tipoEquipe', icon: 'people'},
                    {label: 'Usuários', routerLink: 'admin/user', icon: 'person'},
                ]
            },
            {
                label: 'Cadastros Básicos', icon: 'description',
                visible: this.isLoggedCadastrosBasicos(),
                items: [
                    {label: 'Tipo de Fase', routerLink: 'tipoFase', icon: 'beenhere'},
                    {label: 'Manual', routerLink: 'manual', icon: 'description'},
                    {label: 'Organização', routerLink: 'organizacao', icon: 'business'},
                    {label: 'Sistema', routerLink: 'sistema', icon: 'laptop'}
                ]
            },
            {
                label: 'Análise', icon: 'insert_chart',
                visible: this.authService.isAuthenticated(),
                items: [
                    {label: 'Análise', routerLink: 'analise', icon: 'description'},
                    {label: 'Baseline', routerLink: 'baseline', icon: 'view_list'},
                    // { label: 'Compare' }
                    // { label: 'Validação' }
                ]
            },
            {
                label: 'Configuração', icon: 'settings',
                visible: this.authService.isAuthenticated(),
                items: [
                    // {label: 'Reindexar', routerLink: 'elasticsearch', icon: 'refresh' },
                    {label: 'Editar usuário', routerLink: `usuario/edit`, icon: 'tag_faces'},
                    {label: 'Alterar Senha', routerLink: `senha`, icon: 'security'}
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
