import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageNotificationService } from '@nuvem/primeng-components';
import { Console } from 'console';
import { ResponseWrapper } from '../shared';
import { Sistema, SistemaService } from '../sistema';
import { TipoEquipe, TipoEquipeService } from '../tipo-equipe';
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

  constructor(private route: ActivatedRoute,
        private router: Router,
        private tipoEquipeService: TipoEquipeService,
        private configuracaoBaselineService: ConfiguracaoBaselineService,
        private pageNotificationService: PageNotificationService,
        private sistemaService: SistemaService) { 
          this.carregarComponentes();
        }

  ngOnInit(): void {
  
    
  }

  carregarComponentes(){
    this.configuracaoBaselineService.getAll().subscribe(res =>{
      this.configuracaoSistemaEquipe = res;
    });
  }

  // carregarSistemas(){
  //   this.sistemaService.dropDown().subscribe(res => {
  //     console.log('AQUI 2');
  //     this.sistemasSource = [];
  //     console.log(res);
  //     for (let index = 0; index < res.length; index++) {
  //       const sis = res[index];
  //       console.log(this.sistemasTarget.indexOf(sis));
  //       if(this.sistemasTarget.indexOf(sis) == -1){
  //         this.sistemasSource.push(sis);
  //       }
  //     }
  //   });
  // }

  // carregarTIpoEquipe(){
  //   console.log('AQUI 4');
  //   console.log('carregarTIpoEquipe');
  //   this.tipoEquipeService.dropDown().subscribe(res =>{
  //     this.tipoEquipeSource = [];
  //     console.log(res);
  //     for (let index = 0; index < res.length; index++) {
  //       const tp = res[index];
  //       if(this.tipoEquipeTarget.indexOf(tp) ==-1){
  //         this.tipoEquipeSource.push(tp);
  //       }
  //     }
  //   });
  // }

  save(){
    this.configuracaoBaselineService.create(this.configuracaoSistemaEquipe).subscribe(res => {
      this.configuracaoSistemaEquipe = res;
      this.pageNotificationService.addSuccessMessage(this.getLabel('Análise salva com sucesso'));
      // this.router.navigate(['/configuracao-baseline']);
  });
  }

  getLabel(label) {
    return label;
}

}
