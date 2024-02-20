import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailConsumptionTenantsListComponent } from './detail-consumption-tenants-list.component';

describe('DetailConsumptionTenantsListComponent', () => {
  let component: DetailConsumptionTenantsListComponent;
  let fixture: ComponentFixture<DetailConsumptionTenantsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailConsumptionTenantsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailConsumptionTenantsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
