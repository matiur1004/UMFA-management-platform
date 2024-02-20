import {Action as StoreAction} from '@ngrx/store';

export const GET_SHOPS_REQUEST = '[Building Equipment Shop Step] GET_SHOPS_REQUEST';
export const GET_SHOPS_REQUEST_COMPLETE = '[Building Equipment Shop Step] GET_SHOPS_REQUEST_COMPLETE';
export const GET_COMMON_AREAS_REQUEST = '[Building Equipment Shop Step] GET_COMMON_AREAS_REQUEST';
export const GET_COMMON_AREAS_REQUEST_SUCCESS = '[Building Equipment Shop Step] GET_COMMON_AREAS_REQUEST_SUCCESS';
export const RESET_SHOP_DATA = '[Building Equipment Shop Step] RESET_SHOP_DATA';
export const TOGGLE_UNIT = '[Building Equipment Shop Step] TOGGLE_UNIT';

export const UPDATE_SEARCH_TERM = '[Building Equipment Shop Step] UPDATE_SEARCH_TERM';
export const UPDATE_SEARCH_TERM_COMPLETE = '[Building Equipment Shop Step] UPDATE_SEARCH_TERM_COMPLETE';

export const UPDATE_SHOP_FILTER = '[Building Equipment Shop Step] UPDATE_SHOP_FILTER';


export class GetShopsRequest implements StoreAction {
  readonly type = GET_SHOPS_REQUEST;

  constructor() {
  }
}

export class GetShopsRequestComplete implements StoreAction {
  readonly type = GET_SHOPS_REQUEST_COMPLETE;

  constructor(public payload: any) {
  }
}

export class GetCommonAreasRequest implements StoreAction {
  readonly type = GET_COMMON_AREAS_REQUEST;

  constructor() {
  }
}

export class GetCommonAreasRequestSuccess implements StoreAction {
  readonly type = GET_COMMON_AREAS_REQUEST_SUCCESS;

  constructor(public payload: any) {
  }
}

export class ResetShopData implements StoreAction {
  readonly type = RESET_SHOP_DATA;

  constructor() {
  }
}

export class ToggleUnit implements StoreAction {
  readonly type = TOGGLE_UNIT;

  constructor(public payload: any) {
  }
}

export class UpdateSearchTermComplete implements StoreAction {
  readonly type = UPDATE_SEARCH_TERM_COMPLETE;

  constructor(public payload: any) {
  }
}

export class UpdateSearchTerm implements StoreAction {
  readonly type = UPDATE_SEARCH_TERM;

  constructor(public payload: any) {
  }
}

export class UpdateFilter implements StoreAction {
  readonly type = UPDATE_SHOP_FILTER;

  constructor(public payload: any) {
  }
}

export type Action =
  GetShopsRequest
  | GetShopsRequestComplete
  | ResetShopData
  | ToggleUnit
  | UpdateFilter
  | UpdateSearchTerm
  | UpdateSearchTermComplete
  | GetCommonAreasRequest
  | GetCommonAreasRequestSuccess;
