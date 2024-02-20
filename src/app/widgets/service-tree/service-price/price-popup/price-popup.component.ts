import {Component, Input, OnInit} from '@angular/core';
import {ServiceItemViewModel} from '../../shared/model/service-item.model';

@Component({
  selector: 'price-popup',
  templateUrl: './price-popup.component.html',
  styleUrls: ['./price-popup.component.less']
})
export class PricePopupComponent implements OnInit {

  @Input() serviceName: string;
  @Input() model: ServiceItemViewModel;

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

}
