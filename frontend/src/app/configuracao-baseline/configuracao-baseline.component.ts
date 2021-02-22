import { Component, OnInit } from '@angular/core';
import { BlockUiService } from '@nuvem/angular-base';
import { PageNotificationService } from '@nuvem/primeng-components';
import { Sistema } from '../sistema';
import { TipoEquipe } from '../tipo-equipe';
import { ConfiguracaoBaselineService } from './configuracao-baseline.service';
import { ConfiguracaoBaseline } from './model/configuracao-baseline.model';
import { ConfiguracaoSistemaEquipe } from './model/configuracao-sistema-equipe.model';

@Component({
  selector: 'app-configuracao-baseline',
  templateUrl: './configuracao-baseline.component.html',
  styleUrls: ['./configuracao-baseline.component.css']
})
export class ConfiguracaoBaselineComponent implements OnInit {


  sistemasSource : Sistema[] = [];
  tipoEquipeSource : TipoEquipe[] = [];
  sistemasTarget : Sistema[] = [];
  tipoEquipeTarget : TipoEquipe[] = [];

  configuracacoes : ConfiguracaoBaseline[];
  cols: any[];

  configuracaoSistemaEquipe : ConfiguracaoSistemaEquipe;
  
  

  configuracoes :ConfiguracaoBaseline[] = [];

  constructor(private configuracaoBaselineService: ConfiguracaoBaselineService,
        private pageNotificationService: PageNotificationService,
        private blockUiService:BlockUiService) { 
          this.blockUiService.show();
          this.carregarComponentes();
        }

  ngOnInit(): void {
  
    
  }

  carregarComponentes(){
    this.configuracaoBaselineService.getAll().subscribe(res =>{
      this.configuracaoSistemaEquipe = res;
      this.blockUiService.hide();
    });
  }

  save(){
    this.configuracaoBaselineService.create(this.configuracaoSistemaEquipe).subscribe(res => {
      this.configuracaoSistemaEquipe = res;
      this.pageNotificationService.addSuccessMessage(this.getLabel('Análise salva com sucesso'));
  });
  }

  getLabel(label) {
    return label;
}

}
