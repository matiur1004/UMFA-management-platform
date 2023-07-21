import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingReportsComponent } from './building-reports.component';

describe('BuildingReportsComponent', () => {
  let component: BuildingReportsComponent;
  let fixture: ComponentFixture<BuildingReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildingReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildingReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
