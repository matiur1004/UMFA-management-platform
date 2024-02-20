import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailConsumptionItemComponent } from './detail-consumption-item.component';

describe('DetailConsumptionItemComponent', () => {
  let component: DetailConsumptionItemComponent;
  let fixture: ComponentFixture<DetailConsumptionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailConsumptionItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailConsumptionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
