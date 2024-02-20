import {Action as StoreAction} from '@ngrx/store';

// Update supplier categories
export const API_SUPPLIER_TARIFF_CATEGORIES_UPDATE = '[Supplier Categories] API Update Supplier Categories';
export const API_SUPPLIER_TARIFF_CATEGORIES_UPDATE_SUCCEEDED = '[Supplier Categories] API Update Supplier Categories Succeeded';

export class ApiUpdateSupplierCategories implements StoreAction {
  readonly type = API_SUPPLIER_TARIFF_CATEGORIES_UPDATE;

  constructor() {
  }
}

export class ApiUpdateSupplierCategoriesSucceeded implements StoreAction {
  readonly type = API_SUPPLIER_TARIFF_CATEGORIES_UPDATE_SUCCEEDED;

  constructor(public payload: any) {
  }
}


export type Action =
  | ApiUpdateSupplierCategories
  | ApiUpdateSupplierCategoriesSucceeded;
