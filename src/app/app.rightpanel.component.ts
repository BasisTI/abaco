import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { AppComponent } from './app.component';
declare var jQuery: any;

@Component({
  selector: 'app-rightpanel',
  template: `
    <div class="layout-rightpanel" [ngClass]="{'layout-rightpanel-active': app.rightPanelActive}" (click)="app.onRightPanelClick()">
      
    </div>
  `
})
export class AppRightPanelComponent implements AfterViewInit, OnDestroy {

  rightPanelMenuScroller: HTMLDivElement;

  @ViewChild('rightPanelMenuScroller') rightPanelMenuScrollerViewChild: ElementRef;

  constructor(public app: AppComponent) { }

  ngAfterViewInit() {
    this.rightPanelMenuScroller = <HTMLDivElement>this.rightPanelMenuScrollerViewChild.nativeElement;

    setTimeout(() => {
      jQuery(this.rightPanelMenuScroller).nanoScroller({ flash: true });
    }, 10);
  }

  ngOnDestroy() {
    jQuery(this.rightPanelMenuScroller).nanoScroller({ flash: true });
  }
}
