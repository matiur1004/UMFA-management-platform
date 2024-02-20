import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BuildingShopDetailsViewModel} from '../../shared/models/buildings.model';
import {FieldType, SupplyTypeText} from '@models';

@Component({
  selector: 'shop-details',
  templateUrl: './shop-details.component.html',
  styleUrls: ['./shop-details.component.less']
})

export class ShopDetailsComponent implements OnInit, OnDestroy {

  @Input() shopDetails: BuildingShopDetailsViewModel;

  fieldType = FieldType;

  supplyTypeText = SupplyTypeText;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
