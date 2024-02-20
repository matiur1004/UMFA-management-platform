import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StisticDataPanelComponent} from './stistic-data-panel.component';

describe('StisticDataPanelComponent', () => {
  let component: StisticDataPanelComponent;
  let fixture: ComponentFixture<StisticDataPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StisticDataPanelComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StisticDataPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
