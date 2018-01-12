import { MenuItem } from 'primeng/primeng';
export class MenuItems {

    static all: MenuItem[] =
    [
        { label: 'Login', routerLink: 'login' },
        { label: 'Administração', icon: 'supervisor_account',
          items: [
            { label: 'Tipo de Equipe', routerLink: 'tipoEquipe' },
            { label: 'Usuários', routerLink: 'user'}
          ]
        },
        { label: 'Cadastros Básicos', icon: 'description',
          items: [
            { label: 'Tipo de Fase', routerLink: 'tipoFase' },
            { label: 'Manual', routerLink: 'manual' },
            { label: 'Organização', routerLink: 'organizacao' },
            { label: 'Sistema', routerLink: 'sistema' }
          ]
        },
        { label: 'Análise', icon: 'insert_chart',
          items: [
            { label: 'Análise' },
            { label: 'Validação' }
          ]
        }
      ];

}
