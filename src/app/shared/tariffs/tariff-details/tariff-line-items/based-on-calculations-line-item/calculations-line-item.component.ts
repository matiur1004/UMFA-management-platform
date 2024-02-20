import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Observable} from 'rxjs';
import {chargingTypeText, TariffLineItemChargingType} from '@models';


@Component({
  selector: 'based-on-calculations-line-item',
  templateUrl: './calculations-line-item.component.html',
  //styleUrls: ['../../tariff-detail.component.less']
})
export class BasedOnCalculationsLineItemComponent implements OnChanges {

  selectedLineItemText$: Observable<string>;

  chargingType = TariffLineItemChargingType;
  chargingTypeText = chargingTypeText;

  filteredLineItems: any[];
  dependentLineItemIds: any[];

  @Input() lineItem: any;
  @Input() lineItemNumber: number;
  @Input() isSubmitted: boolean;
  @Input() categories: any;
  @Input() lineItems: any[];
  @Input() chargingTypes: number[];

  @Output() deleteLineItem = new EventEmitter();
  @Output() updateChargingType = new EventEmitter();
  @Output() removeLineItemCategory = new EventEmitter();
  @Output() changeDependentLineItems = new EventEmitter();

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['lineItems'] || changes['lineItem']) {
      this.initData();
    }
  }

  initData() {
    const lineItems = this.lineItems || [];
    this.filteredLineItems = lineItems.filter(l => l.chargingType != TariffLineItemChargingType.BasedOnCalculations);
    this.dependentLineItemIds = this.lineItem.controls.dependentLineItemIds.value;
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

  onChangeDependentLineItems(event) {
    this.changeDependentLineItems.emit({
      id: this.lineItem.controls.id.value,
      dependentLineItemIds: event.map(x => x.lineItemId)
    });
  }
}
