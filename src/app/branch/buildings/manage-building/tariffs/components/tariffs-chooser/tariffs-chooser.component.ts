import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {getActiveOrderClass, getOrderClasses, getSupplyTypeIconClass, getSupplyTypeLabelClass} from '@shared-helpers';
import {AddBuildingTariffViewModel, BranchTariffsOrderList, SupplyType, SupplyTypeText} from '@models';

@Component({
  selector: 'tariffs-chooser',
  templateUrl: './tariffs-chooser.component.html',
  styleUrls: ['./tariffs-chooser.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TariffsChooserComponent implements OnInit {

  supplyTypes: string[] = Object.keys(SupplyType).filter(key => isNaN(SupplyType[key]));
  supplyTypeText = SupplyTypeText;

  getSupplyTypeIconClass = getSupplyTypeIconClass;
  getSupplyTypeLabelClass = getSupplyTypeLabelClass;

  getOrderClasses = getOrderClasses;
  getActiveOrderClass = getActiveOrderClass;
  branchTariffListOrder = BranchTariffsOrderList;

  @Input() tariffs: AddBuildingTariffViewModel[];
  @Input() order: number;

  @Output() added: EventEmitter<string> = new EventEmitter<string>();
  @Output() orderChanged: EventEmitter<number> = new EventEmitter<number>();

  constructor() {
  }

  isSupplierSupplyType(supplierSupplyType: any, index: string): boolean {
    return Array.isArray(supplierSupplyType) ? supplierSupplyType.includes(+index) : supplierSupplyType === +index;
  }

  onTariffOrderChanged(index: number): void {
    this.orderChanged.emit(index);
  }

  onAdd(id: string): void {
    this.added.emit(id);
  }

  ngOnInit() {
  }

}
