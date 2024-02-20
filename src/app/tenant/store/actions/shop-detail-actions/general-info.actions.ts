import {Action as StoreAction} from '@ngrx/store';

export const GET_GENERAL_INFO_REQUEST = '[Tenant Profiles Shop Detail General Info] GET_GENERAL_INFO_REQUEST';

export const GET_GENERAL_INFO_REQUEST_COMPLETE = '[Tenant Profiles Shop Detail General Info] GET_GENERAL_INFO_REQUEST_COMPLETE';

export const SET_SHOP_ID = '[Tenant Profiles Shop Detail General Info] SET_SHOP_ID';
export const SET_BUILDING_ID = '[Tenant Profiles Shop Detail General Info] SET_BUILDING_ID';

export class GetGeneralInfoRequest implements StoreAction {
  readonly type = GET_GENERAL_INFO_REQUEST;

  constructor() {
  }
}

export class GetGeneralInfoRequestComplete implements StoreAction {
  readonly type = GET_GENERAL_INFO_REQUEST_COMPLETE;

  constructor(public payload: any) {
  }
}

export class SetShopId implements StoreAction {
  readonly type = SET_SHOP_ID;

  constructor(public payload: any) {
  }
}

export class SetBuildingId implements StoreAction {
  readonly type = SET_BUILDING_ID;

  constructor(public payload: any) {
  }
}

export type Actions = GetGeneralInfoRequest | GetGeneralInfoRequestComplete |
  SetShopId | SetBuildingId;
