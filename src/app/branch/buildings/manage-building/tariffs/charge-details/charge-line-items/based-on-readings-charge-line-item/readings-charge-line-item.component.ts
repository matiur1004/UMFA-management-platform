import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroupState} from 'ngrx-forms';
import {
  BasedOnReadingsChargeLineItemViewModel,
  ChargeLineItemChargingType,
  ChargeLineItemChargingTypeDropdownItems,
} from '../../../../shared/models';
import {DropdownItem, RegisterViewModel} from '@models';

@Component({
  selector: 'based-on-readings-charge-line-item',
  templateUrl: './readings-charge-line-item.component.html',
  styleUrls: ['./readings-charge-line-item.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasedOnReadingsChargeLineItemComponent implements OnInit {

  chargingTypes = ChargeLineItemChargingTypeDropdownItems;

  @Input() lineItem: FormGroupState<BasedOnReadingsChargeLineItemViewModel>;
  @Input() lineItemNumber: number;
  @Input() registers: RegisterViewModel[];

  @Output() deleteLineItem = new EventEmitter();
  @Output() updateChargingType = new EventEmitter();

  constructor() {
  }

  onUpdateChargingType(id: string, newChargingType: ChargeLineItemChargingType, oldChargingType: ChargeLineItemChargingType) {
    this.updateChargingType.emit({id, newChargingType, oldChargingType});
  }

  onChangeChargingType(e: DropdownItem, id: string, chargingType: ChargeLineItemChargingType) {
    this.onUpdateChargingType(id, e.value, chargingType);
  }

  onDelete(id: string, chargingType: ChargeLineItemChargingType): void {
    this.deleteLineItem.emit({id, chargingType});
  }

  ngOnInit() {
  }
}
