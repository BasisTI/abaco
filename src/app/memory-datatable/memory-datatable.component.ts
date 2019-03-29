import { TranslateService } from '@ngx-translate/core';
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
  editEventName = 'edit';

  @Input()
  deleteEventName = 'delete';

  @Input()
  cloneEventName = 'clone';

  @Input()
  crudEventName = 'crud';

  selectedRow: any;

  @Input()
  disableEdit: boolean;

  @Input()
  disableDelete: boolean;

  @Input()
  disableClone: boolean;

  @Input()
  disableCrud: boolean;

  @Input()
  showCrud: boolean = false;

  @Input()
  responsive = true;

  @Input()
  scrollable = false;

  @Input()
  scrollWidth = '';

  @Input()
  rows = 10;

  @Input()
  paginator = false;

  sortF: string;

  @Output()
  buttonClick: EventEmitter<DatatableClickEvent> = new EventEmitter<DatatableClickEvent>();

  @ViewChild(DataTable)
  primeDatatableComponent: any;

  @ContentChildren(Column)
  cols: QueryList<Column>;

  constructor(private changeDetectorRef: ChangeDetectorRef, private translate: TranslateService) { }

  getLabel(label) {
    let str: any;
    this.translate.get(label).subscribe((res: string) => {
      str = res;
    }).unsubscribe();
    return str;
  }

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

  changeSort(event) {
    this.sortF = event.field;
  }

}
