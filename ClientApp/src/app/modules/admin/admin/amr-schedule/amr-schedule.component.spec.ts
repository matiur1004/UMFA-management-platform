import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmrScheduleComponent } from './amr-schedule.component';

describe('AmrScheduleComponent', () => {
  let component: AmrScheduleComponent;
  let fixture: ComponentFixture<AmrScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmrScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmrScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
