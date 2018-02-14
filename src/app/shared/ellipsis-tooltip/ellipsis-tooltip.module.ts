import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { TooltipModule } from 'primeng/primeng';
import { EllipsisTooltipComponent } from './ellipsis-tooltip.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    TooltipModule,
  ], declarations: [
    EllipsisTooltipComponent
  ], exports: [
    EllipsisTooltipComponent
  ]
})
export class AbacoEllipsisTooltipModule { }
