import {Component, Input, OnInit} from '@angular/core';
import {ShopMeterViewModel} from '../../models/shop-detail.model';
import {FieldType} from '@models';

@Component({
  selector: 'equipment-item',
  templateUrl: './equipment-item.component.html',
  styleUrls: ['./equipment-item.component.less']
})
export class EquipmentItemComponent implements OnInit {

  fieldType = FieldType;

  @Input() equipment: ShopMeterViewModel;

  constructor() {
  }

  ngOnInit() {
  }

}
