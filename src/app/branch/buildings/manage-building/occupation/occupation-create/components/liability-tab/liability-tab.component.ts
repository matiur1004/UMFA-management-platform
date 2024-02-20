import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LiabilityViewModel, LiableShopStatus, SplitType, SplitTypeList, SupplyType} from '@models';

@Component({
  selector: 'liability-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './liability-tab.component.html',
  styleUrls: ['./liability-tab.component.less']
})
export class LiabilityTabComponent implements OnInit {

  @Output() ownerLiabilityChanged = new EventEmitter();
  @Output() includeNotLiableShopsChanged = new EventEmitter();
  @Output() includeVacantShopSqMChanged = new EventEmitter();
  @Output() updateShopAllocation = new EventEmitter();
  @Output() updateShopFilter = new EventEmitter();
  @Output() updateShopTermSearch = new EventEmitter();
  @Output() updateSplit = new EventEmitter();
  @Output() updateShopLiability = new EventEmitter();
  @Output() defaultSettingsChanged = new EventEmitter();

  @Input() searchTerm: string;

  serviceName: string = "water";
  public liableShopStatus = LiableShopStatus;
  public splitType = SplitType;
  shopFilterText = 'All shops';
  howToSplit = 'Equal';
  shopStatus = LiableShopStatus;
  splitTypeList = SplitTypeList;

  constructor() {
  }

  private _model: LiabilityViewModel;

  get model(): LiabilityViewModel {
    return this._model;
  }

  @Input() set model(v: LiabilityViewModel) {
    this._model = v;

    switch (this._model.serviceType) {
      case SupplyType.Electricity:
        this.serviceName = "electricity";
        break;

      case SupplyType.Water:
        this.serviceName = "water";
        break;

      case SupplyType.Gas:
        this.serviceName = "gas";
        break;

      case SupplyType.AdHoc:
        this.serviceName = "other";
        break;

      case SupplyType.Sewerage:
        this.serviceName = "sewerage";
        break;

      default:
        break;
    }

    switch (this._model.splitType) {
      case SplitType.Equal:
        this.howToSplit = 'Equal';
        break;

      case SplitType.Proportional:
        this.howToSplit = 'Proportional';
        break;

      case SplitType.Custom:
        this.howToSplit = 'Custom';
        break;
    }
  }

  private _filterBy: number;

  get filterBy(): number {
    return this._filterBy;
  }

  @Input() set filterBy(v: number) {
    this._filterBy = v;
    switch (v) {
      case LiableShopStatus.VacantShops:
        this.shopFilterText = 'Vacant shops';
        break;
      case LiableShopStatus.NotLiableShops:
        this.shopFilterText = 'Not liable shops';
        break;
      case LiableShopStatus.LiableShops:
        this.shopFilterText = 'Liable shops';
        break;
      default:
        this.shopFilterText = 'All shops';
        break;
    }
  }

  ngOnInit() {
  }

  onUpdateShopFilter(title, filter) {
    this.shopFilterText = title;
    this.updateShopFilter.emit(filter);
  }

  onUpdateShopLiabilety($event) {
    if (this.model.ownerLiable)
      return;

    this.updateShopLiability.emit($event);
  }

  trackShop(index: number) {
    return index;
  }
}
