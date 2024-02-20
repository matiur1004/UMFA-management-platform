import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ServiceViewModel, SupplyType} from '@models';

@Component({
  selector: 'customize-package',
  templateUrl: './customize-package.component.html',
  styleUrls: ['./customize-package.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomizePackageComponent implements OnInit {

  serviceType = SupplyType;
  type: number = 0;
  actualPrice: string = "R 1500";

  @Input() service: ServiceViewModel;
  @Output() valueChanged = new EventEmitter();
  @Output() meterValueChanged = new EventEmitter();

  // Customization
  @Input() shouldDisplayElectricitySupplier: boolean;
  @Input() shouldDisplayWaterSupplier: boolean;
  @Input() shouldDisplaySewerageSupplier: boolean;
  @Input() shouldDisplayGasSupplier: boolean;
  @Input() shouldDisplayAdHocSupplier: boolean;

  @Input() shouldDisplayFixedPriceMethod: boolean;
  @Input() shouldDisplayPerTenantMethod: boolean;
  @Input() shouldDisplayPerShopMethod: boolean;
  @Input() shouldDisplayPerMeterMethod: boolean;
  @Input() shouldDisplayPerSQMeterMethod: boolean;
  @Input() shouldDisplayPerBuildingMethod: boolean;
  @Input() shouldDisplayPerCouncilAccountMethod: boolean;
  @Input() shouldDisplayPerHourMethod: boolean;

  constructor() {
  }

  ngOnInit() {
  }

  hasSupplyTypes(service) {
    let hasElectricity = service.electricity && service.electricity.isActive && this.shouldDisplayElectricitySupplier;
    let hasWater = service.water && service.water.isActive && this.shouldDisplayWaterSupplier;
    let hasSewerage = service.sewerage && service.sewerage.isActive && this.shouldDisplaySewerageSupplier;
    let hasGas = service.gas && service.gas.isActive && this.shouldDisplayGasSupplier;
    let hasAdHoc = service.adHoc && service.adHoc.isActive && this.shouldDisplayAdHocSupplier;

    return hasElectricity || hasWater || hasSewerage || hasGas || hasAdHoc;
  }

  trackByIndex(index) {
    return index;
  }
}
