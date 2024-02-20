import {ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {ConfirmDialogDirective} from './confirm-dialog.directive';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';


describe('ConfirmDialogDirective', () => {
  let fixture: ComponentFixture<any>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgbModal, NgbActiveModal],
      declarations: [ConfirmDialogDirective, ConfirmDialogComponent]
    });

  });

  it('should create an instance', inject([NgbModal], (modalService: NgbModal) => {
    const directive = new ConfirmDialogDirective(modalService);
    expect(directive).toBeTruthy();
  }));
});
