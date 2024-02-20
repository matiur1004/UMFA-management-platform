import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SelectedUnitFilter, UnitFilter} from '../../shared/models';
import {CommonAreaViewModel, ShopViewModel} from '@models';

@Component({
  selector: 'alloc-equip-to-shop',
  templateUrl: './alloc-equip-to-shop.component.html',
  styleUrls: ['./alloc-equip-to-shop.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllocEquipToShopComponent implements OnInit {

  @Input() units: (ShopViewModel | CommonAreaViewModel)[];
  @Input() unitFilterText: string;
  @Input() shopCountText: string;

  @Output() nextStep = new EventEmitter();
  @Output() cancel = new EventEmitter();

  @Output() pageSizeChanged = new EventEmitter();

  @Output() toggleUnit = new EventEmitter();
  @Output() searchChange = new EventEmitter();
  @Output() filterChange = new EventEmitter();

  unitFilter = UnitFilter;
  selectedUnitFilter = SelectedUnitFilter;
  orderIndex: number;

  constructor() {
  }

  ngOnInit() {
  }

}
