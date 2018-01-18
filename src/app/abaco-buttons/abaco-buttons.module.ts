import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GreenButtonComponent } from './green-button/green-button.component';
import { BlueButtonComponent } from './blue-button/blue-button.component';
import { WhiteButtonComponent } from './white-button/white-button.component';
import {
  ButtonModule,
} from 'primeng/primeng';
import { SubmitButtonComponent } from './submit-button/submit-button.component';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule
  ],
  declarations: [
    GreenButtonComponent,
    BlueButtonComponent,
    WhiteButtonComponent,
    SubmitButtonComponent
  ],
  exports: [
    GreenButtonComponent,
    BlueButtonComponent,
    WhiteButtonComponent,
    SubmitButtonComponent
  ]
})
export class AbacoButtonsModule { }
