import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { ButtonModule, ChipsModule, DialogModule } from 'primeng/primeng';
import { DerChipsComponent } from './der-chips.component';
import { FormsModule } from '@angular/forms';
import { AbacoDerTextModule } from '../der-text/der-text.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    ButtonModule,
    ChipsModule,
    AbacoDerTextModule,
    DialogModule
  ],
  declarations: [
    DerChipsComponent
  ],
  exports: [
    DerChipsComponent
  ]
})
export class AbacoDerChipsModule { }

