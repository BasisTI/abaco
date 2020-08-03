import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FuncionalidadeDetailComponent, FuncionalidadeFormComponent, funcionalidadeRoute, FuncionalidadeService } from './';
import { FuncionalidadeListComponent } from './funcionalidade-list/funcionalidade-list.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(funcionalidadeRoute, { useHash: true }),
    SharedModule,
  ],
  declarations: [
    FuncionalidadeListComponent,
    FuncionalidadeDetailComponent,
    FuncionalidadeFormComponent
  ],
  providers: [
    FuncionalidadeService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FuncionalidadeModule{ }
