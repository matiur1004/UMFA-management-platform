import {async, TestBed} from '@angular/core/testing';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Component} from '@angular/core';

import {AddNewChargeVersionBindDialogDirective} from './add-new-charge-version-bind-dialog.directive';

describe('AddNewChargeVersionBindDialogDirective', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddNewChargeVersionBindDialogDirective,
        MockButton
      ],
      imports: [NgbModule.forRoot()],
      providers: []
    })
      .compileComponents();
  }));

  it('should create an instance', () => {
    const fixture = TestBed.createComponent(MockButton);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});

@Component({
  template: '<button add-new-charge-version-bind-dialog>Button</button>'
})
class MockButton {

}
