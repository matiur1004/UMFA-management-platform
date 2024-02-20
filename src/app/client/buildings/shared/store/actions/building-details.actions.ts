import {Action as StoreAction} from '@ngrx/store';

export const BUILDING_DETAILS_REQUEST = '[Client Building Details] BUILDING_DETAILS_REQUEST';
export const BUILDING_DETAILS_REQUEST_COMPLETE = '[Client Building Details] BUILDING_DETAILS_REQUEST_COMPLETE';

export const UPDATE_SEARCH_KEY = '[Client Building Details] UPDATE_SEARCH_KEY';
export const UPDATE_TENANT_FILTER = '[Client Building Details] UPDATE_TENANT_FILTER';
export const UPDATE_FLOOR_FILTER = '[Client Building Details] UPDATE_FLOOR_FILTER';
export const UPDATE_STATUS_FILTER = '[Client Building Details] UPDATE_STATUS_FILTER';

export const UPDATE_IS_TOGGLE = '[Client Building Details] UPDATE_IS_TOGGLE';

export const SET_SHOP_DETAILS = '[Client Building Details] SET_SHOP_DETAILS';

export const SAVE_CHANGES_REQUEST = '[Client Building Details] SAVE_CHANGES_REQUEST';

export const SET_SHOPS = '[Client Building Details] SET_SHOPS';

export class BuildingDetailsRequest implements StoreAction {
  readonly type = BUILDING_DETAILS_REQUEST;

  constructor(public payload: any) {
  }
}

export class BuildingDetailsRequestComplete implements StoreAction {
  readonly type = BUILDING_DETAILS_REQUEST_COMPLETE;

  constructor(public payload: any) {
  }
}

export class UpdateSearchKey implements StoreAction {
  readonly type = UPDATE_SEARCH_KEY;

  constructor(public payload: any) {
  }
}

export class UpdateTenantFilter implements StoreAction {
  readonly type = UPDATE_TENANT_FILTER;

  constructor(public payload: any) {
  }
}

export class UpdateFloorFilter implements StoreAction {
  readonly type = UPDATE_FLOOR_FILTER;

  constructor(public payload: any) {
  }
}

export class UpdateStatusFilter implements StoreAction {
  readonly type = UPDATE_STATUS_FILTER;

  constructor(public payload: any) {
  }
}

export class UpdateIsToggle implements StoreAction {
  readonly type = UPDATE_IS_TOGGLE;

  constructor(public payload: any) {
  }
}

export class SetShops implements StoreAction {
  readonly type = SET_SHOPS;

  constructor(public payload: any) {
  }
}

export class SetShopDetails implements StoreAction {
  readonly type = SET_SHOP_DETAILS;

  constructor(public payload: any) {
  }
}

export class SaveChangesRequest implements StoreAction {
  readonly type = SAVE_CHANGES_REQUEST;

  constructor() {
  }
}

export type Action = BuildingDetailsRequest | BuildingDetailsRequestComplete | UpdateFloorFilter |
  UpdateSearchKey | UpdateTenantFilter | UpdateStatusFilter | UpdateIsToggle |
  SetShops | SetShopDetails | SaveChangesRequest;
