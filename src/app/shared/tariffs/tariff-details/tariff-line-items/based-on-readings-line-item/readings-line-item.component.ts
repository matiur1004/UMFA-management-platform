import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroupState} from 'ngrx-forms';
import {
  chargingTypeText,
  CostProviderNodeModel,
  SupplyType,
  TariffLineItemChargingType,
  TariffStepModel,
  UnitOfMeasurement
} from '@models';
import {CostTariffSettingsService} from 'app/shared/services/cost-tariff-settings.service';

@Component({
  selector: 'based-on-readings-line-item',
  templateUrl: './readings-line-item.component.html',
  styleUrls: ['./readings-line-item.component.less']
})
export class BasedOnReadingsLineItemComponent implements OnInit {

  chargingType = TariffLineItemChargingType;
  chargingTypeText = chargingTypeText;

  public costPriceLineItem = false;

  @Input() supplyType: SupplyType = SupplyType.Electricity;
  @Input() lineItem: FormGroupState<any>;
  @Input() lineItemNumber: number;
  @Input() isSubmitted: boolean;
  @Input() units: UnitOfMeasurement[];
  @Input() categories: any;
  @Input() chargingTypes: number[];
  @Input() steps: TariffStepModel[] = [];
  @Input() costProviderNodes: CostProviderNodeModel[] = [];
  @Input() showCostTariffProperty = false;

  @Output() deleteLineItem = new EventEmitter();
  @Output() updateChargingType = new EventEmitter();
  @Output() updateUnitOfMeasurement = new EventEmitter();
  @Output() resetCostProviderId = new EventEmitter();
  @Output() removeLineItemCategory = new EventEmitter();

  stepSchemeValue: any;

  constructor(private costTariffSettings: CostTariffSettingsService) {
  }

  get isSupportCostProvider() {
    const unitsCostProvider = this.costTariffSettings.getUnitsBySupplyType(this.supplyType);
    const unitOfMeasurement = this.lineItem.controls.unitOfMeasurement.value;
    return unitsCostProvider.indexOf(unitOfMeasurement) !== -1;
  }

  isShowSteps(item): boolean {
    return !!item || this.stepSchemeValue === 'standardScheme';
  }

  filterChargingType(type) {
    return this.chargingTypes.filter(t => t != type);
  }

  getSelectedUnit(unitType) {
    const unit = this.units.find(u => u.unitType == unitType);
    return unit && unit.defaultName;
  }

  getFilteredUnits(unitType) {
    return this.units.filter(u => u.unitType != unitType);
  }

  getSteps(unitOfMeasurement: number, steps: TariffStepModel[]): TariffStepModel[] {
    return (unitOfMeasurement && steps) ? steps.filter(s => s.unitOfMeasurement === unitOfMeasurement) : null;
  }

  onCostPriceLineItemChanged() {
    this.costPriceLineItem = !this.costPriceLineItem;
    this.resetCostProviderId.emit(this.costPriceLineItem ? '' : null);
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

  onUpdateUnitOfMeasurement(lineItemId, unitOfMeasurement) {
    this.updateUnitOfMeasurement.emit({id: lineItemId, unitOfMeasurement: unitOfMeasurement});
    if (this.showCostTariffProperty) {
      this.costPriceLineItem = false;
      this.resetCostProviderId.emit(null);
    }
  }

  onRemoveLineItemCategory(event) {
    this.removeLineItemCategory.emit(event.value.id);
  }

  ngOnInit() {
    this.costPriceLineItem = !!this.lineItem.controls.costProviderId.value;
  }
}
