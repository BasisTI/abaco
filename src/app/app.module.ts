import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, BrowserXhr } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { DatatableModule, SharedModule, HttpService } from '@basis/angular-components';
import { NgProgressModule, NgProgressBrowserXhr } from 'ngx-progressbar';
import { AuthHttp } from 'angular2-jwt';
import { ConfirmationService } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { PRIMENG_IMPORTS } from './primeng-imports';
import 'rxjs/add/operator/toPromise';

import { AuthModule } from './auth.module';
import { AppRoutes } from './app.routes';
import { AppComponent } from './app.component';
import { AppMenuComponent, AppSubMenuComponent } from './app.menu.component';
import { AppTopBarComponent } from './app.topbar.component';
import { AppFooterComponent } from './app.footer.component';
import { AppRightPanelComponent } from './app.rightpanel.component';
import { AppBreadcrumbComponent } from './app.breadcrumb.component';
import { InlineProfileComponent } from './app.profile.component';
import { JhiDateUtils, BreadcrumbService, PageNotificationService } from './shared';

import { AbacoAlrModule } from './alr/alr.module';
import { AbacoManualModule } from './manual/manual.module';
import { AbacoFatorAjusteModule } from './fator-ajuste/fator-ajuste.module';
import { AbacoFuncaoTransacaoModule } from './funcao-transacao/funcao-transacao.module';
import { AbacoAnaliseModule} from './analise/analise.module';
import { AbacoOrganizacaoModule } from './organizacao/organizacao.module';
import { AbacoContratoModule } from './contrato/contrato.module';
import { AbacoTipoEquipeModule } from './tipo-equipe/tipo-equipe.module';
import { AbacoUserModule } from './user/user.module';
import { AbacoTipoFaseModule } from './tipo-fase/tipo-fase.module';
import { AbacoSistemaModule } from './sistema/sistema.module';
import { AbacoModuloModule } from './modulo/modulo.module';
import { AbacoFuncionalidadeModule } from './funcionalidade/funcionalidade.module';
import { MemoryDataTableModule } from './memory-datatable/memory-datatable.module';
import { UploadService } from './upload/upload.service';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutes,
    HttpModule,
    BrowserAnimationsModule,
    PRIMENG_IMPORTS,
    NgProgressModule,
    AuthModule,
    DatatableModule.forRoot(),
    SharedModule.forRoot(),
    AbacoAlrModule,
    AbacoManualModule,
    AbacoFatorAjusteModule,
    AbacoFuncaoTransacaoModule,
    AbacoAnaliseModule,
    AbacoOrganizacaoModule,
    AbacoContratoModule,
    AbacoTipoEquipeModule,
    AbacoUserModule,
    AbacoTipoFaseModule,
    AbacoSistemaModule,
    AbacoModuloModule,
    AbacoFuncionalidadeModule,
    MemoryDataTableModule
    /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
  ],
  declarations: [
    AppComponent,
    AppMenuComponent,
    AppSubMenuComponent,
    AppTopBarComponent,
    AppFooterComponent,
    AppRightPanelComponent,
    AppBreadcrumbComponent,
    InlineProfileComponent,
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: BrowserXhr, useClass: NgProgressBrowserXhr },
    // para habilitar o JWT, descomentar a linha abaixo
    // { provide: HttpService, useClass: HttpService, deps: [AuthHttp] },
    JhiDateUtils,
    BreadcrumbService,
    ConfirmationService,
    MessageService,
    PageNotificationService,
    UploadService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
