import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemListComponent } from './addItem-List.component';

describe('LoadprofileArrayComponent', () => {
  let component: AddItemListComponent;
  let fixture: ComponentFixture<AddItemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddItemListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
