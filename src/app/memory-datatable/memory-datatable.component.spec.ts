import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoryDatatableComponent } from './memory-datatable.component';

describe('MemoryDatatableComponent', () => {
  let component: MemoryDatatableComponent;
  let fixture: ComponentFixture<MemoryDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoryDatatableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoryDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
