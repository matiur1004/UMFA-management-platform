import {Action as StoreAction} from '@ngrx/store';

export const SAVE_SERVICES = '[MC Service] SAVE_SERVICES';
export const GET_SERVICES_REQUEST = '[MC Service] GET_SERVICES_REQUEST';
export const GET_SERVICES_REQUEST_COMPLETE = '[MC Service] GET_SERVICES_REQUEST_COMPLETE';
export const ADD_SERVICE = '[MC Service] ADD_SERVICE';
export const DELETE_SERVICE = '[MC Service] DELETE_SERVICE';
export const UPDATE_SERVICE_STATUS_REQUEST = '[MC Service] UPDATE_SERVICE_STATUS';
export const UPDATE_SERVICE_STATUS_REQUEST_COMPLETE = '[MC Service] UPDATE_SERVICE_STATUS_REQUEST_COMPLETE';
export const TOGGLE_DISPLAY_PRICE = '[MC Service] TOGGLE_DISPLAY_PRICE';
export const CHANGE_SERVICE_STATUS = '[MC Service] CHANGE_SERVICE_STATUS';
export const TOGGLE_SERVICE_EXPNAD = '[MC Service] TOGGLE_SERVICE_EXPNAD';
export const UPDATE_SERVICE = '[MC Service] UPDATE_SERVICE';
export const UPDATE_SERVICE_FILTER = '[MC Service] UPDATE_SERVICE_FILTER';
export const UPDATE_SERVICE_CATEGORY_FILTER = '[MC Service] UPDATE_SERVICE_CATEGORY_FILTER';

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

export class DeleteService implements StoreAction {
  readonly type = DELETE_SERVICE;

  constructor(public payload: string) {
  }
}

export class UpdateServiceStatusRequest implements StoreAction {
  readonly type = UPDATE_SERVICE_STATUS_REQUEST;

  constructor(public payload: any) {
  }
}

export class UpdateServiceStatusRequestComplete implements StoreAction {
  readonly type = UPDATE_SERVICE_STATUS_REQUEST_COMPLETE;

  constructor(public payload: any) {
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

export class UpdateService implements StoreAction {
  readonly type = UPDATE_SERVICE;

  constructor(public payload: any) {
  }
}

export class AddService implements StoreAction {
  readonly type = ADD_SERVICE;

  constructor(public payload: any) {
  }
}

export class UpdateServiceFilter implements StoreAction {
  readonly type = UPDATE_SERVICE_FILTER;

  constructor(public payload: any) {
  }
}

export class UpdateServiceCategoryFilter implements StoreAction {
  readonly type = UPDATE_SERVICE_CATEGORY_FILTER;

  constructor(public payload: any) {
  }
}

export type Action = GetServicesRequest | GetServicesRequestComplete | DeleteService
  | UpdateServiceStatusRequest | UpdateServiceStatusRequestComplete | ToggleDisplayPrice
  | ToggleServiceExpand | UpdateService | AddService | UpdateServiceFilter | UpdateServiceCategoryFilter;
