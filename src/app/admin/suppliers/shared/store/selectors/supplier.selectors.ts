import {createSelector} from '@ngrx/store';
import {getCommonState, getCreateSupplierState, getSupplierFormState, getSupplierState} from './common.selectors';
import {SupplierListOrder, SupplierViewModel} from '@models';
import {sortRule} from '@shared-helpers';

const sortSuppliers = (suppliers: SupplierViewModel[], sortOrder: number): SupplierViewModel[] => {
  suppliers = [...suppliers];
  switch (sortOrder) {
    case SupplierListOrder.SupplierNameDesc:
      return suppliers.sort((a, b) => sortRule(a.name.toLowerCase(), b.name.toLowerCase()));
    case SupplierListOrder.SupplierNameAsc:
      return suppliers.sort((a, b) => sortRule(b.name.toLowerCase(), a.name.toLowerCase()));
  }
  return suppliers;
};

export const getSupplierForm = createSelector(
  getSupplierFormState,
  state => state.formState
);

export const getSupplierLogoUrl = createSelector(
  getSupplierFormState,
  state => state.logoUrl
);

export const getShowSupplierInfoForm = createSelector(
  getSupplierFormState,
  state => state.showSupplierInfoForm
);

export const getCurrentSupplier = createSelector(
  getSupplierState,
  state => state.supplier
);

export const getSupplierId = createSelector(
  getCurrentSupplier,
  supplier => supplier && supplier.id
);

export const getSuppliersSupplyTypes = createSelector(
  getCurrentSupplier,
  (supplier) => {
    return supplier ? supplier.supplyTypes : [];
  }
);

export const getCreateSupplierForm = createSelector(
  getCreateSupplierState,
  state => state.formState
);

export const getAddNewModal = createSelector(
  getCommonState,
  state => state.addNewModal
);
export const getSuppliersList = createSelector(
  getCommonState,
  state => state.suppliersList
);

export const getSuppliersListSortOrder = createSelector(
  getCommonState,
  state => state.sortOrder
);

export const getSuppliersFilterText = createSelector(
  getCommonState,
  state => state.searchText
);

export const getSuppliersFilterSupplyType = createSelector(
  getCommonState,
  state => state.supplyType
);

export const getSuppliersListOrdered = createSelector(
  getSuppliersList,
  getSuppliersListSortOrder,
  (list, order) => sortSuppliers(list, order)
);
