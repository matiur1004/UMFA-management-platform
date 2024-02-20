import {Action as StoreAction} from '@ngrx/store';

export const TENANT_BUILDING_LIST_REQUEST = '[Tenant Profiles] TENANT_BUILDING_LIST_REQUEST';
export const TENANT_BUILDING_LIST_REQUEST_COMPLETE = '[Tenant Profiles] TENANT_BUILDING_LIST_REQUEST_COMPLETE';

export const DELETE_PROFILE = '[Tenant Profiles] DELETE_PROFILE';

export const UPDATE_SEARCH_KEY = '[Tenant Profiles] UPDATE_SEARCH_KEY';
export const UPDATE_BUILDING_FILTER = '[Tenant Profiles] UPDATE_BUILDING_FILTER';

export class TenantBuildingListRequest implements StoreAction {
  readonly type = TENANT_BUILDING_LIST_REQUEST;

  constructor() {
  }
}

export class TenantBuildingListRequestComplete implements StoreAction {
  readonly type = TENANT_BUILDING_LIST_REQUEST_COMPLETE;

  constructor(public payload: any) {
  }
}

export class UpdateSearchKey implements StoreAction {
  readonly type = UPDATE_SEARCH_KEY;

  constructor(public payload: any) {
  }
}

export class UpdateBuildingFilter implements StoreAction {
  readonly type = UPDATE_BUILDING_FILTER;

  constructor(public payload: any) {
  }
}

export class DeleteProfile implements StoreAction {
  readonly type = DELETE_PROFILE;

  constructor(public payload: any) {
  }
}

export type Action = TenantBuildingListRequest | TenantBuildingListRequestComplete |
  UpdateBuildingFilter | UpdateSearchKey | DeleteProfile;
