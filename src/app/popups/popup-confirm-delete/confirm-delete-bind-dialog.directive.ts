import {Directive, EventEmitter, HostListener, Output} from '@angular/core';
import {DialogConfirmDeleteComponent} from './dialog-confirm-delete/dialog-confirm-delete.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Directive({
  selector: '[confirm-delete-bind-dialog]'
})
export class ConfirmDeleteBindDialogDirective {
  @Output() onConfirmerAction: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private modalService: NgbModal
  ) {
  }

  @HostListener('click', ['$event']) onClick() {
    const modalRef = this.modalService.open(DialogConfirmDeleteComponent, {
      backdrop: 'static',
      windowClass: 'confirm-delete-modal'
    });
    modalRef.result.then((res) => {
      this.onConfirmerAction.emit(true);
    }, () => {
    });
  }
}
