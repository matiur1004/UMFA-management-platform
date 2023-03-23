import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmrScheduleEditComponent } from './amr-schedule-edit.component';

describe('AmrScheduleEditComponent', () => {
  let component: AmrScheduleEditComponent;
  let fixture: ComponentFixture<AmrScheduleEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmrScheduleEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmrScheduleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
