import {
  Component,
  ViewChild,
  Input,
  Output,
  ContentChildren,
  QueryList,
  ChangeDetectorRef,
  AfterViewInit,
  EventEmitter
} from '@angular/core';
import { BaseEntity } from '../shared/index';
import { DataTable, Column } from 'primeng/primeng';
import { DatatableClickEvent } from '@basis/angular-components';

@Component({
  selector: 'app-memory-datatable',
  templateUrl: './memory-datatable.component.html',
})
export class MemoryDatatableComponent implements AfterViewInit {

  @Input()
  value: BaseEntity[];

  @Input()
  editEventName: string;

  @Input()
  deleteEventName: string;

  selectedRow: any;

  @Output()
  buttonClick: EventEmitter<DatatableClickEvent> = new EventEmitter<DatatableClickEvent>();

  @ViewChild(DataTable)
  primeDatatableComponent: any;

  @ContentChildren(Column)
  cols: QueryList<Column>;

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  ngAfterViewInit() {
    this.primeDatatableComponent.cols = this.cols;
    this.primeDatatableComponent.ngAfterContentInit();
    this.changeDetectorRef.detectChanges();
  }

  onClick(button: string, event: any) {
    this.buttonClick.emit(new DatatableClickEvent(button, this.selectedRow));
    event.stopPropagation();
    this.resetSelectedRow(button);
  }

  resetSelectedRow(button: string) {
    if (button === 'delete') {
        this.selectedRow = null;
    }
  }

}
