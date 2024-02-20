import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SupplyType} from '@models';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DeleteDialogComponent} from 'app/widgets/delete-dialog/delete-dialog.component';

@Component({
  selector: 'tariffs-item',
  templateUrl: './tariffs-item.component.html',
  styleUrls: ['./tariffs-item.component.less']
})
export class TariffsItemComponent {

  @Input() tariff: any;

  @Output() editTariff = new EventEmitter();
  @Output() editTariffValue = new EventEmitter();
  @Output() addNewTariffVersion = new EventEmitter();
  @Output() deleteTariffVersion = new EventEmitter();
  @Output() addNewTariffValue = new EventEmitter();

  supplyType = SupplyType;

  constructor(private modalService: NgbModal) {
  }

  onTariffRowClick(event, id) {
    const actionButtonsClasses = ['dropdown-toggle', 'on-add-new-version', 'on-delete', 'on-add-new-value', 'on-edit-value'];
    if (event.target && actionButtonsClasses.find(c => event.target.classList.contains(c))) {
      return;
    }

    this.editTariff.emit(id);
  }

  onDeleteVersion(item) {
    const modalRef = this.modalService.open(DeleteDialogComponent, {backdrop: 'static'});
    modalRef.result.then(() => {
      this.deleteTariffVersion.emit(item);
    }, () => {
    });
  }
}
