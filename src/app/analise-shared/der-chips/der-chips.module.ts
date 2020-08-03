import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { DerChipsComponent } from './der-chips.component';
import { FormsModule } from '@angular/forms';
import { AbacoDerTextModule } from '../der-text/der-text.module';
import { ReferenciadorArComponent } from './referenciador-ar/referenciador-ar.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    AbacoDerTextModule,
    SharedModule,
  ],
  declarations: [
    DerChipsComponent,
    ReferenciadorArComponent
  ],
  exports: [
    DerChipsComponent
  ]
})
export class AbacoDerChipsModule { }

