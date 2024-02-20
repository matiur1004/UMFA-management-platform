import {CommentBindDialogDirective} from './comment-bind-dialog.directive';
import {inject, TestBed} from '@angular/core/testing';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';

describe('CommentBindDialogDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgbModal, NgbActiveModal],
      declarations: [CommentBindDialogDirective]
    });

  });
  it('should create an instance', inject([NgbModal], (modalService: NgbModal) => {
    const directive = new CommentBindDialogDirective(modalService);
    expect(directive).toBeTruthy();
  }));
});
