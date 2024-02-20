import {Action as StoreAction} from '@ngrx/store';

// GET Allocated Suppliers
export const GET_ALLOCATED_SUPPLIERS = '[Branch Suppliers] GET_ALLOCATED_SUPPLIERS';
export const GET_ALLOCATED_SUPPLIERS_SUCCESS = '[Branch Suppliers] GET_ALLOCATED_SUPPLIERS_SUCCESS';
export const GET_ALLOCATED_SUPPLIERS_FAILED = '[Branch Suppliers] GET_ALLOCATED_SUPPLIERS_FAILED';

export class GetAllocatedSuppliers implements StoreAction {
  readonly type = GET_ALLOCATED_SUPPLIERS;

  constructor(public payload: string) {
  }
}

export class GetAllocatedSuppliersSuccess implements StoreAction {
  readonly type = GET_ALLOCATED_SUPPLIERS_SUCCESS;

  constructor(public payload: any) {
  }
}

export class GetAllocatedSuppliersFailed implements StoreAction {
  readonly type = GET_ALLOCATED_SUPPLIERS_FAILED;

  constructor(public payload: any) {
  }
}

// GET Allocated Supplier Tariffs
export const GET_ALLOCATED_SUPPLIER_TARIFFS = '[Branch Suppliers] GET_ALLOCATED_SUPPLIER_TARIFFS';
export const GET_ALLOCATED_SUPPLIER_TARIFFS_SUCCESS = '[Branch Suppliers] GET_ALLOCATED_SUPPLIER_TARIFFS_SUCCESS';
export const GET_ALLOCATED_SUPPLIER_TARIFFS_FAILED = '[Branch Suppliers] GET_ALLOCATED_SUPPLIER_TARIFFS_FAILED';

export class GetAllocatedSupplierTariffs implements StoreAction {
  readonly type = GET_ALLOCATED_SUPPLIER_TARIFFS;

  constructor(public payload: string) {
  }
}

export class GetAllocatedSupplierTariffsSuccess implements StoreAction {
  readonly type = GET_ALLOCATED_SUPPLIER_TARIFFS_SUCCESS;

  constructor(public payload: { tariffs: any, supplierId: string }) {
  }
}

export class GetAllocatedSupplierTariffsFailed implements StoreAction {
  readonly type = GET_ALLOCATED_SUPPLIER_TARIFFS_FAILED;

  constructor(public payload: any) {
  }
}

// Update
export const UPDATE_ALLOCATED_SUPPLIERS = '[Branch Suppliers] UPDATE_ALLOCATED_SUPPLIERS';

export class UpdateAllocatedSuppliers implements StoreAction {
  readonly type = UPDATE_ALLOCATED_SUPPLIERS;

  constructor(public payload: any) {
  }
}

// SET
export const SET_ALLOCATED_SUPPLIERS_ORDER = '[Branch Suppliers] SET_ALLOCATED_SUPPLIERS_ORDER';

export class SetAllocatedSuppliersOrder implements StoreAction {
  readonly type = SET_ALLOCATED_SUPPLIERS_ORDER;

  constructor(public payload: any) {
  }
}

export const SET_BRANCH_ID = '[Branch Suppliers] SET_BRANCH_ID';

export class SetBranchId implements StoreAction {
  readonly type = SET_BRANCH_ID;

  constructor(public payload: string) {
  }
}

export const SET_ALLOCATED_SUPPLIERS_FILTER = '[Branch Suppliers] SET_ALLOCATED_SUPPLIERS_FILTER';

export class SetAllocatedSuppliersFilter implements StoreAction {
  readonly type = SET_ALLOCATED_SUPPLIERS_FILTER;

  constructor(public payload: number) {
  }
}

// DELETE Allocated Supplier
export const DELETE_ALLOCATED_SUPPLIER = '[Branch Suppliers] DELETE_ALLOCATED_SUPPLIER';
export const DELETE_ALLOCATED_SUPPLIER_SUCCESS = '[Branch Suppliers] DELETE_ALLOCATED_SUPPLIER_SUCCESS';
export const DELETE_ALLOCATED_SUPPLIER_FAILED = '[Branch Suppliers] DELETE_ALLOCATED_SUPPLIER_FAILED';

export class DeleteAllocatedSupplier implements StoreAction {
  readonly type = DELETE_ALLOCATED_SUPPLIER;

  constructor(public payload: string) {
  }
}

export class DeleteAllocatedSupplierSuccess implements StoreAction {
  readonly type = DELETE_ALLOCATED_SUPPLIER_SUCCESS;

  constructor(public payload: any) {
  }
}

export class DeleteAllocatedSupplierFailed implements StoreAction {
  readonly type = DELETE_ALLOCATED_SUPPLIER_FAILED;

  constructor(public payload: any) {
  }
}

// Clear
export const PURGE_ALLOCATED_SUPPLIERS_STORE = '[Branch Suppliers] PURGE_ALLOCATED_SUPPLIERS_STORE';

export class PurgeAllocatedSuppliersStore implements StoreAction {
  readonly type = PURGE_ALLOCATED_SUPPLIERS_STORE;
}

export type AllocatedSuppliersActions =
  | GetAllocatedSuppliers
  | GetAllocatedSuppliersSuccess
  | GetAllocatedSuppliersFailed
  | GetAllocatedSupplierTariffs
  | GetAllocatedSupplierTariffsSuccess
  | GetAllocatedSupplierTariffsFailed
  | UpdateAllocatedSuppliers
  | SetAllocatedSuppliersOrder
  | SetAllocatedSuppliersFilter
  | SetBranchId
  | DeleteAllocatedSupplier
  | DeleteAllocatedSupplierSuccess
  | DeleteAllocatedSupplierFailed
  | PurgeAllocatedSuppliersStore;
