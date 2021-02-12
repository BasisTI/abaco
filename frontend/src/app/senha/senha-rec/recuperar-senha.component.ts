import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@nuvem/angular-base';
import { PageNotificationService } from '@nuvem/primeng-components';
import { SenhaService } from '../senha.service';

@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.scss']
})
export class RecuperarSenhaComponent implements OnInit {

  public email: string;
  public login: string;
  public campo: string;

  constructor(private senhaService: SenhaService, private pageNotificationService: PageNotificationService,
    private router: Router) { }

  getLabel(label) {
    return label;
  }

  ngOnInit() {
  }

  sendResetPassword() {
    if (!this.campo) {
      return this.pageNotificationService.addErrorMessage(this.getLabel('Digite um e-mail!'));
    }

    this.campo.includes("@") ? this.email = this.campo : this.login = this.campo;

    this.senhaService.passwordReset(this.email, this.login).subscribe(() => {
      this.email = "";
      this.login = "";
      this.router.navigate(['/']);

    }, error => {
      this.pageNotificationService.addErrorMessage("Erro ao enviar e-mail de redefinição!")
    }, () => {
      this.pageNotificationService.addSuccessMessage("E-mail de redefinição enviado  com sucesso!");
    });
  }
}
