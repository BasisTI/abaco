import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { ScrollPanel } from 'primeng';

@Component({
    selector: 'app-rightpanel',
    templateUrl: './app.rightpanel.component.html'
})
export class AppRightpanelComponent implements AfterViewInit {

    @ViewChild('scrollRightPanel', { static: true }) rightPanelMenuScrollerViewChild: ScrollPanel;

    constructor(public app: AppComponent) { }

    ngAfterViewInit() {
        setTimeout(() => { this.rightPanelMenuScrollerViewChild.moveBar(); }, 3000);
    }
}
