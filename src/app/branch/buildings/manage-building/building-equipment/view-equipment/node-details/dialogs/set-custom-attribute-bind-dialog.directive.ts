import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DialogSetCustomAttributeComponent} from './dialog-set-custom-attribute/dialog-set-custom-attribute.component';


@Directive({
  selector: '[set-custom-attribute-bind-dialog]'
})
export class SetCustomAttributeBindDialogDirective {
  @Output() confirmAction: EventEmitter<any> = new EventEmitter<any>();

  @Input('set-custom-attribute-bind-dialog') attribute: any;

  constructor(
    private modalService: NgbModal,
  ) {
  }

  @HostListener('click', ['$event']) onClick() {
    this.openDialog();
  }

  openDialog() {
    const options: any = {
      backdrop: 'static',
      windowClass: 'set-custom-attribute-modal'
    }
    const modalRef = this.modalService.open(DialogSetCustomAttributeComponent, options);
    modalRef.componentInstance.data = this.attribute;
    modalRef.result.then((res: any) => {
      this.confirmAction.emit(res);
    }, () => {
    });
  }
}
