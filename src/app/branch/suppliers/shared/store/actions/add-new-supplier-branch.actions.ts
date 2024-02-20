import {Action as StoreAction} from '@ngrx/store';

// GET
export const GET_SUPPLIERS = '[Branch Suppliers] GET_SUPPLIERS';
export const GET_SUPPLIERS_SUCCESS = '[Branch Suppliers] GET_SUPPLIERS_SUCCESS';
export const GET_SUPPLIERS_FAILED = '[Branch Suppliers] GET_SUPPLIERS_FAILED';

export class GetSuppliers implements StoreAction {
  readonly type = GET_SUPPLIERS;

  constructor(public payload: string) {
  }
}

export class GetSuppliersSuccess implements StoreAction {
  readonly type = GET_SUPPLIERS_SUCCESS;

  constructor(public payload: any) {
  }
}

export class GetSuppliersFailed implements StoreAction {
  readonly type = GET_SUPPLIERS_FAILED;

  constructor(public payload: any) {
  }
}

// ADD
export const ADD_NEW_SUPPLIER_BRANCH = '[Branch Suppliers] ADD_NEW_SUPPLIER_BRANCH';
export const ADD_NEW_SUPPLIER_BRANCH_SUCCESS = '[Branch Suppliers] ADD_NEW_SUPPLIER_BRANCH_SUCCESS';
export const ADD_NEW_SUPPLIER_BRANCH_FAILED = '[Branch Suppliers] ADD_NEW_SUPPLIER_BRANCH_FAILED';

export class AddNewSupplierBranch implements StoreAction {
  readonly type = ADD_NEW_SUPPLIER_BRANCH;

  constructor(public payload: { branchId: string, ids: string[] }) {
  }
}

export class AddNewSupplierBranchSuccess implements StoreAction {
  readonly type = ADD_NEW_SUPPLIER_BRANCH_SUCCESS;

  constructor(public payload: any) {
  }
}

export class AddNewSupplierBranchFailed implements StoreAction {
  readonly type = ADD_NEW_SUPPLIER_BRANCH_FAILED;

  constructor(public payload: any) {
  }
}

// Clear
export const PURGE_ADD_NEW_SUPPLIER_BRANCH_STORE = '[Branch Suppliers] PURGE_ADD_NEW_SUPPLIER_BRANCH_STORE';

export class PurgeAddNewSupplierBranchStore implements StoreAction {
  readonly type = PURGE_ADD_NEW_SUPPLIER_BRANCH_STORE;
}

export type AddNewSupplierBranchActions =
  | AddNewSupplierBranch
  | AddNewSupplierBranchSuccess
  | AddNewSupplierBranchFailed
  | PurgeAddNewSupplierBranchStore
  | GetSuppliers
  | GetSuppliersSuccess
  | GetSuppliersFailed;
