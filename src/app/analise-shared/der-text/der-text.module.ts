import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InputTextareaModule } from 'primeng/primeng';

import { DerTextComponent } from './der-text-component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    InputTextareaModule,
  ],
  declarations: [
    DerTextComponent
  ],
  exports: [
    DerTextComponent
  ]
})
export class AbacoDerTextModule { }
