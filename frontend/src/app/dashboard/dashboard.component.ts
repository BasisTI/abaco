import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '@nuvem/angular-base';
import { MenuComponent, MenusService, PageNotificationService } from '@nuvem/primeng-components';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { User } from '../user';
import { AuthService } from '../util/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  username: string;
  password: string;

  authenticated = false;

  private routeSub: Subscription;
  @ViewChild(MenuComponent, { static: true }) menu: MenuComponent;

  constructor(
    private authService: AuthenticationService<User>,
    private http: HttpClient,
    private pageNotificationService: PageNotificationService,
    private menuService : MenusService,
    private authAbacoService : AuthService
  ) { }

  ngAfterViewInit(): void {
    this.carregarMenu();
  }

  getLabel(label) {
    return label;
  }

  ngOnInit() {
    this.authenticated = this.authService.isAuthenticated();
  }
  carregarMenu() {
    this.authAbacoService.getRoles().subscribe(res =>{
      for (let index = 0; index < this.menuService.itens.length; index++) {
        const menu = this.menuService.itens[index];
        if(menu.label == 'Análise' && this.authAbacoService.possuiAlgumaRoles([AuthService.PREFIX_ROLE+'ANALISE_ACESSAR',
        AuthService.PREFIX_ROLE+'BASELINE_ACESSAR',
        AuthService.PREFIX_ROLE+'VALIDACAO_ACESSAR'])){
          menu.visible = true;
        }else if(menu.label == 'Cadastros' && this.authAbacoService.possuiAlgumaRoles([AuthService.PREFIX_ROLE+'FASE_ACESSAR',
        AuthService.PREFIX_ROLE+'MANUAL_ACESSAR',
        AuthService.PREFIX_ROLE+'ORGANIZACAO_ACESSAR',
        AuthService.PREFIX_ROLE+'SISTEMA_ACESSAR',
        AuthService.PREFIX_ROLE+'TIPO_EQUIPE_ACESSAR',
        AuthService.PREFIX_ROLE+'USUARIO_ACESSAR',
        AuthService.PREFIX_ROLE+'STATUS_ACESSAR',
        AuthService.PREFIX_ROLE+'NOMENCLATURA_ACESSAR',
        AuthService.PREFIX_ROLE+'PERFIL_ACESSAR'])){
          menu.visible = true;
        }
        for (let index = 0; index < menu.items.length; index++) {
          const submenu = menu.items[index];
          if(submenu.label == 'Fase'){
            submenu.visible = this.authAbacoService.possuiRole(AuthService.PREFIX_ROLE+'FASE_ACESSAR');
          }else if(submenu.label == 'Manual'){
            submenu.visible = this.authAbacoService.possuiRole(AuthService.PREFIX_ROLE+'MANUAL_ACESSAR');
          }else if(submenu.label == 'Organização'){
            submenu.visible = this.authAbacoService.possuiRole(AuthService.PREFIX_ROLE+'ORGANIZACAO_ACESSAR');
          }else if(submenu.label == 'Sistema'){
            submenu.visible = this.authAbacoService.possuiRole(AuthService.PREFIX_ROLE+'SISTEMA_ACESSAR');
          }else if(submenu.label == 'Tipo Equipe'){
            submenu.visible = this.authAbacoService.possuiRole(AuthService.PREFIX_ROLE+'TIPO_EQUIPE_ACESSAR');
          }else if(submenu.label == 'Usuários'){
            submenu.visible = this.authAbacoService.possuiRole(AuthService.PREFIX_ROLE+'USUARIO_ACESSAR');
          }else if(submenu.label == 'Status'){
            submenu.visible = this.authAbacoService.possuiRole(AuthService.PREFIX_ROLE+'STATUS_ACESSAR');
          }else if(submenu.label == 'Nomenclatura'){
            submenu.visible = this.authAbacoService.possuiRole(AuthService.PREFIX_ROLE+'NOMENCLATURA_ACESSAR');
          }else if(submenu.label == 'Perfil'){
            submenu.visible = this.authAbacoService.possuiRole(AuthService.PREFIX_ROLE+'PERFIL_ACESSAR');
          }else if(submenu.label == 'Análise'){
            submenu.visible = this.authAbacoService.possuiRole(AuthService.PREFIX_ROLE+'ANALISE_ACESSAR');
          }else if(submenu.label == 'Baseline'){
            submenu.visible = this.authAbacoService.possuiRole(AuthService.PREFIX_ROLE+'BASELINE_ACESSAR');
          }else if(submenu.label == 'Validação' && this.authAbacoService.possuiRole(AuthService.PREFIX_ROLE+'VALIDACAO_ACESSAR')){
            submenu.visible = true;
          }
        }
      }
    });
  }

  ngOnDestroy() {
  }

  login() {

    if (!this.username || !this.password) {
      this.pageNotificationService.addErrorMessage(this.getLabel('Por favor preencher os campos Obrigatórios!'));
      return;
    }
    if (this.password.length < 4) {
      this.pageNotificationService.addErrorMessage(this.getLabel('A senha precisa ter no mínimo 4 caracteres!'));
      return;
    }
  }
  protected getUserDetails(): Observable<any> {
    return this.http.get<any>(`${environment.auth.detailsUrl}`);
  }

  authenticatedUserFullName(): string {
    const storageUser = this.authService.getUser();
    if (!storageUser) {
      return;
    }
    return storageUser.firstName + ' ' + storageUser.lastName;
  }

}
