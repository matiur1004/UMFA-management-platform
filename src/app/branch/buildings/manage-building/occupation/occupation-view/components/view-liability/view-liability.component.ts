import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {CommonAreaViewModel, ComplexLiabilityShopFilter, ShopViewModel, SupplyType, TenantViewModel} from '@models';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {CommonAreaShopRelationsViewModel} from '../../../shared/models';
import {CommonAreaServiceLiabilityViewModel} from '../../../shared/models/common-area-service-liability.model';
import * as occupationAction from '../../../shared/store/actions/occupation.actions';
import * as fromOccupation from '../../../shared/store/reducers';
import * as buildingCommonData from '../../../../shared/store/selectors/common-data.selectors';

@Component({
  selector: 'view-liability',
  templateUrl: './view-liability.component.html',
  styleUrls: ['./view-liability.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewLiabilityComponent implements OnInit, OnChanges {

  @Input() shops: ShopViewModel[];
  @Input() allShops: ShopViewModel[];
  @Input() commonAreasShopsData = new Array<Array<CommonAreaShopRelationsViewModel>>();
  @Input() serviceTypes: SupplyType[];
  @Input() activeCommonAreas: CommonAreaViewModel[];
  @Input() buildingId: string;
  @Output() updateShopSearchTerm = new EventEmitter();
  @Output() updateCommonAreaSearchTerm = new EventEmitter();
  @Output() updateShopConnectFilter = new EventEmitter<number>();
  @Output() saveOccupation = new EventEmitter();
  @Output() updateCommonAreaHeader = new EventEmitter();
  @Output() deleteCommonAreaShop = new EventEmitter();
  @Output() addCommonAreaShop = new EventEmitter();
  @Output() updateShopAllocation = new EventEmitter();
  @Output() updateShopLiable = new EventEmitter();
  @Output() selectShopForAllCommonAreas = new EventEmitter();
  @Output() unselectShopForAllCommonAreas = new EventEmitter();
  @Output() selectCommonAreaForAllShops = new EventEmitter();
  @Output() unselectCommonAreaForAllShops = new EventEmitter();
  @Output() updateShopFilter = new EventEmitter();
  @Output() updateShopRentDetails = new EventEmitter();
  @Output() goToNodeDetail = new EventEmitter<string>();
  @ViewChild('tableColsHeader', {read: ElementRef}) tableColsHeader: ElementRef;
  @ViewChild('tableFirstColHeader', {read: ElementRef}) tableFirstColHeader: ElementRef;
  @ViewChildren('tableRowsHeader') tableRowsHeader;
  shopFilterText = 'All shops';
  tenants$: Observable<TenantViewModel[]>;
  nodeSupplyTypeIndexesToShow: number[] = [0, 1];
  buildingPeriodIsFinalized$: Observable<any>;

  constructor(private store: Store<fromOccupation.State>) {
    this.tenants$ = store.select(fromOccupation.getTenants);
  }

  private _commonAreaServiceLiabilities: CommonAreaServiceLiabilityViewModel[];

  get commonAreaServiceLiabilities(): CommonAreaServiceLiabilityViewModel[] {
    return this._commonAreaServiceLiabilities;
  }

  @Input() set commonAreaServiceLiabilities(items: CommonAreaServiceLiabilityViewModel[]) {
    this._commonAreaServiceLiabilities = (items || [])
      .filter(item => item.liability && this.getEnabledServices(item).includes(item.liability.serviceType));
  }

  private _filterBy: number;

  get filterBy(): number {
    return this._filterBy;
  }

  @Input() set filterBy(v: number) {
    this._filterBy = v;
    switch (v) {
      case ComplexLiabilityShopFilter.ConnectedShops:
        this.shopFilterText = 'Connected shops';
        break;
      case ComplexLiabilityShopFilter.NotConnectedShops:
        this.shopFilterText = 'Not connected shops';
        break;
      case ComplexLiabilityShopFilter.VacantShops:
        this.shopFilterText = 'Vacant shops';
        break;
      case ComplexLiabilityShopFilter.NotLiableShops:
        this.shopFilterText = 'Not liable shops';
        break;
      case ComplexLiabilityShopFilter.LiableShops:
        this.shopFilterText = 'Liable shops';
        break;
      default:
        this.shopFilterText = 'All shops';
        break;
    }
  }

  ngOnInit() {
    this.store.dispatch(new occupationAction.SetTenants());
    this.buildingPeriodIsFinalized$ = this.store.pipe(select(buildingCommonData.getIsFinalized));
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    const shopsSimpleChange: SimpleChange = simpleChanges['shops'];

    if (shopsSimpleChange &&
      (shopsSimpleChange.firstChange || shopsSimpleChange.previousValue.length !== shopsSimpleChange.currentValue.length)) {

      this.nodeSupplyTypeIndexesToShow =
        (this.shops || [])
          .filter(item => item.shopNodes)
          .flatMap(item => item.shopNodes)
          .map(item => item.supplyType)
          .filter((item, index, self) => index === self.indexOf(item));
    }
  }

  onScroll(event) {
    this.tableColsHeader.nativeElement.style.left = -event.srcElement.scrollLeft + 'px';
    this.tableFirstColHeader.nativeElement.style.left = event.srcElement.scrollLeft + 'px';

    for (let item of this.tableRowsHeader.toArray()) {
      item.nativeElement.style.left = event.srcElement.scrollLeft + 'px';
    }
  }

  trackByFn(index: number) {
    return index;
  }

  onGoToNodeDetail(nodeId: string) {
    this.goToNodeDetail.emit(nodeId);
  }

  onSaveOcupation() {
    this.saveOccupation.emit();
  }

  private getEnabledServices(commonAreaServiceLiabilityViewModel: CommonAreaServiceLiabilityViewModel): SupplyType[] {
    const items: SupplyType[] = [];
    const services = commonAreaServiceLiabilityViewModel?.commonArea?.services;

    if (!!services) {
      if (services.isElectricityEnable) {
        items.push(SupplyType.Electricity);
      }

      if (services.isGasEnable) {
        items.push(SupplyType.Gas);
      }

      if (services.isWaterEnable) {
        items.push(SupplyType.Water);
      }

      if (services.isSewerageEnable) {
        items.push(SupplyType.Sewerage);
      }

      if (services.isOtherEnable) {
        items.push(SupplyType.Other);
      }
    }

    return items;
  }
}
