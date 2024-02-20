import {Component, EventEmitter, Input, Output} from '@angular/core';

import {SelectedUnitFilter, UnitFilter} from '../../../shared/models';
import {ShopOrder, UnitType} from '@models';

@Component({
  selector: 'allocated-units',
  templateUrl: './allocated-units.component.html',
  styleUrls: ['./allocated-units.component.less']
})

export class AllocatedUnitsComponent {

  @Input() units: any[];
  @Input() selectedUnitFilterText: any;
  @Input() branchId: string;
  @Input() buildingId: string;
  @Input() versionId: string;
  @Input() buildingPeriodIsFinalized: boolean;
  
  @Output() toggleUnit = new EventEmitter();
  @Output() changeOrderIndex = new EventEmitter();
  @Output() updateFilter = new EventEmitter();
  @Output() search = new EventEmitter();
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  orderIndex: number = 1;
  orderType = ShopOrder;
  unitTypes = {
    [UnitType.Shop]: 'Shop',
    [UnitType.CommonArea]: 'Common Area',
  };
  selectedUnitFilter = SelectedUnitFilter;
  unitFilter = UnitFilter;

  constructor() {
  };

  onChangeOrderIndex(idx) {
    if (this.orderIndex == idx || (this.orderIndex == (idx * -1)))
      this.orderIndex *= -1;
    else
      this.orderIndex = idx;

    this.changeOrderIndex.emit(this.orderIndex);
  }

  onSave() {
    this.save.emit();
  }

  onCancel() {
    this.cancel.emit();
  }

}
