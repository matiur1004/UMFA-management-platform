import {Action as StoreAction} from '@ngrx/store';

export const SEARCH_TENANT_REQUEST = '[Tenant Profiles Add New Profile] SEARCH_TENANT_REQUEST';
export const SEARCH_TENANT_REQUEST_COMPLETE = '[Tenant Profiles Add New Profile] SEARCH_TENANT_REQUEST_COMPLETE';

export const ADD_NEW_PROFILE_REQUEST = '[Tenant Profiles Add New Profile] ADD_NEW_PROFILE_REQUEST';

export class SearchTenantRequest implements StoreAction {
  readonly type = SEARCH_TENANT_REQUEST;

  constructor(public payload: any) {
  }
}

export class SearchTenantRequestComplete implements StoreAction {
  readonly type = SEARCH_TENANT_REQUEST_COMPLETE;

  constructor(public payload: any) {
  }
}

export class AddNewProfileRequest implements StoreAction {
  readonly type = ADD_NEW_PROFILE_REQUEST;

  constructor(public payload: any) {
  }
}

export type Action = SearchTenantRequest | SearchTenantRequestComplete | AddNewProfileRequest;
