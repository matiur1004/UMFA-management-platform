import {Action as StoreAction} from '@ngrx/store';

export const EDIT_PACKAGE = '[Package Form] EDIT_PACKAGE';
export const CREATE_PACKAGE = '[Package Form] CREATE_PACKAGE';
export const SEND_PACKAGE_REQUEST = '[Package Form] SEND_PACKAGE_REQUEST';
export const SEND_PACKAGE_REQUEST_COMPLETE = '[Package Form] SEND_PACKAGE_REQUEST_COMPLETE';
export const TOGGLE_DISPLAY_PRICE = '[Package Form] TOGGLE_DISPLAY_PRICE';
export const TOGGLE_SERVICE_EXPNAD = '[Package Form] TOGGLE_SERVICE_EXPNAD';
export const GET_PACKAGE_REQUEST = '[Package Form] GET_PACKAGE_REQUEST';
export const GET_PACKAGE_REQUEST_COMPLETE = '[Package Form] GET_PACKAGE_REQUEST_COMPLETE';
export const UPDATE_SERVICE_STATUS = '[Package Form] UPDATE_SERVICE_STATUS';
export const UPDATE_SERVICE_CATEGORY_FILTER = '[Package Form] UPDATE_SERVICE_CATEGORY_FILTER';
export const UPDATE_SERVICE_FILTER = '[Package Form] UPDATE_SERVICE_FILTER';
export const UPDATE_SERVICE_VALUE = '[Package Form] UPDATE_SERVICE_VALUE';
export const APPLY_RECOM_PRICE = '[Package Form] APPLY_RECOM_PRICE';
export const UPDATE_SERVICE_METER_VALUE = '[Package Form] UPDATE_SERVICE_METER_VALUE';
export const UPDATE_SERVICE_CHARGING_METHOD = '[Package Form] UPDATE_SERVICE_CHARGING_METHOD'
export const UPDATE_CHARGING_TYPE = '[Package Form] UPDATE_CHARGING_TYPE';
export const REQUEST_CALCULATION_ACTUAL_PRICE = '[Package Form] REQUEST_CALCULATION_ACTUAL_PRICE';
export const REQUEST_CALCULATION_ACTUAL_PRICE_COMPLETE = '[Package Form] REQUEST_CALCULATION_ACTUAL_PRICE_COMPLETE';
export const UPDATE_RECOMMENDED_PRICES = '[Package Form] UPDATE_RECOMMENDED_PRICES';

export class EditPackage implements StoreAction {
  readonly type = EDIT_PACKAGE;

  constructor(public payload: any) {
  }
}

export class CreatePackage implements StoreAction {
  readonly type = CREATE_PACKAGE;

  constructor() {
  }
}

export class SendPackageRequest implements StoreAction {
  readonly type = SEND_PACKAGE_REQUEST;

  constructor() {
  }
}

export class SendPackageRequestComplete implements StoreAction {
  readonly type = SEND_PACKAGE_REQUEST_COMPLETE;

  constructor() {
  }
}

export class ToggleDisplayPrice implements StoreAction {
  readonly type = TOGGLE_DISPLAY_PRICE;

  constructor() {
  }
}

export class ToggleServiceExpand implements StoreAction {
  readonly type = TOGGLE_SERVICE_EXPNAD;

  constructor(public payload: any) {
  }
}

export class GetPackageRequest implements StoreAction {
  readonly type = GET_PACKAGE_REQUEST;

  constructor(public payload: any) {
  }
}

export class GetPackageRequestComplete implements StoreAction {
  readonly type = GET_PACKAGE_REQUEST_COMPLETE;

  constructor(public payload: any) {
  }
}

export class UpdateServiceStatus implements StoreAction {
  readonly type = UPDATE_SERVICE_STATUS;

  constructor(public payload: any) {
  }
}

export class UpdateServiceCategoryFilter implements StoreAction {
  readonly type = UPDATE_SERVICE_CATEGORY_FILTER;

  constructor(public payload: any) {
  }
}

export class UpdateServiceFilter implements StoreAction {
  readonly type = UPDATE_SERVICE_FILTER;

  constructor(public payload: any) {
  }
}

export class UpdateServiceValue implements StoreAction {
  readonly type = UPDATE_SERVICE_VALUE;

  constructor(public payload: any) {
  }
}

export class ApplyRecomPrice implements StoreAction {
  readonly type = APPLY_RECOM_PRICE;

  constructor(public payload: any) {
  }
}

export class UpdateServiceMeterValue implements StoreAction {
  readonly type = UPDATE_SERVICE_METER_VALUE;

  constructor(public payload: any) {
  }
}

export class UpdateServiceChargingMethod implements StoreAction {
  readonly type = UPDATE_SERVICE_CHARGING_METHOD;

  constructor(public payload: any) {
  }
}

export class UpdateChargingType implements StoreAction {
  readonly type = UPDATE_CHARGING_TYPE;

  constructor(public payload: any) {
  }
}

export class RequestCalCulationPrice implements StoreAction {
  readonly type = REQUEST_CALCULATION_ACTUAL_PRICE;

  constructor() {
  }
}

export class RequestCalCulationPriceComplete implements StoreAction {
  readonly type = REQUEST_CALCULATION_ACTUAL_PRICE_COMPLETE;

  constructor(public payload: any) {
  }
}

export class UpdateRecommendedPrices implements StoreAction {
  readonly type = UPDATE_RECOMMENDED_PRICES;

  constructor(public payload: any) {
  }
}

export type Action = EditPackage | CreatePackage | SendPackageRequest | SendPackageRequestComplete
  | ToggleDisplayPrice | ToggleServiceExpand | GetPackageRequest | GetPackageRequestComplete
  | UpdateServiceStatus | UpdateServiceCategoryFilter | UpdateServiceFilter | UpdateServiceValue
  | ApplyRecomPrice | UpdateServiceMeterValue | UpdateServiceChargingMethod | UpdateChargingType
  | RequestCalCulationPrice | RequestCalCulationPriceComplete
  | UpdateRecommendedPrices;

