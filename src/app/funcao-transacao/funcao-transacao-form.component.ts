import { Component, OnInit, Input } from '@angular/core';
import { AnaliseSharedDataService, PageNotificationService } from '../shared';
import { FuncaoTransacao } from './funcao-transacao.model';
import { Analise, ResumoFuncaoDados } from '../analise';
import { FatorAjuste } from '../fator-ajuste';

import * as _ from 'lodash';
import { Modulo } from '../modulo/index';
import { Funcionalidade } from '../funcionalidade/index';
import { SelectItem } from 'primeng/primeng';
import { Calculadora } from '../analise-shared/calculadora';
import { DatatableClickEvent } from '@basis/angular-components';
import { ConfirmationService } from 'primeng/primeng';

@Component({
  selector: 'app-analise-funcao-dados',
  templateUrl: './funcao-transacao-form.component.html'
})
export class FuncaoTransacaoFormComponent implements OnInit {

  ngOnInit() {

  }

}
