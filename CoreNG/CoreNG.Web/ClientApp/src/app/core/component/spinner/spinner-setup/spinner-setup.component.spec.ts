import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerSetupComponent } from './spinner-setup.component';

describe('SpinnerSetupComponent', () => {
  let component: SpinnerSetupComponent;
  let fixture: ComponentFixture<SpinnerSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpinnerSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnerSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
