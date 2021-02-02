import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageNotificationService } from '@nuvem/primeng-components';
import { SenhaService } from '../senha.service';
import { KeyPassword } from './key-password.model';

@Component({
  selector: 'app-recuperar-senha-form',
  templateUrl: './recuperar-senha-form.component.html',
  styleUrls: ['./recuperar-senha.component.scss']
})
export class RecuperarSenhaFormComponent implements OnInit {

  keyPassword: KeyPassword = new KeyPassword();

  newPassword: string

  newPasswordConfirm: string

  keyId: string;

  constructor(private route: ActivatedRoute, private senhaService: SenhaService,
    private router: Router, private pageNotificationService: PageNotificationService) {
    this.route.queryParams.subscribe(params => this.keyId = params['key']);
  }

  getLabel(label) {
    return label;
  }

  ngOnInit(): void {
  }

  finishResetPassword() {
    if (this.newPassword === this.newPasswordConfirm) {
      if (this.keyId) {
        this.keyPassword.key = this.keyId
      }
      this.keyPassword.newPassword = this.newPassword
      this.senhaService.finishPasswordReset(this.keyPassword).subscribe(() => {
        const msg = this.getLabel('Senha alterada com sucesso!');
        this.pageNotificationService.addSuccessMessage(msg);
        this.router.navigate(['/']);
      }, error => {

        if (error.error === "Incorrect password") {
          this.verificaErro("error.badPasswdLimits")
        }
        if (error.status == 500) {
          this.verificaErro("error.passwdInvalid")
        }
      });
    }
    else {
      this.verificaErro('error.passwdNotEqual');
    }
  }

  private verificaErro(tipoErro: string) {
    let msgErro: string;

    switch (tipoErro) {
      case 'error.passwdInvalid': {
        msgErro = this.getLabel('Link de redefinição de senha inválido!');
      }
        break;
      case 'error.badPasswdLimits': {
        msgErro = this.getLabel('Nova senha é muito pequena ou muito grande!');
      }
        break;
      case 'error.passwdNotEqual': {
        msgErro = this.getLabel('Nova senha não confere com a confirmação!');
      }
        break;
      default: {
        msgErro = this.getLabel('Configuracao.AlterarSenha.Mensagens.msgEntreiNoDefaultAlgoEstaErrado');
      }
    }
    this.pageNotificationService.addErrorMessage(msgErro);

  }
}
