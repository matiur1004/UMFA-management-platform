import {NewTariffVersionCurrentTariff} from "@app/shared/models";
import {Action as StoreAction} from '@ngrx/store';

export const REQUEST_TARIFF_LIST = '[Building Tariff] REQUEST_TARIFF_LIST ';
export const REQUEST_TARIFF_LIST_COMPLETE = '[Building Tariff] REQUEST_TARIFF_LIST_COMPLETE';

export const SET_BUILDING_CATEGORIES = '[Building Tariff] SET_BUILDING_CATEGORIES';

export const DELETE_TARIFF_SUBVERSION = '[Building Tariff] DELETE_TARIFF_SUBVERSION';
export const DELETE_TARIFF_VERSION = '[Building Tariff] DELETE_TARIFF_VERSION';

export const UPDATE_ORDER = '[Building Tariff] UPDATE_ORDER';
export const UPDATE_VERSION_ORDER = '[Building Tariff] UPDATE_VERSION_ORDER';
export const UPDATE_SEARCH_KEY = '[Building Tariff] UPDATE_SEARCH_KEY';
export const UPDATE_SUPPLY_TYPE_FILTER = '[Building Tariff] UPDATE_SUPPLY_TYPE_FILTER';
export const UPDATE_BUILDING_CATEGORY_ID = '[Building Tariff] UPDATE_BUILDING_CATEGORY_ID';

export const UPDATE_TARIFF_VERSION_ID = '[Building Tariff] UPDATE_TARIFF_VERSION_ID';

export const ADD_TARIFF_VERSION = '[Building Tariff] ADD_TARIFF_VERSION';
export const OPEN_TARIFF_POPUP = '[Building Tariff] OPEN_TARIFF_POPUP';
export const RESULT_TARIFF_POPUP_SUCCESS = '[Building Tariff] RESULT_TARIFF_POPUP_SUCCESS';
export const RESULT_TARIFF_POPUP_CANCEL = '[Building Tariff] RESULT_TARIFF_POPUP_CANCEL';

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
  readonly type = DELETE_TARIFF_SUBVERSION;

  constructor(public payload: { tariffVersionId: string }) {
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

export const GET_BUILDING_CATEGORIES = '[Building Tariffs] GET_BUILDING_CATEGORIES';
export const GET_BUILDING_CATEGORIES_COMPLETE = '[Building Tariffs] GET_BUILDING_CATEGORIES_COMPLETE';
export const GET_BUILDING_CATEGORIES_FAILED = '[Building Tariffs] GET_BUILDING_CATEGORIES_FAILED';

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


export const CREATE_TARIFF_CLICK = '[Building Tariff Form] CREATE_TARIFF_CLICK';
export const CREATE_TARIFF_OPEN_MODAL = '[Building Tariff Form] CREATE_TARIFF_OPEN_MODAL';
export const CREATE_TARIFF_REQUEST = '[Building Tariff Form] CREATE_TARIFF_REQUEST';
export const CREATE_TARIFF_REQUEST_COMPLETE = '[Building Tariff Form] CREATE_TARIFF_REQUEST_COMPLETE';


export class CreateTariffClick implements StoreAction {
  readonly type = CREATE_TARIFF_CLICK;

  constructor() {
  }
}

export class OpenCreateTariffModal implements StoreAction {
  readonly type = CREATE_TARIFF_OPEN_MODAL;

  constructor() {
  }
}

export class CreateTariffRequest implements StoreAction {
  readonly type = CREATE_TARIFF_REQUEST;

  constructor(public payload: { name: string, supplyType: number, buildingTariffCategoriesFormIdIds: string[] }) {
  }
}

export class CreateTariffRequestComplete implements StoreAction {
  readonly type = CREATE_TARIFF_REQUEST_COMPLETE;

  constructor(public payload: { buildingId: string, tariffVersionId: string }) {
  }
}

export type Action = RequestTariffList
  | RequestTariffListComplete
  | UpdateOrder
  | UpdateSearchKey
  | UpdateSupplyTypeFilter
  | UpdateBuildingCategoryId
  | UpdateTariffVersionId
  | DeleteTariffSubVersion
  | DeleteTariffVersion
  | GetBuildingCategories
  | GetBuildingCategoriesComplete
  | GetBuildingCategoriesFailed
  | UpdateVersionOrder
  | AddTariffVersion
  | OpenTariffPopup
  | ResultTariffPopupSuccess
  | ResultTariffPopupCancel;
