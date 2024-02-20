import {Action as StoreAction} from '@ngrx/store';
import {NewTariffVersionCurrentTariff} from '@models';

export const REQUEST_TARIFF_LIST = '[Tariff] REQUEST_TARIFF_LIST ';
export const REQUEST_TARIFF_LIST_COMPLETE = '[Tariff] REQUEST_TARIFF_LIST_COMPLETE';

export const DELETE_TARIFF_VERSION = '[Tariff] DELETE_TARIFF_VERSION';
export const DELETE_TARIFF_SUB_VERSION = '[Tariff] DELETE_TARIFF_SUB_VERSION';

export const UPDATE_ORDER = '[Tariff] UPDATE_ORDER';
export const UPDATE_VERSION_ORDER = '[Tariff] UPDATE_VERSION_ORDER';
export const UPDATE_SEARCH_KEY = '[Tariff] UPDATE_SEARCH_KEY';
export const UPDATE_SUPPLY_TYPE_FILTER = '[Tariff] UPDATE_SUPPLY_TYPE_FILTER';
export const UPDATE_BUILDING_CATEGORY_ID = '[Tariff] UPDATE_BUILDING_CATEGORY_ID';

export const UPDATE_TARIFF_VERSION_ID = '[Tariff] UPDATE_TARIFF_VERSION_ID';

export const ADD_TARIFF_VERSION = '[Tariff] ADD_TARIFF_VERSION';
export const OPEN_TARIFF_POPUP = '[Tariff] OPEN_TARIFF_POPUP';
export const RESULT_TARIFF_POPUP_SUCCESS = '[Tariff] RESULT_TARIFF_POPUP_SUCCESS';
export const RESULT_TARIFF_POPUP_CANCEL = '[Tariff] RESULT_TARIFF_POPUP_CANCEL';


export class RequestTariffList implements StoreAction {
  readonly type = REQUEST_TARIFF_LIST;

  constructor() {
  }
}

export class RequestTariffListComplete implements StoreAction {
  readonly type = REQUEST_TARIFF_LIST_COMPLETE;

  constructor(public payload: any) {
  }
}

export class UpdateOrder implements StoreAction {
  readonly type = UPDATE_ORDER;

  constructor(public payload: any) {
  }
}

export class UpdateVersionOrder implements StoreAction {
  readonly type = UPDATE_VERSION_ORDER;

  constructor(public payload: any) {
  }
}

export class UpdateSearchKey implements StoreAction {
  readonly type = UPDATE_SEARCH_KEY;

  constructor(public payload: any) {
  }
}

export class UpdateSupplyTypeFilter implements StoreAction {
  readonly type = UPDATE_SUPPLY_TYPE_FILTER;

  constructor(public payload: any) {
  }
}

export class UpdateBuildingCategoryId implements StoreAction {
  readonly type = UPDATE_BUILDING_CATEGORY_ID;

  constructor(public payload: any) {
  }
}

export class UpdateTariffVersionId implements StoreAction {
  readonly type = UPDATE_TARIFF_VERSION_ID;

  constructor(public payload: any) {
  }
}

export class DeleteTariffSubVersion implements StoreAction {
  readonly type = DELETE_TARIFF_SUB_VERSION;

  constructor(public payload: { versionId: string }) {
  }
}

export class DeleteTariffVersion implements StoreAction {
  readonly type = DELETE_TARIFF_VERSION;

  constructor(public payload: { tariffId: string, majorVersion: number }) {
  }
}

export class AddTariffVersion implements StoreAction {
  readonly type = ADD_TARIFF_VERSION;

  constructor(public isSubVersion: boolean, public payload?: {
    tariffId: string,
    majorVersion: number,
    minorVersion: number,
    currentTariff?: NewTariffVersionCurrentTariff
  }) {
  }
}

export class OpenTariffPopup implements StoreAction {
  readonly type = OPEN_TARIFF_POPUP;

  constructor(public payload: {
    majorVersion: number,
    minorVersion: number,
    isSubVersion: boolean,
    nextAvaibleDate: Date,
    currentTariff?: NewTariffVersionCurrentTariff
  }) {
  }
}

export class ResultTariffPopupSuccess implements StoreAction {
  readonly type = RESULT_TARIFF_POPUP_SUCCESS;

  constructor(public payload: {
    result: boolean,
    isSubVersion: boolean,
    currentTariff?: NewTariffVersionCurrentTariff
  }) {
  }
}

export class ResultTariffPopupCancel implements StoreAction {
  readonly type = RESULT_TARIFF_POPUP_CANCEL;

  constructor() {
  }
}

export const GET_BUILDING_CATEGORIES = '[Tariffs] GET_BUILDING_CATEGORIES';
export const GET_BUILDING_CATEGORIES_COMPLETE = '[Tariffs] GET_BUILDING_CATEGORIES_COMPLETE';
export const GET_BUILDING_CATEGORIES_FAILED = '[Tariffs] GET_BUILDING_CATEGORIES_FAILED';

export class GetBuildingCategories implements StoreAction {
  readonly type = GET_BUILDING_CATEGORIES;

  constructor() {
  }
}

export class GetBuildingCategoriesComplete implements StoreAction {
  readonly type = GET_BUILDING_CATEGORIES_COMPLETE;

  constructor(public payload: any) {
  }
}


export class GetBuildingCategoriesFailed implements StoreAction {
  readonly type = GET_BUILDING_CATEGORIES_FAILED;

  constructor() {
  }
}


export type Action = RequestTariffList
  | RequestTariffListComplete
  | UpdateOrder
  | UpdateSearchKey
  | UpdateSupplyTypeFilter
  | ResultTariffPopupSuccess
  | UpdateBuildingCategoryId
  | UpdateTariffVersionId
  | OpenTariffPopup
  | ResultTariffPopupCancel
  | DeleteTariffSubVersion
  | DeleteTariffVersion
  | GetBuildingCategories
  | GetBuildingCategoriesComplete
  | GetBuildingCategoriesFailed
  | UpdateVersionOrder
  | AddTariffVersion;
