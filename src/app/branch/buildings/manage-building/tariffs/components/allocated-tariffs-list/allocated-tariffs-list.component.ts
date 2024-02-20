import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';

import {
  AggregatedBuildingTariffViewModel,
  DropdownItem,
  getSupplierTypes,
  HistoryViewModel,
  SupplyType,
  TariffListOrder
} from '@models';
import {
  getActiveDropdownItemFromList,
  getActiveOrderClass,
  getDropdownItemsFromArray,
  getDropdownItemsFromObjects,
  getOrderClasses,
  setDescOrAsc
} from '@shared-helpers';

import * as fromStore from '../../store';


@Component({
  selector: 'allocated-tariffs-list',
  templateUrl: './allocated-tariffs-list.component.html',
  styleUrls: ['./allocated-tariffs-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllocatedTariffsListComponent implements OnInit, OnDestroy {
  @Input() branchId: string;
  @Input() buildingId: string;
  @Input() buildingPeriodIsFinalized: boolean;
  
  @Input() tariffs: AggregatedBuildingTariffViewModel[] = [];
  tariffsOrder$: Observable<number>;
  supplierTypeFilter$: Observable<number>;
  selectedSupplyTypeSub: Subscription;
  supplierFilter$: Observable<string>;
  selectedSupplierIdSub: Subscription;
  suppliersDropdownItems$: Observable<DropdownItem[]>;
  buildingHistories$: Observable<HistoryViewModel[]>;
  activeBuildingHistory$: Observable<HistoryViewModel>;

  selectedSupplyType: number | null;
  selectedSupplierId: string;

  supplierTypesArr: string[] = getSupplierTypes(SupplyType);
  defaultFilter: DropdownItem = {
    label: 'All',
    value: null
  };
  supplierTypes: any;
  getActiveDropdownItemFromList = getActiveDropdownItemFromList;

  getOrderClasses = getOrderClasses;
  getActiveOrderClass = getActiveOrderClass;
  tariffListOrder = TariffListOrder;

  private pathSubscriptoin$;

  constructor(
    private readonly store: Store<fromStore.State>,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.supplierTypes = getDropdownItemsFromArray(this.supplierTypesArr, this.defaultFilter);
    this.supplierTypeFilter$ = this.store.pipe(select(fromStore.selectBuildingTariffsSupplyTypeFilter));
    this.selectedSupplyTypeSub = this.supplierTypeFilter$.subscribe(item => this.selectedSupplyType = item);
    this.supplierFilter$ = this.store.pipe(select(fromStore.selectBuildingTariffsSupplierFilter));
    this.selectedSupplierIdSub = this.supplierFilter$.subscribe(item => this.selectedSupplierId = item);
    this.tariffsOrder$ = this.store.pipe(select(fromStore.selectBuildingTariffsOrder));

    this.suppliersDropdownItems$ = this.store.pipe(
      select(fromStore.selectBuildingTariffs),
      map(tariffs =>
        getDropdownItemsFromObjects(tariffs, {label: 'supplierName', value: 'supplierId'}, this.defaultFilter)
      )
    );
  }

  ngOnDestroy() {
    this.store.dispatch(new fromStore.GetAllocatedBuildingTariffsSuccess([]));
    this.selectedSupplyTypeSub.unsubscribe();
    this.selectedSupplierIdSub.unsubscribe();
  }

  onTariffOrderChanged(currentOrderIndex: number, orderIndex: number): void {
    const newOrderIndex = setDescOrAsc(currentOrderIndex, orderIndex);
    this.store.dispatch(new fromStore.SetAllocatedBuildingTariffsOrder(newOrderIndex));
  }

  onSupplyTypeChanged(item: number | null): void {
    this.store.dispatch(new fromStore.SetAllocatedBuildingTariffsBySupplyFilter({
      supplyType: item,
      supplierId: this.selectedSupplierId
    }));
  }

  onSupplierChanged(item: string): void {
    this.store.dispatch(new fromStore.SetAllocatedBuildingTariffsBySupplyFilter({
      supplyType: this.selectedSupplyType,
      supplierId: item
    }));
  }

  onTariffDeleted(id: string) {
    this.store.dispatch(new fromStore.DeleteAllocatedBuildingTariff(id));
  }

}
