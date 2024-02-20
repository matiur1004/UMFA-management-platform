import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditObiscodesComponent } from './edit-obiscodes.component';

describe('EditObiscodesComponent', () => {
  let component: EditObiscodesComponent;
  let fixture: ComponentFixture<EditObiscodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditObiscodesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditObiscodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
