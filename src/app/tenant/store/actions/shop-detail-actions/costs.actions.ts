import {Action as StoreAction} from '@ngrx/store';

export const GET_COSTS_REQUEST = '[Tenant Profiles Shop Detail Costs] GET_COSTS_REQUEST';

export const GET_COSTS_REQUEST_COMPLETE = '[Tenant Profiles Shop Detail Costs] GET_COSTS_REQUEST_COMPLETE';

export class GetCostsRequest implements StoreAction {
  readonly type = GET_COSTS_REQUEST;

  constructor() {
  }
}

export class GetCostsRequestComplete implements StoreAction {
  readonly type = GET_COSTS_REQUEST_COMPLETE;

  constructor(public payload: any) {
  }
}

export type Actions = GetCostsRequest | GetCostsRequestComplete;
