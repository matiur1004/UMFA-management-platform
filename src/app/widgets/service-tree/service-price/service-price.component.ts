import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ServiceItemViewModel} from '../shared/model/service-item.model';
import {SupplyType} from '@models';


@Component({
  selector: 'service-price',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './service-price.component.html',
  styleUrls: ['./service-price.component.less']
})
export class ServicePriceComponent implements OnInit {

  @Input() showPrice: boolean;
  @Input() model: ServiceItemViewModel;
  @Input() type: number = 0;

  @Input() shouldDisplayFixedPriceMethod: boolean;
  @Input() shouldDisplayPerTenantMethod: boolean;
  @Input() shouldDisplayPerShopMethod: boolean;
  @Input() shouldDisplayPerMeterMethod: boolean;
  @Input() shouldDisplayPerSQMeterMethod: boolean;
  @Input() shouldDisplayPerBuildingMethod: boolean;
  @Input() shouldDisplayPerCouncilAccountMethod: boolean;
  @Input() shouldDisplayPerHourMethod: boolean;

  serviceType = SupplyType;

  serviceName: string;

  constructor() {
  }

  ngOnInit() {

    switch (this.type) {
      case SupplyType.AdHoc:
        this.serviceName = 'Ad hoc';
        break;
      default:
        this.serviceName = SupplyType[this.type];
        break;
    }
  }

}
