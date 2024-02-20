import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ChangeStatusComponent} from './change-status/change-status.component';
import {TariffLineItemChargingType} from '@models';
import {
  AllocatedTariffDetailViewModel,
  ApprovalInfoViewModel
} from '../../../../shared/models/node-allocated-tariff.model';
import {StringExtension} from '@shared-helpers';

@Component({
  selector: 'tariffs-per-nodes',
  templateUrl: './tariffs-per-nodes.component.html',
  styleUrls: ['./tariffs-per-nodes.component.less']
})
export class TariffsPerNodesComponent {

  @Input() recommendedTariffs: any[];
  @Input() branchId: string;
  @Input() buildingId: string;
  @Input() versionId: string;
  @Input() buildingPeriodIsFinalized: boolean;
  @Output() delete = new EventEmitter();
  @Output() updateTariffIsBilling = new EventEmitter();
  @Output() updateLineItemIsBilling = new EventEmitter();
  @Output() updateLineItemIsActive = new EventEmitter();
  @Output() updateCategory = new EventEmitter();
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();
  chargingType = TariffLineItemChargingType;

  constructor(private modalService: NgbModal) {
  }

  private _tariffs: any[];

  get tariffs(): any[] {
    return this._tariffs;
  }

  @Input() set tariffs(tariffs: any[]) {
    this._tariffs = tariffs;

    this.tariffs.forEach(x => x.approvalInfo = (x.hasConflicts && !x.approvalInfo) ? <ApprovalInfoViewModel>{userId: StringExtension.NewGuid()} : x.approvalInfo);
  }

  getFilteredCategories(categories: any[], id: any) {
    return categories.filter(c => c.id != id);
  }

  getCategoryName(categories: any[], id: any) {
    let category = categories.find(c => c.id == id);
    return category ? category.name : 'Select category';
  }

  isDisabled(lineItems: any[]) {
    let filteredLineItems = lineItems.filter(l => l.isActive);
    return filteredLineItems.length > 1 ? false : true;
  }

  isDropdownButton(tariff: any) {
    if (tariff.isBilling) {
      let filteredLineItems = tariff.lineItems.filter(l => l.isBilling && l.isActive);
      if (filteredLineItems.length == 1)
        return false;
    }

    return true;
  }

  haveOnlyOneBillingTariff() {
    return this.tariffs.filter(el => el.isBilling).length === 1;
  }

  openChangeStatusModal(event, isBilling) {
    const modalRef = this.modalService.open(ChangeStatusComponent, {centered: true, windowClass: 'chng-status-dlg'});
    modalRef.componentInstance.status = isBilling ? 'Billing' : 'Read Only';
    modalRef.result.then((_) => {
      this.updateTariffIsBilling.emit({tariffId: event, isBilling: isBilling});
    }, () => {
    });
  }

  onCategorySelected(lineItem, ev) {
    if (ev.isRecommended) {
      lineItem.approvalInfo = null;
    } else {
      lineItem.approvalInfo = <ApprovalInfoViewModel>{
        userId: StringExtension.NewGuid()
      };
    }
  }

  onSelectedNode(item: AllocatedTariffDetailViewModel, ev) {
    item.approvalInfo.comment = ev.currentReadingNotes;
    item.approvalInfo.file = ev.file;
    item.approvalInfo.userName = ev.currentReadingCreatedByUserName;
    item.approvalInfo.date = null;
    item.approvalInfo.userId = null;
  }

  onCancel() {
    this.cancel.emit();
  }

  onSave(version) {
    this.save.emit({version: version});
  }
}
