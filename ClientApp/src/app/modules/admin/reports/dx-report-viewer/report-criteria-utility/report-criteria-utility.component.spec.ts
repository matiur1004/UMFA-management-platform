import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCriteriaUtilityComponent } from './report-criteria-utility.component';

describe('ReportCriteriaUtilityComponent', () => {
  let component: ReportCriteriaUtilityComponent;
  let fixture: ComponentFixture<ReportCriteriaUtilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportCriteriaUtilityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportCriteriaUtilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
