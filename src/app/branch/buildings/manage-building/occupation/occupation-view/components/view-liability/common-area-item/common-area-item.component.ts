import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonAreaShopRelationsViewModel} from '../../../../shared/models';
import {CommonAreaServiceLiabilityViewModel} from '../../../../shared/models/common-area-service-liability.model';
import {Dictionary, ShopViewModel, SplitType, SplitTypeList, SupplyType} from '@models';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'common-area-item',
  templateUrl: './common-area-item.component.html',
  styleUrls: ['./common-area-item.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonAreaItemComponent implements OnInit {

  @Input() shops: ShopViewModel[];
  @Input() commonAreasShopsData: Dictionary<Dictionary<CommonAreaShopRelationsViewModel>>;
  @Output() updateCommonAreaHeader = new EventEmitter();
  @Output() selectCommonAreaForAllShops = new EventEmitter();
  @Output() unselectCommonAreaForAllShops = new EventEmitter();
  @Output() goToNodeDetail = new EventEmitter<string>();
  object = Object;
  serviceType = SupplyType;
  splitTypeList = SplitTypeList;
  nodes: Dictionary<string>;
  nodesCount: number;
  checkedAll = false;
  checkedAllPartly = false;
  spliType = SplitType;

  constructor(private router: Router,
              private route: ActivatedRoute) {
  }

  private _model: CommonAreaServiceLiabilityViewModel;

  get model(): CommonAreaServiceLiabilityViewModel {
    return this._model;
  }

  @Input() set model(value: CommonAreaServiceLiabilityViewModel) {
    this._model = value;
    this.nodes = this._model.commonArea.supplyTypeNodes
      && this._model.commonArea.supplyTypeNodes[SupplyType[this._model.liability.serviceType]];

    if (this.nodes) {
      this.nodesCount = Object.keys(this.nodes).length;
    }
  }

  ngOnInit() {
    this.updateState();
  }

  onChangeSplitType(splitType: SplitType) {
    this.model.liability.splitType = splitType;

    this.updateCommonAreaHeader.emit({
      commonAreaId: this.model.commonArea.id,
      serviceType: this.model.liability.serviceType,
      path: 'splitType',
      value: splitType
    });
  }

  updateState() {
    let checkedTotal: number = 0;
    const commonAreaId = this.model.commonArea.id;
    let totalShopCount: number = 0;
    this.shops.forEach(s => {
      if (!s.isSpare) {
        totalShopCount++;
        if (this.commonAreasShopsData[commonAreaId][s.id].isSelected)
          checkedTotal++;
      }
    });

    this.checkedAll = checkedTotal && checkedTotal >= totalShopCount;
    this.checkedAllPartly = !this.checkedAll && checkedTotal > 0;
  }

  onSelected() {
    const commonAreaId = this.model.commonArea.id;
    if (this.checkedAll)
      this.unselectCommonAreaForAllShops.emit({commonAreaId: commonAreaId});
    else
      this.selectCommonAreaForAllShops.emit({commonAreaId: commonAreaId});
  }

  ngOnChanges() {
    this.updateState();
  }

  onNodeItemClick(nodeId: string) {
    this.goToNodeDetail.emit(nodeId);
  }
}
