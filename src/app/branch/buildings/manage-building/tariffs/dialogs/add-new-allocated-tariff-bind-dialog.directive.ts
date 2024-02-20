import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddNewAllocatedTariffComponent} from './add-new-allocated-tariff/add-new-allocated-tariff.component';

@Directive({
  selector: '[add-new-allocated-tariff-bind-dialog]'
})
export class AddNewAllocatedTariffBindDialogDirective {
  @Input() branchId: string;
  @Input() buildingId: string;
  @Input() isSaveOutside = false;

  @Output() confirmAction: EventEmitter<any[]> = new EventEmitter<any[]>();

  constructor(private modalService: NgbModal) {
  }

  @HostListener('click', ['$event']) onClick() {
    this.openDialog();
  }

  openDialog() {
    const modalRef = this.modalService.open(AddNewAllocatedTariffComponent, {
      backdrop: 'static',
      windowClass: 'add-new-tariff-building-modal'
    });
    modalRef.componentInstance.branchId = this.branchId;
    modalRef.componentInstance.buildingId = this.buildingId;
    modalRef.componentInstance.isSaveOutside = this.isSaveOutside;
    modalRef.result.then((result) => {
      this.confirmAction.emit(result);
    }, () => {
    });
  }

}
