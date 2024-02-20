import {Component, Input, OnInit} from '@angular/core';
import {ShopCostsViewModel} from '../../models/shop-detail.model';

@Component({
  selector: 'costs',
  templateUrl: './costs.component.html',
  styleUrls: ['./costs.component.less']
})
export class CostsComponent implements OnInit {

  @Input() costs: ShopCostsViewModel;

  constructor() {
  }

  ngOnInit() {
  }

}
