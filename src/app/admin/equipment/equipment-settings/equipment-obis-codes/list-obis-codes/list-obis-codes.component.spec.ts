import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListObisCodesComponent } from './list-obis-codes.component';

describe('ListObisCodesComponent', () => {
  let component: ListObisCodesComponent;
  let fixture: ComponentFixture<ListObisCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListObisCodesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListObisCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
