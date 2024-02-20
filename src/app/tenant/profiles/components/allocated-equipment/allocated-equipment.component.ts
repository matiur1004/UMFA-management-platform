import {Component, Input, OnInit} from '@angular/core';
import {ShopMeterViewModel} from '../../models/shop-detail.model';

@Component({
  selector: 'allocated-equipment',
  templateUrl: './allocated-equipment.component.html',
  styleUrls: ['./allocated-equipment.component.less']
})
export class AllocatedEquipmentComponent implements OnInit {

  @Input() allocatedEquipment: ShopMeterViewModel[];

  constructor() {
  }

  ngOnInit() {
  }

}
