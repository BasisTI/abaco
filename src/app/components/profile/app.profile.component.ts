import { AppComponent } from '../../app.component';
import { Component } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';

@Component({
    selector: 'app-inline-profile',
    templateUrl: './app.profile.component.html',
    animations: [
        trigger('menu', [
            state('hidden', style({
                height: '0px'
            })),
            state('visible', style({
                height: '*'
            })),
            transition('visible => hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hidden => visible', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class AppInlineProfileComponent {

    active: boolean;

    constructor(public app: AppComponent) { }

    onClick(event) {
        this.active = !this.active;
        const time = 450;
        setTimeout(() => {
            this.app.layoutMenuScrollerViewChild.moveBar();
        }, time);
        event.preventDefault();
    }
}
