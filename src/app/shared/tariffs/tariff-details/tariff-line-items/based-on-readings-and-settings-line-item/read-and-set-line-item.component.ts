import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroupState} from 'ngrx-forms';
import {BasicPeriod, chargingTypeText, TariffLineItemChargingType} from '@models';

@Component({
  selector: 'based-on-readings-and-settings-line-item',
  templateUrl: './read-and-set-line-item.component.html',
  //styleUrls: ['../../tariff-detail.component.less']
})
export class BasedOnReadingsAndSettingsLineItemComponent implements OnInit {

  chargingType = TariffLineItemChargingType;
  chargingTypeText = chargingTypeText;

  @Input() lineItem: FormGroupState<any>;
  @Input() lineItemNumber: number;
  @Input() isSubmitted: boolean;
  @Input() categories: any;
  @Input() chargingTypes: number[];

  @Output() deleteLineItem = new EventEmitter();
  @Output() updateChargingType = new EventEmitter();
  @Output() removeLineItemCategory = new EventEmitter();

  basicPeriod = BasicPeriod;

  constructor() {
  }

  ngOnInit() {
  }

  filterChargingType(type) {
    return this.chargingTypes.filter(t => t != type);
  }

  onUpdateChargingType(chargingType) {
    this.updateChargingType.emit({
      id: this.lineItem.value.id,
      name: this.lineItem.value.name,
      position: this.lineItem.value.controlPosition,
      previousChargingType: this.lineItem.value.chargingType,
      newChargingType: chargingType
    });
  }

  onRemoveLineItemCategory(event) {
    this.removeLineItemCategory.emit(event.value.id);
  }

}
