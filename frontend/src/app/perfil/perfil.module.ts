import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DatatableModule } from '@nuvem/primeng-components';
import { MultiSelectModule } from 'primeng';
import { AbacoButtonsModule } from '../components/abaco-buttons/abaco-buttons.module';
import { SharedModule } from '../shared/shared.module';
import { PerfilDetailComponent } from './perfil-detail/perfil-detail.component';
import { PerfilFormComponent } from './perfil-form/perfil-form.component';
import { PerfilListComponent } from './perfil-list/perfil-list.component';
import { perfilRoute } from './perfil.route';
import { PerfilService } from './perfil.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(perfilRoute, { useHash: true }),
    DatatableModule,
    AbacoButtonsModule,
    SharedModule,
    MultiSelectModule
  ],
  declarations: [
    PerfilListComponent,
    PerfilDetailComponent,
    PerfilFormComponent,
  ],
  providers: [
    PerfilService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PerfilModule {}
