import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { PopupRegisterChangeVersionReadingComponent } from '@app/popups/popup-register-change-version-reading/popup-register-change-version-reading.component';

@Directive({
  selector: '[comment-bind-dialog]'
})
export class PopupRegisterChangeVersionReadingDirective {
  @Output() confirmedAction: EventEmitter<any> = new EventEmitter<any>();

  @Input() comment = '';
  @Input() date = new Date();

  constructor(private modalService: NgbModal) {
  }

  @HostListener('click', ['$event']) onClick() {
    this.openDialog();
  }

  openDialog() {
    const modalRef = this.modalService.open(PopupRegisterChangeVersionReadingComponent, {
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
