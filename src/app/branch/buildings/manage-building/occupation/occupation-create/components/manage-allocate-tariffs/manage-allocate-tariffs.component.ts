import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {select, Store} from '@ngrx/store';
import {Observable, Subscription} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {
  AggregatedBuildingTariffViewModel,
  DropdownItem,
  getSupplierTypes,
  HistoryViewModel,
  SupplyType,
  TariffListOrder,
  VersionActionType
} from '@models';
import {
  getActiveDropdownItemFromList,
  getActiveOrderClass,
  getDropdownItemsFromArray,
  getDropdownItemsFromObjects,
  getOrderClasses,
  setDescOrAsc
} from '@shared-helpers';

import * as fromStore from '../../../../tariffs/store';
import * as fromAllocatedTariff from 'app/branch/buildings/manage-building/tariffs/store';
import {AddNewAllocatedTariffComponent} from '../../../../tariffs/dialogs/add-new-allocated-tariff/add-new-allocated-tariff.component';

@Component({
  selector: 'manage-allocate-tariffs',
  templateUrl: './manage-allocate-tariffs.component.html',
  styleUrls: ['./manage-allocate-tariffs.component.less']
})
export class ManageAllocateTariffsComponent implements OnInit, OnDestroy {

  @Input() branchId: string;
  @Input() buildingId: string;

  tariffs$: Observable<AggregatedBuildingTariffViewModel[]>;
  tariffsOrder$: Observable<number>;
  supplierTypeFilter$: Observable<number>;
  selectedSupplyTypeSub: Subscription;
  supplierFilter$: Observable<string>;
  selectedSupplierIdSub: Subscription;
  suppliersDropdownItems$: Observable<DropdownItem[]>;
  buildingHistories$: Observable<HistoryViewModel[]>;

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

  @Output() previous = new EventEmitter();
  @Output() saveDraft = new EventEmitter();
  @Output() finalSave = new EventEmitter();
  isComplete: boolean;

  constructor(
    private readonly modalService: NgbModal,
    private readonly store: Store<fromStore.State>) {
  }

  ngOnInit() {
    this.store.dispatch(new fromAllocatedTariff.GetBuildingData(this.buildingId));
    this.supplierTypes = getDropdownItemsFromArray(this.supplierTypesArr, this.defaultFilter);

    this.tariffs$ = this.store.pipe(select(fromStore.selectBuildingTariffsFiltered));
    this.supplierTypeFilter$ = this.store.pipe(select(fromStore.selectBuildingTariffsSupplyTypeFilter));
    this.selectedSupplyTypeSub = this.supplierTypeFilter$.subscribe(item => this.selectedSupplyType = item);
    this.supplierFilter$ = this.store.pipe(select(fromStore.selectBuildingTariffsSupplierFilter));
    this.selectedSupplierIdSub = this.supplierFilter$.subscribe(item => this.selectedSupplierId = item);
    this.tariffsOrder$ = this.store.pipe(select(fromStore.selectBuildingTariffsOrder));
    this.buildingHistories$ = this.store.pipe(
      select(fromStore.selectBuildingHistories),
      filter(history => !!history),
      map(history => history.logs)
    );
    this.suppliersDropdownItems$ = this.store.pipe(
      select(fromStore.selectBuildingTariffs),
      map(tariffs => getDropdownItemsFromObjects(tariffs, {label: 'supplierName', value: 'supplierId'}))
    );
  }

  ngOnDestroy() {
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

  onAddTariff(): void {
    const modalRef = this.modalService.open(
      AddNewAllocatedTariffComponent,
      {backdrop: 'static', windowClass: 'add-new-tariff-building-modal'}
    );

    modalRef.componentInstance.isSaveOutside = true;
    modalRef.componentInstance.branchId = this.branchId;
    modalRef.componentInstance.buildingId = this.buildingId;
    modalRef.result.then((result) => {
      this.store.dispatch(new fromStore.AddNewTariffBuilding({
        comment: '',
        date: null,
        actionType: VersionActionType.Init,
        entity: result
      }));
    }, (reason) => console.log(reason));
  }

  onTariffDeleted(id: string) {
    this.store.dispatch(new fromStore.DeleteAllocatedBuildingTariff(id));
  }

  canNavigate(): boolean {
    return true;
  }

  onFinalSave() {
    this.finalSave.emit(1)
  }

}
