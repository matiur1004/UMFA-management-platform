import {Component, OnDestroy, OnInit} from '@angular/core';
import * as fromTariffs from '../store/reducers';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {
  AggregatedTariffViewModel,
  NewTariffVersionViewModel,
  OrderTariffList,
  SupplyType,
  SupplyTypeDropdownItems,
  TariffViewModel,
  VersionViewModel
} from '@models';
import {select, Store} from '@ngrx/store';
import {map} from 'rxjs/operators';
import * as selectors from '../store/selectors';
import * as fromActions from '../store/actions/tariff.actions';
import * as tariffValuesActions from '../store/actions/tariff-values.actions';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'building-tariffs',
  templateUrl: './building-tariffs.component.html',
  styleUrls: ['./building-tariffs.component.less']
})
export class BuildingTariffsComponent implements OnInit, OnDestroy {

  tariffs$: Observable<AggregatedTariffViewModel[]>;
  public supplyTypesList = SupplyTypeDropdownItems;
  buildingCategories$: Observable<any>;
  selectedBuildingCategoryText$: Observable<string>;
  buildingId$: Subscription;
  branchId: string;
  buildingId: string;
  orderIndex = 1;
  supplyType = SupplyType;
  supplyTypes: SupplyType[] = [SupplyType.Electricity, SupplyType.Gas, SupplyType.Sewerage, SupplyType.Water, SupplyType.AdHoc];
  supplyTypeModel: number = -1;
  private pathSubscriptoin$: Subscription;
  private supplyTypeSub: Subscription;

  constructor(
    private store: Store<fromTariffs.State>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.tariffs$ = store.pipe(select(selectors.getSortedTariffs));
    this.buildingCategories$ = store.pipe(select(selectors.getBuildingCategories));
    this.supplyTypeSub = store.pipe(select(selectors.getTariffSupplyTypeFilter)).subscribe(supplyType => {
      if (supplyType >= 0) {
        this.supplyTypeModel = this.supplyTypesList[supplyType].value;
      }
    });

    this.selectedBuildingCategoryText$ = store.pipe(
      select(selectors.getTariffBuildingCategoryFilter),
      map(c => {
        return c ? c.name : 'All consumers';
      }));
  }

  ngOnInit() {
    this.pathSubscriptoin$ = combineLatest(
      this.route.pathFromRoot[2].params,
      this.route.pathFromRoot[4].params
    ).subscribe(([branchParams, buildingParams]) => {
      this.branchId = branchParams['branchid'];
      this.buildingId = buildingParams['id'];
    });

    this.store.dispatch(new fromActions.RequestTariffList());
  }

  ngOnDestroy() {
    this.pathSubscriptoin$ && this.pathSubscriptoin$.unsubscribe();
    this.supplyTypeSub && this.supplyTypeSub.unsubscribe();
  }

  search(event): void {
    this.store.dispatch(new fromActions.UpdateSearchKey(event));
  }

  onBuildingCategoryChanged(event) {
    this.store.dispatch(new fromActions.UpdateBuildingCategoryId(event));
  }

  onSupplyTypeChanged() {
    this.store.dispatch(new fromActions.UpdateSupplyTypeFilter(this.supplyTypeModel));
  }

  changeOrderIndex(event) {
    if (this.orderIndex === event || (this.orderIndex === (event * -1))) {
      this.orderIndex *= -1;
    } else {
      this.orderIndex = event;
    }

    if (this.orderIndex === OrderTariffList.VersionAsc || this.orderIndex === OrderTariffList.VersionDesc) {
      this.store.dispatch(new fromActions.UpdateVersionOrder(this.orderIndex));
    } else {
      this.store.dispatch(new fromActions.UpdateOrder(this.orderIndex));
    }
  }

  onCreate() {
    this.store.dispatch(new fromActions.CreateTariffClick());
  }

  onEditTariff(event) {
    this.router.navigate(['/branch', this.branchId, 'buildings', this.buildingId, 'tariffs', 'building-tariffs', event]);
  }

  onEditTariffValue(event) {
    this.router.navigate(['/branch', this.branchId, 'buildings', this.buildingId, 'tariffs', 'building-tariffs', event.tariffVersionId, 'values', event.tariffValueId]);
  }

  onAddNewTariffVersion(versionViewModel: NewTariffVersionViewModel) {
    const maxVersion = Math.max(...versionViewModel.versions.map(x => x.majorVersion));
    const tariffId = versionViewModel.currentTariff.id;
    versionViewModel.currentTariff.versionId = versionViewModel.vId;
    this.onEditTariff(versionViewModel.vId);

    this.store.dispatch(new fromActions.AddTariffVersion(
      false,
      {
        tariffId: tariffId,
        majorVersion: maxVersion,
        minorVersion: 0,
        currentTariff: versionViewModel.currentTariff
      }));
  }

  onAddNewTariffValue(tariffVersion: VersionViewModel<TariffViewModel>): void {
    this.store.dispatch(new tariffValuesActions.CreateTariffValueAddNewValue({
      tariffVersion: tariffVersion
    }));
  }

  onDeleteTariffVersion(tariff) {
    this.store.dispatch(new fromActions.DeleteTariffVersion({
      tariffId: tariff.entity.id,
      majorVersion: tariff.majorVersion
    }));
  }
}

