import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';

import {SuppliersComponent} from './suppliers.component';

@Component({
  selector: 'allocated-suppliers',
  template: '<div>allocated-suppliers</div>',
})
class AllocatedSuppliersComponent {
  constructor() {
  }
}

describe('SuppliersComponent', () => {
  let component: SuppliersComponent;
  let fixture: ComponentFixture<SuppliersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AllocatedSuppliersComponent, SuppliersComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
