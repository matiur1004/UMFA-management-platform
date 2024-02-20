import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SupplyType} from '@models';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DeleteDialogComponent} from '../../../../widgets/delete-dialog/delete-dialog.component';

@Component({
  selector: 'supplier-item',
  templateUrl: './supplier-item.component.html',
  styleUrls: ['./supplier-item.component.less']
})
export class SupplierItemComponent implements OnInit {
  @Input() supplier;
  @Output() onEdit = new EventEmitter();
  @Output() onDelete = new EventEmitter();

  SupplyType = SupplyType;

  constructor(private modalService: NgbModal) {
  }

  getAddressLine = (address) => {
    if (!address) return '';
    const addressLine = [
      address.line1,
      address.line2,
      address.suburb,
      address.city,
      address.province,
      address.country
    ].reduce((acc, str) => str ? acc + str + ', ' : acc, '');

    return addressLine.substring(0, addressLine.length - 2);
  }

  ngOnInit() {
  }

  onEditClick(event, id) {
    if (event.target && (event.target.classList.contains('dropdown-toggle') || event.target.classList.contains('on-delete')))
      return;

    this.onEdit.emit(id);
  }

  onDeleteClick(id) {
    const modalRef = this.modalService.open(DeleteDialogComponent, {
      backdrop: 'static',
      windowClass: 'add-tariff-dets-modal'
    });
    modalRef.result.then(() => {
      this.onDelete.emit(id);
    }, () => {
    });

  }

}
