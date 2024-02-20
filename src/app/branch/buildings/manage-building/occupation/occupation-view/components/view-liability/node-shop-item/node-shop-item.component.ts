import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {getSupplyTypeIndexes, ShopViewModel, SupplyType} from '@models';
import {Store} from '@ngrx/store';
import * as fromOccupation from '../../../../shared/store/reducers';


@Component({
  selector: 'node-shop-item',
  templateUrl: './node-shop-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./node-shop-item.component.less']
})
export class NodeShopItemComponent implements OnInit, OnChanges {
  @Input() shop: ShopViewModel;
  @Input() buildingId: string;
  @Input() supplyTypeIndexesToShow: number[] = [];
  @Output() goToNodeDetail = new EventEmitter<string>();
  availableSupplyTypes: number[];
  supplyType = SupplyType;
  allNodes: any = {};
  allSupplyTypeIndexes: number[] = getSupplyTypeIndexes();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromOccupation.State>
  ) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.shop) {
      this.updateShopNodes();
    }

    this.availableSupplyTypes = this.allSupplyTypeIndexes.filter(item => this.supplyTypeIndexesToShow.includes(item));
  }

  updateShopNodes() {
    const shopNodes = this.shop.shopNodes;
    if (!!shopNodes && shopNodes.length > 0) {
      this.allNodes = shopNodes.reduce((result, node) => {
        result[node.supplyType] = node.nodes;
        return result;
      }, {});
    }
  }

  onGoToNodeDetail(nodeId: string) {
    this.goToNodeDetail.emit(nodeId);
  }
}
