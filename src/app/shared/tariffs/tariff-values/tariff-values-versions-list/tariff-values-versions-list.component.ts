import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DeleteDialogComponent} from 'app/widgets/delete-dialog/delete-dialog.component';
import {OrderVersion, TariffValueVersionInfoViewModel} from '@models';
import {getActiveOrderClass, getOrderClasses} from '@shared-helpers';

@Component({
  selector: 'tariff-values-versions-list',
  templateUrl: './tariff-values-versions-list.component.html',
  styleUrls: ['./tariff-values-versions-list.component.less']
})

export class TariffValuesVersionsListComponent {
  expandedMajorVersions: number[] = [];
  @Input() title: string;
  @Input() orderIndex: number;
  @Input() isLastTariffVersion: boolean;
  @Output() changeOrderIndex = new EventEmitter();
  @Output() addNewValue = new EventEmitter();
  @Output() addNewVersion = new EventEmitter();
  @Output() editVersion = new EventEmitter();
  @Output() deleteValue = new EventEmitter();
  @Output() deleteVersion = new EventEmitter();
  orderType = OrderVersion;
  getOrderClasses = getOrderClasses;
  getActiveOrderClass = getActiveOrderClass;

  constructor(private modalService: NgbModal) {
  }

  private _tariffVersions: TariffValueVersionInfoViewModel[];

  get tariffVersions(): TariffValueVersionInfoViewModel[] {
    return this._tariffVersions;
  }

  @Input()
  set tariffVersions(param: TariffValueVersionInfoViewModel[]) {
    const versionsWithSubversions = param.filter(item => item.isActual);

    for (const value of versionsWithSubversions) {
      value.subVersions = param.filter(item => item.majorVersion === value.majorVersion);

      if (this.expandedMajorVersions.some(item => item === value.majorVersion)) {
        value.isExpanded = true;
      }
    }

    this._tariffVersions = versionsWithSubversions;
  }

  onOrder(order: number): void {
    if (this.orderIndex === order || (this.orderIndex === (order * -1))) {
      this.changeOrderIndex.emit(this.orderIndex *= -1);
    } else {
      this.changeOrderIndex.emit(order);
    }
  }

  onValueDelete(valueId: string): void {
    const modalRef = this.modalService.open(DeleteDialogComponent, {backdrop: 'static'});
    modalRef.result.then(() => {
      this.deleteValue.emit(valueId);
    }, () => {
    });
  }

  onVersionDelete(versionId: string): void {
    const modalRef = this.modalService.open(DeleteDialogComponent, {backdrop: 'static'});
    modalRef.result.then(() => {
      this.deleteVersion.emit(versionId);
    }, () => {
    });
  }

  expandOrCollapseValue(item: TariffValueVersionInfoViewModel): void {
    const newValue = !item.isExpanded;

    item.isExpanded = newValue;

    this.expandedMajorVersions = newValue
      ? [...this.expandedMajorVersions, item.majorVersion]
      : this.expandedMajorVersions.filter(v => v !== item.majorVersion);
  }
}
