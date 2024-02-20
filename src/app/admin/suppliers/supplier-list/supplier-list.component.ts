import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {SupplierListOrder, SupplierViewModel, SupplyType} from '@models';
import * as selectors from "../shared/store/selectors";
import * as supplierState from "../shared/store/reducers";
import * as supplierCommonActions from "../shared/store/actions/supplier-common.actions";
import {Store} from '@ngrx/store';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.less']
})
export class SupplierListComponent implements OnInit, OnDestroy {
  @Output() onEdit = new EventEmitter();
  @Output() onDelete = new EventEmitter();

  suppliers$: Observable<SupplierViewModel[]>;
  orderIndex: number;
  orderIndex$: Subscription;

  SupplyType = SupplyType;
  SupplierListOrder = SupplierListOrder;
  selectedSupplyTypeText = 'All types';

  supplyTypeOptions = [{
    supplyType: null,
    text: 'All Types'
  }, {
    supplyType: SupplyType.Electricity,
    text: 'Electricity'
  }, {
    supplyType: SupplyType.Water,
    text: 'Water'
  }, {
    supplyType: SupplyType.Gas,
    text: 'Gas'
  }, {
    supplyType: SupplyType.Sewerage,
    text: 'Sewerage'
  }, {
    supplyType: SupplyType.AdHoc,
    text: 'Ad Hoc'
  }
  ];


  constructor(
    private store: Store<supplierState.State>
  ) {
    this.suppliers$ = this.store.select(selectors.getSuppliersListOrdered);
    this.orderIndex$ = this.store.select(selectors.getSuppliersListSortOrder).subscribe((order) => this.orderIndex = order);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.orderIndex$.unsubscribe();
  }


  onEditSupplier(id) {
    this.onEdit.emit(id);
  }

  onDeleteSupplier(id) {
    this.onDelete.emit(id);
  }

  onSupplyTypeChanged(item) {
    this.selectedSupplyTypeText = item.text;
    this.store.dispatch(new supplierCommonActions.SupplierFilterSupplyTypeChanged(item.supplyType));
  }

  onSearchTextChanged(searchText) {
    this.store.dispatch(new supplierCommonActions.SupplierFilterTextChanged(searchText));
  }

  changeOrderIndex(idx) {
    this.store.dispatch(new supplierCommonActions.SuppliersListOrderChanged(idx));
  }

}
