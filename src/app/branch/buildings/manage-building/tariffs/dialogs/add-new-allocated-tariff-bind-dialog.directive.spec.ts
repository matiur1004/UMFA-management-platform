import {async, TestBed} from '@angular/core/testing';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Component} from '@angular/core';


import {AddNewAllocatedTariffBindDialogDirective} from './add-new-allocated-tariff-bind-dialog.directive';

describe('AddNewAllocatedTariffBindDialogDirective', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddNewAllocatedTariffBindDialogDirective,
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
  template: '<button add-new-allocated-tariff-bind-dialog>Button</button>'
})
class MockButton {

}
