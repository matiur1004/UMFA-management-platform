import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {ChargingMethod, SupplyType} from '@models';

@Component({
  selector: 'service-tree-item',
  templateUrl: './service-tree-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./service-tree-item.component.less']
})
export class ServiceTreeItemComponent implements OnInit, OnChanges {

  @Input() parentId: string;
  @Input() service: any;

  @Input() isRootItem: boolean = false;
  @Input() showPrice: boolean;

  @Input() deepLevel: number;
  @Input() maxDeepLevel: number;

  @Input() displayActionMenu: boolean = true;

  @Input() isCustomize: boolean;
  @Input() isCharging: boolean;
  @Input() displaySwitch: boolean;
  @Input() displayChargingType: boolean;

  @Output() changeActivity = new EventEmitter()
  @Output() edit = new EventEmitter();
  @Output() create = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() changeServiceStatus = new EventEmitter();
  @Output() toggleService = new EventEmitter();
  @Output() valueChanged = new EventEmitter();
  @Output() chargingMethodChanged = new EventEmitter();
  @Output() meterValueChanged = new EventEmitter();
  @Output() chargingTypeChanged = new EventEmitter();

  // Customization
  @Input() shouldDisplayElectricitySupplier: boolean;
  @Input() shouldDisplayWaterSupplier: boolean;
  @Input() shouldDisplayGasSupplier: boolean;
  @Input() shouldDisplaySewerageSupplier: boolean;
  @Input() shouldDisplayAdHocSupplier: boolean;

  @Input() shouldDisplayFixedPriceMethod: boolean;
  @Input() shouldDisplayPerTenantMethod: boolean;
  @Input() shouldDisplayPerShopMethod: boolean;
  @Input() shouldDisplayPerMeterMethod: boolean;
  @Input() shouldDisplayPerSQMeterMethod: boolean;
  @Input() shouldDisplayPerBuildingMethod: boolean;
  @Input() shouldDisplayPerCouncilAccountMethod: boolean;
  @Input() shouldDisplayPerHourMethod: boolean;

  _shouldDisplayFixedPriceMethod: boolean = false;
  _shouldDisplayPerTenantMethod: boolean = false;
  _shouldDisplayPerShopMethod: boolean = false;
  _shouldDisplayPerMeterMethod: boolean = false;
  _shouldDisplayPerSQMeterMethod: boolean = false;
  _shouldDisplayPerBuildingMethod: boolean = false;
  _shouldDisplayPerCouncilAccountMethod: boolean = false;
  _shouldDisplayPerHourMethod: boolean = false;

  isExpanded: boolean = false;

  serviceType = SupplyType;

  chargingMethod = ChargingMethod;

  chargingMethodText: string = 'Per tenant';

  constructor() {
  }

  ngOnInit() {

  }

  hasChangesFn = (changes: SimpleChanges) => {
    return (prop: string) => {
      let propChanges = changes[prop];
      return propChanges && propChanges.currentValue != propChanges.previousValue
    }
  };

  ngOnChanges(changes: SimpleChanges) {
    let detectChanges = this.hasChangesFn(changes);

    if (detectChanges('service') || detectChanges('isCharging') || detectChanges('shouldDisplayFixedPriceMethod')
      || detectChanges('shouldDisplayPerTenantMethod') || detectChanges('shouldDisplayPerShopMethod') || detectChanges('')
      || detectChanges('shouldDisplayPerMeterMethod') || detectChanges('shouldDisplayPerSQMeterMethod') || detectChanges('shouldDisplayPerBuildingMethod')
      || detectChanges('shouldDisplayPerCouncilAccountMethod') || detectChanges('shouldDisplayPerHourMethod'))
      this.updateTitle();
  }

  trackById(_, item) {
    return item ? item.id : null;
  }

  onServiceValueChanged(event) {
    this.valueChanged.emit(event);
  }

  onChangeServiceStatus(event) {
    this.changeServiceStatus.emit(event);
  }

  updateTitle() {

    if (!this.isCharging)
      return;

    this.resetDisplayChargingMethod();

    switch (this.service.chargingMethod) {
      case ChargingMethod.FixedPrice:
        this.chargingMethodText = 'Fixed price';
        if (this.isCharging) this._shouldDisplayFixedPriceMethod = true;
        break;
      case ChargingMethod.PerTenant:
        this.chargingMethodText = 'Per tenant';
        if (this.isCharging) this._shouldDisplayPerTenantMethod = true;
        break;
      case ChargingMethod.PerShop:
        this.chargingMethodText = 'Per shop';
        if (this.isCharging) this._shouldDisplayPerShopMethod = true;
        break;
      case ChargingMethod.PerMeter:
        this.chargingMethodText = 'Per meter';
        if (this.isCharging) this._shouldDisplayPerMeterMethod = true;
        break;
      case ChargingMethod.PerSquareMeter:
        this.chargingMethodText = 'Per square meter';
        if (this.isCharging) this._shouldDisplayPerSQMeterMethod = true;
        break;
      case ChargingMethod.PerBuilding:
        this.chargingMethodText = 'Per building';
        if (this.isCharging) this._shouldDisplayPerBuildingMethod = true;
        break;
      case ChargingMethod.PerCouncilAccount:
        this.chargingMethodText = 'Per council account';
        if (this.isCharging) this._shouldDisplayPerCouncilAccountMethod = true;
        break;
      case ChargingMethod.PerHour:
        this.chargingMethodText = 'Per hour';
        if (this.isCharging) this._shouldDisplayPerHourMethod = true;
        break;
      default:
        throw new Error("Unknow charging method");
    }
  }


  resetDisplayChargingMethod() {
    this._shouldDisplayFixedPriceMethod = false;
    this._shouldDisplayPerTenantMethod = false;
    this._shouldDisplayPerShopMethod = false;
    this._shouldDisplayPerMeterMethod = false;
    this._shouldDisplayPerSQMeterMethod = false;
    this._shouldDisplayPerBuildingMethod = false;
    this._shouldDisplayPerCouncilAccountMethod = false;
    this._shouldDisplayPerHourMethod = false;
  }

  onChangeChargingMethod(chargingMethod: ChargingMethod) {
    this.chargingMethodChanged.emit({serviceId: this.service.id, chargingMethod: chargingMethod});
  }
}
