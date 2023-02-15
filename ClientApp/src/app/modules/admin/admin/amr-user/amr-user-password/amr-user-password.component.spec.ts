import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmrUserPasswordComponent } from './amr-user-password.component';

describe('AmrUserPasswordComponent', () => {
  let component: AmrUserPasswordComponent;
  let fixture: ComponentFixture<AmrUserPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmrUserPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmrUserPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
