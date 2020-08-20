import { Component, OnInit, OnDestroy } from "@angular/core";
import { TipoEquipe } from "../tipo-equipe.model";
import { Subscription, Observable } from "rxjs";
import { Organizacao, OrganizacaoService } from "src/app/organizacao";
import { ActivatedRoute, Router } from "@angular/router";
import { TipoEquipeService } from "../tipo-equipe.service";
import { PageNotificationService } from "@nuvem/primeng-components";
import { UserService } from "src/app/user";
import { User } from "../../user";


@Component({
  selector: 'jhi-tipo-equipe-form',
  templateUrl: './tipo-equipe-form.component.html'
})

export class TipoEquipeFormComponent implements OnInit, OnDestroy {

  tipoEquipe: TipoEquipe;

  isSaving: boolean;

  private routeSub: Subscription;

  organizacoes: Organizacao[];
  users:User[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tipoEquipeService: TipoEquipeService,
    private pageNotificationService: PageNotificationService,
    private organizacaoService: OrganizacaoService,
    private userService: UserService,
  ) { }

  getLabel(label) {
    return label;
  }

  ngOnInit() {
    this.isSaving = false;
    this.routeSub = this.route.params.subscribe(params => {
      this.tipoEquipe = new TipoEquipe();
      if (params['id']) {
        this.tipoEquipeService.find(params['id'])
        .subscribe(tipoEquipe => {
          this.tipoEquipe = tipoEquipe;
          this.userService.getUsersFromOrganização(this.tipoEquipe.organizacoes).subscribe(response => {
            this.users = response;
          });
        });
      }
    });
    this.organizacaoService.dropDownActive().subscribe((res) => {
      this.organizacoes = res;
    });
  }

  save(form) {

    if (!form.valid) {
      this.pageNotificationService.addErrorMessage('Por favor preencher os campos Obrigatórios!');
      return;
    }

    this.isSaving = true;
    let teamTypesRegistered: Array<TipoEquipe>;
    this.tipoEquipeService.dropDown().subscribe(response => {
      teamTypesRegistered = response;
      if (this.tipoEquipe.id !== undefined) {
        if (this.checkFieldsMaxLength() && !this.checkDuplicity(teamTypesRegistered)) {
          this.subscribeToSaveResponse(this.tipoEquipeService.update(this.tipoEquipe));
        }
      } else {
        if (this.checkFieldsMaxLength() && !this.checkDuplicity(teamTypesRegistered)) {
          this.subscribeToSaveResponse(this.tipoEquipeService.create(this.tipoEquipe));
        }
      }
    });
  }

  private checkDuplicity(teamTypes: Array<TipoEquipe>) {
    let isAlreadyRegistered = false;

    if (teamTypes) {
      teamTypes.forEach(each => {
        if (this.tipoEquipe.nome === each.nome && this.tipoEquipe.id !== each.id) {
          isAlreadyRegistered = true;
          this.pageNotificationService.addErrorMessage('Já existe um Tipo de Equipe registrado com este nome!');
        }
      });
    }

    return isAlreadyRegistered;
  }

  private resetMarkFields() {
    document.getElementById('nome_tipo_equipe').setAttribute('style', 'border-color: #bdbdbd');
    document.getElementById('org_tipo_equipe').setAttribute('style', 'border-color: #bdbdbd');
  }

  private checkFieldsMaxLength() {
    let isValid = false;

    if (this.tipoEquipe.nome.length < 255) {
      isValid = true;
    } else {
      this.pageNotificationService.addErrorMessage(this.getLabel('Cadastros.TipoEquipe.Mensagens.msgCampoNomeExcedeNumeroCaracteresPermitidos'));
    }

    return isValid;
  }

  private subscribeToSaveResponse(result: Observable<TipoEquipe>) {
    result.subscribe((res: TipoEquipe) => {
      this.isSaving = false;
      this.router.navigate(['/admin/tipoEquipe']);
      (this.tipoEquipe.id == null) ? (this.pageNotificationService.addCreateMsg()) : (this.pageNotificationService.addUpdateMsg());

    }, (error: Response) => {
      this.isSaving = false;
      switch (error.status) {
        case 400: {
          let invalidFieldNamesString = '';
          const fieldErrors = JSON.parse(error['_body']).fieldErrors;
          // invalidFieldNamesString = this.pageNotificationService.getInvalidFields(fieldErrors);
          this.pageNotificationService.addErrorMessage(this.getLabel('Cadastros.TipoEquipe.Mensagens.msgCamposInvalidos') + invalidFieldNamesString);
        }
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  public informarNome(): string {
    if (!this.tipoEquipe.nome) {
      return this.getLabel('Campo Obrigatório.');
    }
  }

  public informarOrganizacao(): string {
    if (!this.tipoEquipe.organizacoes) {
      return this.getLabel('Campo Obrigatório.');
    }
  }
  public loadUserCFPS(){
    this.tipoEquipe.cfpsResponsavel = null;
    this.userService.getUsersFromOrganização(this.tipoEquipe.organizacoes).subscribe(response => {
      this.users = null;
      this.users = this.userService.convertResponse(response);
  });
  }

}
