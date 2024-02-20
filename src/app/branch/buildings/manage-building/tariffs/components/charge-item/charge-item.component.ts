import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ChargeViewModel} from '../../../shared/models';
import {getActiveOrderClass, getOrderClasses} from '@shared-helpers';

@Component({
  selector: 'charge-item',
  templateUrl: './charge-item.component.html',
  styleUrls: ['./charge-item.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChargeItemComponent implements OnInit {

  getOrderClasses = getOrderClasses;
  getActiveOrderClass = getActiveOrderClass;

  @Input() charge: ChargeViewModel;
  @Input() buildingPeriodIsFinalized: boolean;
  
  @Output() chargeEdited: EventEmitter<any> = new EventEmitter<any>();
  @Output() chargeDeleted: EventEmitter<any> = new EventEmitter<any>();
  @Output() valueEdited: EventEmitter<any> = new EventEmitter<any>();
  @Output() newValueAdded: EventEmitter<any> = new EventEmitter<any>();
  @Output() valueDeleted: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  onEditCharge(charge: any): void {
    this.chargeEdited.emit(charge);
  }

  onDeleteCharge(charge: any): void {
    this.chargeDeleted.emit(charge);
  }

  onEditValue(charge: any, value: any): void {
    this.valueEdited.emit({charge, value});
  }

  onAddNewValue(charge: any, value: any): void {
    this.newValueAdded.emit({charge, value});
  }

  onDeleteValue(charge: any, value: any): void {
    this.valueDeleted.emit({charge, value});
  }

  trackByFn(index, item) {
    return (item && item.id) ? item.id : index;
  }

  ngOnInit() {
  }

}
