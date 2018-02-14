import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-ellipsis-tooltip',
  templateUrl: './ellipsis-tooltip.component.html'
})
// TODO implementar OnChange
export class EllipsisTooltipComponent implements OnInit {

  private readonly MAX_SIZE = 15;

  @Input()
  value: string;

  valueToBeShown: string;

  tooltipText: string;

  showTooltip = false;

  ngOnInit() {
    if (this.value.length > this.MAX_SIZE) {
      this.doComponent();
    } else {
      this.valueToBeShown = this.value;
    }
  }

  private doComponent() {
    this.showTooltip = true;
    this.valueToBeShown = this.value.substring(0, this.MAX_SIZE) + '...';
    this.tooltipText = this.value;
  }


}

