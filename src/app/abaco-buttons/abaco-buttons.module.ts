import { ExportButtonComponent } from './export-button/export-button.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GreenButtonComponent } from './green-button/green-button.component';
import { BlueButtonComponent } from './blue-button/blue-button.component';
import { WhiteButtonComponent } from './white-button/white-button.component';
import { GrayButtonComponent } from './gray-button/gray-button.component';
import { RedButtonComponent } from './red-button/red-button.component';
import {
  ButtonModule, SplitButton, SplitButtonModule,
} from 'primeng/primeng';
import { SubmitButtonComponent } from './submit-button/submit-button.component';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    SplitButtonModule
  ],
  declarations: [
    GrayButtonComponent,
    GreenButtonComponent,
    BlueButtonComponent,
    WhiteButtonComponent,
    SubmitButtonComponent,
    RedButtonComponent,
    ExportButtonComponent
  ],
  exports: [
    GrayButtonComponent,
    GreenButtonComponent,
    BlueButtonComponent,
    WhiteButtonComponent,
    SubmitButtonComponent,
    RedButtonComponent,
    ExportButtonComponent
  ]
})
export class AbacoButtonsModule { }
