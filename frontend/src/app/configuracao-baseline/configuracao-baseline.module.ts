import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BlockUiService } from '@nuvem/angular-base';
import { DatatableModule, PageNotificationService } from '@nuvem/primeng-components';
import { MultiSelectModule, PickListModule, SharedModule, TableModule } from 'primeng';
import { AbacoButtonsModule } from '../components/abaco-buttons/abaco-buttons.module';
import { SistemaService } from '../sistema';
import { TipoEquipeService } from '../tipo-equipe';
import { ConfiguracaoBaselineComponent } from './configuracao-baseline.component';
import { ConfiguracaoBaselineService } from './configuracao-baseline.service';



@NgModule({
  declarations: [ConfiguracaoBaselineComponent],
  imports: [
    CommonModule,
        HttpClientModule,
        FormsModule,
        //RouterModule.forRoot(FaseRoute, { useHash: true }),
        BrowserModule,
        AbacoButtonsModule,
        SharedModule,
        CommonModule,
        SharedModule,
        DatatableModule,
        MultiSelectModule,
        TableModule,
        PickListModule
  ],
  providers: [
    ConfiguracaoBaselineService,
    SistemaService,
    TipoEquipeService,
    PageNotificationService,
    BlockUiService
],
})
export class ConfiguracaoBaselineModule { }
