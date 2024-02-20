import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AggregatedBuildingTariffViewModel, SupplyType, SupplyTypeText} from '@models';
import {getSupplyTypeIconClass, getSupplyTypeLabelClass} from '@shared-helpers';

@Component({
  selector: 'tariff-item',
  templateUrl: './tariff-item.component.html',
  styleUrls: ['./tariff-item.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TariffItemComponent implements OnInit {

  supplyTypes: string[] = Object.keys(SupplyType).filter(key => isNaN(SupplyType[key]));
  supplyTypeText = SupplyTypeText;

  getSupplyTypeIconClass = getSupplyTypeIconClass;
  getSupplyTypeLabelClass = getSupplyTypeLabelClass;

  @Input() tariff: AggregatedBuildingTariffViewModel;
  @Output() tariffDeleted: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
  }

  isSupplierSupplyType(supplierSupplyType: any, index: string): boolean {
    return Array.isArray(supplierSupplyType) ? supplierSupplyType.includes(+index) : supplierSupplyType === +index;
  }

  onDeleteTariff(id: string): void {
    this.tariffDeleted.emit(id);
  }

  ngOnInit() {
  }

}
