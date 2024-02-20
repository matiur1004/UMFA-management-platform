import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroupState} from 'ngrx-forms';
import {
  BasedOnFixedPriceChargeLineItemViewModel,
  BasicPeriod,
  ChargeLineItemChargingType,
  ChargeLineItemChargingTypeDropdownItems
} from '../../../../shared/models';
import {RegisterViewModel} from '@models';

@Component({
  selector: 'fixed-price-charge-line-item',
  templateUrl: './fixed-price-charge-line-item.component.html',
  styleUrls: ['./fixed-price-charge-line-item.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FixedPriceChargeLineItemComponent implements OnInit {

  basicPeriod = BasicPeriod;
  chargingTypes = ChargeLineItemChargingTypeDropdownItems;

  @Input() lineItem: FormGroupState<BasedOnFixedPriceChargeLineItemViewModel>;
  @Input() lineItemNumber: number;
  @Input() registers: RegisterViewModel[];

  @Output() deleteLineItem = new EventEmitter();
  @Output() updateChargingType = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  onUpdateChargingType(id: string, newChargingType: ChargeLineItemChargingType, oldChargingType: ChargeLineItemChargingType) {
    this.updateChargingType.emit({id, newChargingType, oldChargingType});
  }

  onChangeChargingType(e: any, id: string, chargingType: ChargeLineItemChargingType) {
    this.onUpdateChargingType(id, e.value, chargingType);
  }

  onDelete(id: string, chargingType: ChargeLineItemChargingType): void {
    this.deleteLineItem.emit({id, chargingType});
  }
}
