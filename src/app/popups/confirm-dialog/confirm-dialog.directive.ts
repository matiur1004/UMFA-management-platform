import {Directive, EventEmitter, HostListener, Output} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';

@Directive({
  selector: '[confirm-dialog]'
})
export class ConfirmDialogDirective {

  @Output() confirmAction: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private modalService: NgbModal
  ) {
  }

  @HostListener('click', ['$event']) onClick() {
    this.openDialog();
  }

  openDialog() {
    const options: any = {
      backdrop: 'static',
      windowClass: 'confirm-dialog-modal'
    }
    const modalRef = this.modalService.open(ConfirmDialogComponent, options);
    modalRef.result.then(res => this.confirmAction.emit(true), () => {
    });
  }
}
