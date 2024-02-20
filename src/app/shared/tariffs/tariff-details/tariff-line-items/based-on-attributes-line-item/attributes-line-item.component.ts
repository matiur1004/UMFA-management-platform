import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroupState} from 'ngrx-forms';
import {BasicPeriod, chargingTypeText, TariffLineItemChargingType} from '@models';

@Component({
  selector: 'based-on-attributes-line-item',
  templateUrl: './attributes-line-item.component.html'
})
export class BasedOnAttributesLineItemComponent implements OnInit {

  chargingType = TariffLineItemChargingType;
  chargingTypeText = chargingTypeText;

  @Input() lineItem: FormGroupState<any>;
  @Input() lineItemNumber: number;
  @Input() isSubmitted: boolean;
  @Input() attributes: any[];
  @Input() categories: any[];
  @Input() chargingTypes: number[];

  @Output() deleteLineItem = new EventEmitter();
  @Output() updateChargingType = new EventEmitter();
  @Output() updateAttributeId = new EventEmitter();
  @Output() removeLineItemCategory = new EventEmitter();

  basicPeriod = BasicPeriod;

  constructor() {
  }

  ngOnInit() {
  }

  filterChargingType(type) {
    return this.chargingTypes.filter(t => t != type);
  }

  getSelectedAttribute(id) {
    const selectedAttribute = this.attributes.find(attr => attr.id == id);
    if (selectedAttribute == null) {
      return 'Select attribute';
    }
    return selectedAttribute.name;
  }

  getFilteredAttributes(id) {
    return this.attributes.filter(attr => attr.id != id);
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
