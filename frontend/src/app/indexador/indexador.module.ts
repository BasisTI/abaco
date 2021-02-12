import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IndexadorComponent } from './indexador.component';
import { IndexadorService } from './indexador.service';
import { SharedModule } from '../shared/shared.module';


@NgModule({
    imports: [
        HttpClientModule,
        FormsModule,
        SharedModule
    ],
    declarations: [
        IndexadorComponent
    ],
    providers: [
        IndexadorService
      ],
})


export class IndexadorModule {}
