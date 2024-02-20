import {Component, OnDestroy, OnInit} from '@angular/core';
import {BuildingShopViewModel} from '../../shared/models/buildings.model';

@Component({
  selector: 'rent-details',
  templateUrl: './rent-details.component.html',
  styleUrls: ['./rent-details.component.less']
})
export class RentDetailsComponent implements OnInit, OnDestroy {

  shop: BuildingShopViewModel;

  constructor() {
  }

  ngOnInit() {

  }

  ngOnDestroy() {
  }
}
