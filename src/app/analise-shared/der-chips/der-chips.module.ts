import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { ButtonModule, ChipsModule } from 'primeng/primeng';
import { DerChipsComponent } from './der-chips.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    ButtonModule,
    ChipsModule
  ],
  declarations: [
    DerChipsComponent
  ],
  exports: [
    DerChipsComponent
  ]
})
export class AbacoDerChipsModule { }

