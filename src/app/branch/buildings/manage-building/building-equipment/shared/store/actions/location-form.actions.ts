import {Action as StoreAction} from '@ngrx/store';

export const EDIT_LOCATION = '[Building Equipment Location Form] EDIT_LOCATION';
export const CREATE_LOCATION = '[Building Equipment Location Form] CREATE_LOCATION';
export const SEND_LOCATION_REQUEST = '[Building Equipment Location Form] SEND_LOCATION_REQUEST';
export const SEND_LOCATION_REQUEST_COMPLETE = '[Building Equipment Location Form] SEND_LOCATION_REQUEST_COMPLETE';


export class EditLocation implements StoreAction {
  readonly type = EDIT_LOCATION;

  constructor(public payload: any) {
  }
}

export class CreateLocation implements StoreAction {
  readonly type = CREATE_LOCATION;

  constructor() {
  }
}

export class SendLocationRequest implements StoreAction {
  readonly type = SEND_LOCATION_REQUEST;

  constructor() {
  }
}

export class SendLocationRequestComplete implements StoreAction {
  readonly type = SEND_LOCATION_REQUEST_COMPLETE;

  constructor(public payload: { versionId: string } = {versionId: null}) {
  }
}

export type Action = EditLocation | CreateLocation | SendLocationRequest | SendLocationRequestComplete;
