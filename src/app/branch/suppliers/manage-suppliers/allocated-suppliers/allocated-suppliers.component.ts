import {Component, OnDestroy, OnInit} from '@angular/core';
import {SupplierListOrder, SupplierTariffListOrder} from '../../shared/models/supplier-order.model';
import {Observable, Subject} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {takeUntil} from 'rxjs/operators';

import {SupplyType, SupplyTypeText} from '@models';
import {
  getActiveOrderClass,
  getOrderClasses,
  getSupplyTypeIconClass,
  getSupplyTypeLabelClass,
  setDescOrAsc,
  sortRule
} from '@shared-helpers';
import {BuildingViewModel} from '../../shared/models';
import {SupplierBranchViewModel} from '../../shared/models/supplier-branch-view.model';
import {BranchManagerService} from '@services';

import * as fromStore from '../../shared/store';
import * as fromSelectors from '../../shared/store/selectors';
import * as fromModals from '../../modals';


@Component({
  selector: 'allocated-suppliers',
  templateUrl: './allocated-suppliers.component.html',
  styleUrls: ['./allocated-suppliers.component.less']
})
export class AllocatedSuppliersComponent implements OnInit, OnDestroy {

  destroyed$ = new Subject();

  suppliers$: Observable<SupplierBranchViewModel[]>;
  supplierOrderIndex$: Observable<number>;
  supplierFilter$: Observable<number>;

  supplyType = SupplyType;
  supplyTypes: string[] = Object.keys(SupplyType).filter(key => isNaN(SupplyType[key]));
  supplyTypeText = SupplyTypeText;
  selectedSupplyType: string;

  supplierListOrder = SupplierListOrder;
  buildingsLimit: number = 5;

  supplierTariffListOrder = SupplierTariffListOrder;

  getOrderClasses = getOrderClasses;
  getActiveOrderClass = getActiveOrderClass;

  getSupplyTypeIconClass = getSupplyTypeIconClass;
  getSupplyTypeLabelClass = getSupplyTypeLabelClass;

  activeTooltipData: any;

  constructor(
    private readonly store: Store<fromStore.State>,
    private readonly modalService: NgbModal,
    private readonly branchManagerService: BranchManagerService
  ) {
  }

  ngOnInit() {
    this.onSupplyTypeChanged(null);
    this.onChangeSuppliersOrder(-1, 1);
    this.branchManagerService.getBranchObservable().pipe(
      takeUntil(this.destroyed$)
    ).subscribe(branch => {
      this.store.dispatch(new fromStore.SetBranchId(branch.id));
      this.store.dispatch(new fromStore.GetAllocatedSuppliers(branch.id));
    });

    this.suppliers$ = this.store.pipe(
      select(fromSelectors.selectAllocatedSuppliersList),
    );

    this.supplierOrderIndex$ = this.store.pipe(
      select(fromSelectors.selectAllocatedSuppliersOrder)
    );

    this.supplierFilter$ = this.store.pipe(
      select(fromSelectors.selectAllocatedSuppliersFilter)
    );
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  getTariffBuildings(buildings: BuildingViewModel[], limit: number, showEnd?: boolean): BuildingViewModel[] {
    if (!buildings) return [];

    const copyBuildings: BuildingViewModel[] = [...buildings];

    if (!showEnd) {
      return copyBuildings.splice(0, limit);
    }

    if (showEnd) {
      return copyBuildings.splice(limit);
    }

    return copyBuildings;
  }

  getSortedTariffs(tariffs: any[], order: number): any[] {
    const v = [...tariffs];
    switch (order) {
      case SupplierTariffListOrder.NameAsc:
        return v.sort((a, b) => sortRule(a.name, b.name));
      case SupplierTariffListOrder.NameDesc:
        return v.sort((a, b) => sortRule(b.name, a.name));
      case SupplierTariffListOrder.SupplyAsc:
        return v.sort((a, b) => sortRule(a.supplyType, b.supplyType));
      case SupplierTariffListOrder.SupplyDesc:
        return v.sort((a, b) => sortRule(b.supplyType, a.supplyType));
    }
  }

  setBuildingForTooltip(buildings: BuildingViewModel[]) {
    this.activeTooltipData = this.getTariffBuildings(buildings, this.buildingsLimit, true);
  }

  isSupplierSupplyType(supplierSupplyType: any, index: string): boolean {
    return Array.isArray(supplierSupplyType) ? supplierSupplyType.includes(+index) : supplierSupplyType === +index;
  }

  onAddSupplier(): void {
    this.store.dispatch(new fromStore.GetSuppliers(null));
    this.modalService.open(fromModals.AddSupplierToBranchComponent, {
      backdrop: 'static',
      windowClass: 'add-supplier-modal'
    });
  }

  onSupplyTypeChanged(item: string): void {
    this.onChangeSuppliersOrder(-1, 1);
    this.store.dispatch(new fromStore.SetAllocatedSuppliersFilter(+item));
    this.selectedSupplyType = !item ? 'All' : this.supplyTypeText[item];
  }

  onChangeSuppliersOrder(currentOrderIndex: number, orderIndex: number): void {
    const newOrderIndex = setDescOrAsc(currentOrderIndex, orderIndex);
    this.store.dispatch(new fromStore.SetAllocatedSuppliersOrder(newOrderIndex));
  }

  onChangeTariffsOrder(suppliers: any, orderIndex: number, sIndex: number): void {
    const newSuppliers = [...suppliers];
    const newOrderIndex = setDescOrAsc(suppliers[sIndex].tariffOrder, orderIndex);
    newSuppliers[sIndex].tariffs = this.getSortedTariffs(suppliers[sIndex].tariffs, newOrderIndex);
    newSuppliers[sIndex].tariffOrder = newOrderIndex;
    this.store.dispatch(new fromStore.UpdateAllocatedSuppliers(newSuppliers));
  }

  onSupplierExpand(suppliers: any, item: any, index: number): void {
    const currentSupplier = suppliers[index];
    const supplierId: string = currentSupplier.id;

    currentSupplier.isExpanded = !currentSupplier.isExpanded;
    if (currentSupplier.isExpanded && !currentSupplier.tariffs) {
      this.store.dispatch(new fromStore.GetAllocatedSupplierTariffs(supplierId));
    }
    this.store.dispatch(new fromStore.UpdateAllocatedSuppliers(suppliers));
  }

  onDeleteSupplier(supplierId: string): void {
    this.store.dispatch(new fromStore.DeleteAllocatedSupplier(supplierId));
  }

  trackByFn(index, item) {
    return (item && item.id) ? item.id : index;
  }

}
