import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {CommonAreaShopRelationsItemViewModel, CommonAreaShopRelationsViewModel} from '../../../../shared/models';
import {LiableShopStatus, ShopViewModel, SplitType} from '@models';

@Component({
  selector: 'common-area-shop-item',
  templateUrl: './common-area-shop-item.component.html',
  styleUrls: ['./common-area-shop-item.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonAreaShopItemComponent implements OnChanges, OnInit {

  @Input() model: CommonAreaShopRelationsViewModel;
  @Input() shop: ShopViewModel;
  @Input() serviceIdx: number;
  @Input() splitTypeIdx: SplitType;
  @Input() ownerLiable: boolean;

  @Output() deleteCommonAreaShop = new EventEmitter();
  @Output() addCommonAreaShop = new EventEmitter();
  @Output() updateShopAllocation = new EventEmitter();
  @Output() updateShopLiable = new EventEmitter();

  splitType = SplitType;
  liabilities: CommonAreaShopRelationsItemViewModel;
  liableShopStatus = LiableShopStatus;

  constructor() {
  }

  ngOnInit() {
    this.liabilities = this.model.liabilities.find(l => l.serviceType === this.serviceIdx);
  }

  ngOnChanges() {
    this.liabilities = this.model.liabilities.find(l => l.serviceType === this.serviceIdx);
  }

  onSelected() {
    if (this.model.isSelected) {
      this.deleteCommonAreaShop.emit({commonAreaId: this.model.commmonAreaId, shopId: this.model.shopId});
    } else {
      this.addCommonAreaShop.emit({commonAreaId: this.model.commmonAreaId, shopId: this.model.shopId});
    }
  }
}
