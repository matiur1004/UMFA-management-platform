import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';


@Component({
  selector: 'service-tree',
  templateUrl: './service-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./service-tree.component.less']
})
export class ServiceTreeComponent implements OnInit {

  @Input() displayActionMenu: boolean = true;
  @Input() services: any[];
  @Input() showPrice: boolean;
  @Input() maxDeepLevel: number = 4;

  @Input() isCustomize: boolean = false;
  @Input() isCharging: boolean = false;
  @Input() displaySwitch: boolean = true;
  @Input() displayChargingType: boolean = false;

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
  @Input() shouldDisplayElectricitySupplier: boolean = true;
  @Input() shouldDisplayWaterSupplier: boolean = true;
  @Input() shouldDisplayGasSupplier: boolean = true;
  @Input() shouldDisplaySewerageSupplier: boolean = true;
  @Input() shouldDisplayAdHocSupplier: boolean = true;

  @Input() shouldDisplayFixedPriceMethod: boolean = true;
  @Input() shouldDisplayPerTenantMethod: boolean = true;
  @Input() shouldDisplayPerShopMethod: boolean = true;
  @Input() shouldDisplayPerMeterMethod: boolean = true;
  @Input() shouldDisplayPerSQMeterMethod: boolean = true;
  @Input() shouldDisplayPerBuildingMethod: boolean = true;
  @Input() shouldDisplayPerCouncilAccountMethod: boolean = true;
  @Input() shouldDisplayPerHourMethod: boolean = true;

  constructor() {
  }

  ngOnInit() {
  }

  trackById(_, item) {
    return item ? item.id : null;
  }
}
