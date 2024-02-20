import {Action as StoreAction} from '@ngrx/store';

export const GET_SERVICES_REQUEST = '[Package Customization] GET_SERVICES_REQUEST';
export const GET_SERVICES_REQUEST_COMPLETE = '[Package Customization] GET_SERVICES_REQUEST_COMPLETE';
export const UPDATE_SERVICES = '[Package Customization] UPDATE_SERVICES';
export const UPDATE_SERVICES_COMPLETE = '[Package Customization] UPDATE_SERVICES_COMPLETE';

export const UPDATE_TOTAL_PRICE = '[Package Customization] UPDATE_TOTAL_PRICE';
export const UPDATE_ITEMS_COUNT = '[Package Customization] UPDATE_ITEMS_COUNT';

export const TOGGLE_SERVICE_EXPNAD = '[Package Customization] TOGGLE_SERVICE_EXPNAD';
export const UPDATE_SERVICE_STATUS = '[Package Customization] UPDATE_SERVICE_STATUS';
export const UPDATE_SERVICE_VALUE = '[Package Customization] UPDATE_SERVICE_VALUE';
export const CALCULATE_PRICES = '[Package Customization] CALCULATE_PRICES';
export const UPDATE_CHARGING_METHOD = '[Package Customization] UPDATE_CHARGING_METHOD';
export const SAVE_CUSTOMIZATION_SERVICES = '[Package Customization] SAVE_CUSTOMIZATION_SERVICES';


export class GetServicesRequest implements StoreAction {
  readonly type = GET_SERVICES_REQUEST;

  constructor() {
  }
}

export class GetServicesRequestComplete implements StoreAction {
  readonly type = GET_SERVICES_REQUEST_COMPLETE;

  constructor(public payload: any) {
  }
}

export class UpdateServices implements StoreAction {
  readonly type = UPDATE_SERVICES;

  constructor(public payload: any) {
  }
}

export class UpdateServicesComplete implements StoreAction {
  readonly type = UPDATE_SERVICES_COMPLETE;

  constructor(public payload: any) {
  }
}

export class UpdateTotalPrice implements StoreAction {
  readonly type = UPDATE_TOTAL_PRICE;

  constructor(public payload: any) {
  }
}

export class UpdateItemsCount implements StoreAction {
  readonly type = UPDATE_ITEMS_COUNT;

  constructor(public payload: any) {
  }
}

export class ToggleServiceExpand implements StoreAction {
  readonly type = TOGGLE_SERVICE_EXPNAD;

  constructor(public payload: any) {
  }
}

export class UpdateServiceStatus implements StoreAction {
  readonly type = UPDATE_SERVICE_STATUS;

  constructor(public payload: any) {
  }
}

export class UpdateServiceValue implements StoreAction {
  readonly type = UPDATE_SERVICE_VALUE;

  constructor(public payload: any) {
  }
}

export class CalculatePrices implements StoreAction {
  readonly type = CALCULATE_PRICES;

  constructor() {
  }
}

export class UpdateChargingMethod implements StoreAction {
  readonly type = UPDATE_CHARGING_METHOD;

  constructor(public payload: any) {
  }
}

export class SaveCustomizationServices implements StoreAction {
  readonly type = SAVE_CUSTOMIZATION_SERVICES;

  constructor() {
  }
}

export type Action = GetServicesRequest | GetServicesRequestComplete | ToggleServiceExpand
  | UpdateServiceStatus | UpdateServiceValue | CalculatePrices | UpdateChargingMethod
  | UpdateServices | SaveCustomizationServices | UpdateItemsCount | UpdateTotalPrice | UpdateServicesComplete;

