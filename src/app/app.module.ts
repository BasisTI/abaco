import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule, BrowserXhr, Http, RequestOptions, XHRBackend} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {NgProgressModule, NgProgressBrowserXhr} from 'ngx-progressbar';
import {AuthHttp, JwtHelper} from 'angular2-jwt';
import {ConfirmationService} from 'primeng/primeng';
import {MessageService} from 'primeng/components/common/messageservice';
import {PRIMENG_IMPORTS} from './primeng-imports';
import 'rxjs/add/operator/toPromise';
import {NgxMaskModule} from 'ngx-mask';

import {
    DatatableModule,
    SharedModule,
    HttpService,
    SecurityModule,
    AuthService,
    AUTH_CONFIG,
    VersionTagModule,
    PageNotificationModule
} from '@basis/angular-components';
import {authServiceFactory} from './auth-service-factory';
import {AuthModule} from './auth.module';
import {AppRoutes} from './app.routes';
import {AppComponent} from './app.component';
import {AppMenuComponent, AppSubMenuComponent} from './app.menu.component';
import {AppTopBarComponent} from './app.topbar.component';
import {AppFooterComponent} from './app.footer.component';
import {AppRightPanelComponent} from './app.rightpanel.component';
import {AppBreadcrumbComponent} from './app.breadcrumb.component';
import {InlineProfileComponent} from './app.profile.component';
import {JhiDateUtils, BreadcrumbService, PageNotificationService} from './shared';

import {AbacoManualModule} from './manual/manual.module';
import {AbacoFatorAjusteModule} from './fator-ajuste/fator-ajuste.module';
import {AbacoFuncaoTransacaoModule} from './funcao-transacao/funcao-transacao.module';
import {AbacoAnaliseModule} from './analise/analise.module';
import {AbacoOrganizacaoModule} from './organizacao/organizacao.module';
import {AbacoContratoModule} from './contrato/contrato.module';
import {AbacoTipoEquipeModule} from './tipo-equipe/tipo-equipe.module';
import {AbacoUserModule} from './user/user.module';
import {AbacoTipoFaseModule} from './tipo-fase/tipo-fase.module';
import {AbacoSistemaModule} from './sistema/sistema.module';
import {AbacoBaselineModule} from './baseline/baseline.module';
import {AbacoModuloModule} from './modulo/modulo.module';
import {AbacoFuncionalidadeModule} from './funcionalidade/funcionalidade.module';
import {AbacoFuncaoDadosModule} from './funcao-dados/funcao-dados.module';
import {MemoryDataTableModule} from './memory-datatable/memory-datatable.module';
import {UploadService} from './upload/upload.service';
import {FileUploadModule} from 'primeng/primeng';
import {LoginModule} from './login/login.module';
import {SenhaModule} from './senha/senha.module';
import {environment} from '../environments/environment';
import {MenuItemsService} from './shared/menu-items.service';
import {AdminGuard} from './admin.guard';
import {HttpClient} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AbacoElasticSearchModule} from './elasticsearch/elasticsearch.module';
import {autenticacaoHttpFactory} from './shared/autenticacao/autenticacao-http';

/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutes,
        BrowserAnimationsModule,
        PRIMENG_IMPORTS,
        NgProgressModule,
        AuthModule,
        DatatableModule.forRoot(),
        SharedModule.forRoot(),
        AbacoManualModule,
        AbacoFatorAjusteModule,
        AbacoFuncaoTransacaoModule,
        AbacoAnaliseModule,
        AbacoOrganizacaoModule,
        AbacoContratoModule,
        AbacoTipoEquipeModule,
        AbacoElasticSearchModule,
        AbacoUserModule,
        AbacoTipoFaseModule,
        AbacoSistemaModule,
        AbacoBaselineModule,
        AbacoModuloModule,
        AbacoFuncionalidadeModule,
        AbacoFuncaoDadosModule,
        MemoryDataTableModule,
        FileUploadModule,
        HttpClientModule,
        LoginModule,
        SenhaModule,
        SecurityModule.forRoot(),
        PageNotificationModule.forRoot(),
        NgxMaskModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        VersionTagModule.forRoot()
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
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        {provide: BrowserXhr, useClass: NgProgressBrowserXhr},
        // para habilitar o JWT, descomentar a linha abaixo
        // { provide: HttpService, useClass: HttpService, deps: [AuthHttp] },
        JhiDateUtils,
        BreadcrumbService,
        ConfirmationService,
        MessageService,
        PageNotificationService,
        UploadService,
        MenuItemsService,
        AdminGuard,
        JwtHelper,
        {provide: AUTH_CONFIG, useValue: environment.auth},
        {provide: AuthService, deps: [HttpService, AUTH_CONFIG], useFactory: authServiceFactory},
        {provide: Http, useFactory: autenticacaoHttpFactory, deps: [XHRBackend, RequestOptions, JwtHelper, AUTH_CONFIG] },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
