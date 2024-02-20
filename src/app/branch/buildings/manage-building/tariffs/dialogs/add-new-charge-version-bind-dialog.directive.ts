import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddNewChargeVersionComponent} from './add-new-charge-version/add-new-charge-version.component';

@Directive({
  selector: '[add-new-charge-version-bind-dialog]'
})
export class AddNewChargeVersionBindDialogDirective {
  @Input() branchId: string;
  @Input() buildingId: string;

  @Output() confirmAction: EventEmitter<any[]> = new EventEmitter<any[]>();

  constructor(private modalService: NgbModal) {
  }

  @HostListener('click', ['$event']) onClick() {
    this.openDialog();
  }

  openDialog() {
    const modalRef = this.modalService.open(AddNewChargeVersionComponent, {
      backdrop: 'static',
      windowClass: 'add-charge'
    });
    modalRef.componentInstance.branchId = this.branchId;
    modalRef.componentInstance.buildingId = this.buildingId;
    modalRef.result.then((result) => {
      this.confirmAction.emit(result);
    }, () => {
    });
  }

}
