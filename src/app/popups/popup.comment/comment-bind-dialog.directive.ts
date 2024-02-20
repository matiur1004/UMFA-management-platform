import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PopupCommentComponent} from './popup.comment.component';


@Directive({
  selector: '[comment-bind-dialog]'
})
export class CommentBindDialogDirective {
  @Output() confirmedAction: EventEmitter<any> = new EventEmitter<any>();

  @Input() comment = '';
  @Input() date = new Date();

  constructor(private modalService: NgbModal) {
  }

  @HostListener('click', ['$event']) onClick() {
    this.openDialog();
  }

  openDialog() {
    const modalRef = this.modalService.open(PopupCommentComponent, {
      backdrop: 'static',
      windowClass: 'comment-modal'
    });

    modalRef.componentInstance.date = this.date;
    modalRef.componentInstance.comment = this.comment;

    modalRef.result.then(({comment, date, actionType}) => {
      this.confirmedAction.emit({comment, date, actionType});
    }, () => {
    });
  }
}
