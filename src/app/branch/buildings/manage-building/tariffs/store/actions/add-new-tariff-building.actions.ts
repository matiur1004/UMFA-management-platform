import {Action as StoreAction} from '@ngrx/store';
import {AddBuildingTariffViewModel, CategoryViewModel} from '@models';

// GET
export const GET_BRANCHES_ALL_CATEGORIES = '[Building Tariffs Assignment] GET_BRANCHES_ALL_CATEGORIES';
export const GET_BRANCHES_ALL_CATEGORIES_SUCCESS = '[Building Tariffs Assignment] GET_BRANCHES_ALL_CATEGORIES_SUCCESS';
export const GET_BRANCHES_ALL_CATEGORIES_FAILED = '[Building Tariffs Assignment] GET_BRANCHES_ALL_CATEGORIES_FAILED';

export class GetBranchesAllCategories implements StoreAction {
  readonly type = GET_BRANCHES_ALL_CATEGORIES;
}

export class GetBranchesAllCategoriesSuccess implements StoreAction {
  readonly type = GET_BRANCHES_ALL_CATEGORIES_SUCCESS;

  constructor(public payload: CategoryViewModel[]) {
  }
}

export class GetBranchesAllCategoriesFailed implements StoreAction {
  readonly type = GET_BRANCHES_ALL_CATEGORIES_FAILED;

  constructor(public payload: any) {
  }
}

// GET Branch Suppliers
export const GET_BRANCH_SUPPLIERS = '[Building Tariffs Assignment] GET_BRANCH_SUPPLIERS';
export const GET_BRANCH_SUPPLIERS_SUCCESS = '[Building Tariffs Assignment] GET_BRANCH_SUPPLIERS_SUCCESS';
export const GET_BRANCH_SUPPLIERS_FAILED = '[Building Tariffs Assignment] GET_BRANCH_SUPPLIERS_FAILED';

export class GetBranchSuppliers implements StoreAction {
  readonly type = GET_BRANCH_SUPPLIERS;

  constructor(public payload: string) {
  }
}

export class GetBranchSuppliersSuccess implements StoreAction {
  readonly type = GET_BRANCH_SUPPLIERS_SUCCESS;

  constructor(public payload: any) {
  }
}

export class GetBranchSuppliersFailed implements StoreAction {
  readonly type = GET_BRANCH_SUPPLIERS_FAILED;

  constructor(public payload: any) {
  }
}

// GET Branch Tariffs
export const GET_BRANCH_TARIFFS = '[Building Tariffs Assignment] GET_BRANCH_TARIFFS';
export const GET_BRANCH_TARIFFS_SUCCESS = '[Building Tariffs Assignment] GET_BRANCH_TARIFFS_SUCCESS';
export const GET_BRANCH_TARIFFS_FAILED = '[Building Tariffs Assignment] GET_BRANCH_TARIFFS_FAILED';

export class GetBranchTariffs implements StoreAction {
  readonly type = GET_BRANCH_TARIFFS;

  constructor() {
  }
}

export class GetBranchTariffsSuccess implements StoreAction {
  readonly type = GET_BRANCH_TARIFFS_SUCCESS;

  constructor(public payload: AddBuildingTariffViewModel[]) {
  }
}

export class GetBranchTariffsFailed implements StoreAction {
  readonly type = GET_BRANCH_TARIFFS_FAILED;

  constructor(public payload: any) {
  }
}

// ADD
export const ADD_NEW_TARIFF_BUILDING = '[Building Tariffs Assignment] ADD_NEW_TARIFF_BUILDING';
export const ADD_NEW_TARIFF_BUILDING_SUCCESS = '[Building Tariffs Assignment] ADD_NEW_TARIFF_BUILDING_SUCCESS';
export const ADD_NEW_TARIFF_BUILDING_FAILED = '[Building Tariffs Assignment] ADD_NEW_TARIFF_BUILDING_FAILED';

export class AddNewTariffBuilding implements StoreAction {
  readonly type = ADD_NEW_TARIFF_BUILDING;

  constructor(public payload: any) {
  }
}

export class AddNewTariffBuildingSuccess implements StoreAction {
  readonly type = ADD_NEW_TARIFF_BUILDING_SUCCESS;

  constructor(public payload: any) {
  }
}

export class AddNewTariffBuildingFailed implements StoreAction {
  readonly type = ADD_NEW_TARIFF_BUILDING_FAILED;

  constructor(public payload: any) {
  }
}

// Select
export const SELECT_BUILDING_TARIFF = '[Building Tariffs Assignment] SELECT_BUILDING_TARIFF';

export class SelectBuildingTariff implements StoreAction {
  readonly type = SELECT_BUILDING_TARIFF;

  constructor(public payload: string) {
  }
}

// SET
export const SET_BRANCH_TARIFFS_ORDER = '[Building Tariffs Assignment] SET_BRANCH_TARIFFS_ORDER';

export class SetBranchTariffsOrder implements StoreAction {
  readonly type = SET_BRANCH_TARIFFS_ORDER;

  constructor(public payload: number) {
  }
}


// UPDATE
export const UPDATE_BRANCH_TARIFFS = '[Building Tariffs Assignment] UPDATE_BRANCH_TARIFFS';

export class UpdateBranchTariffs implements StoreAction {
  readonly type = UPDATE_BRANCH_TARIFFS;

  constructor(public payload: AddBuildingTariffViewModel[]) {
  }
}

// Clear
export const PURGE_ADD_NEW_TARIFF_BUILDING = '[Building Tariffs Assignment] PURGE_ADD_NEW_TARIFF_BUILDING';

export class PurgeAddNewTariffBuilding implements StoreAction {
  readonly type = PURGE_ADD_NEW_TARIFF_BUILDING;
}

export type AddNewTariffBuildingActions =
  | GetBranchSuppliers
  | GetBranchSuppliersSuccess
  | GetBranchSuppliersFailed
  | GetBranchesAllCategories
  | GetBranchesAllCategoriesSuccess
  | GetBranchesAllCategoriesFailed
  | GetBranchTariffs
  | GetBranchTariffsSuccess
  | GetBranchTariffsFailed
  | AddNewTariffBuilding
  | AddNewTariffBuildingSuccess
  | AddNewTariffBuildingFailed
  | SelectBuildingTariff
  | SetBranchTariffsOrder
  | UpdateBranchTariffs
  | PurgeAddNewTariffBuilding;
