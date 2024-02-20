import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {getActiveOrderClass, getOrderClasses, getSortValue} from '@shared-helpers';
import {OrderVersion} from '../../../shared/models';

@Component({
  selector: 'charge-values-versions-list',
  templateUrl: './charge-values-versions-list.component.html',
  styleUrls: ['./charge-values-versions-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ChargeValuesVersionsListComponent {

  @Input() title: string;
  @Input() btnName: string;
  @Input() chargeVersions: any[];
  @Input() orderIndex: number;

  @Output() changeOrderIndex = new EventEmitter();
  @Output() addNewVersion = new EventEmitter();
  @Output() editVersion = new EventEmitter();

  orderType = OrderVersion;
  getOrderClasses = getOrderClasses;
  getActiveOrderClass = getActiveOrderClass;

  onOrder(order: number): void {
    const newIndex = getSortValue(this.orderIndex, order);
    this.changeOrderIndex.emit(newIndex);
  }

  onEditVersion(version: any): void {
    this.editVersion.emit(version);
  }
}
