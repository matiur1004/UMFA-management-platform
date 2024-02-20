import {Action as StoreAction} from '@ngrx/store';

export const GET_CLIENT_ID_REQUEST = '[Client Common Data] GET_CLIENT_ID_REQUEST';
export const GET_CLIENT_ID_REQUEST_COMPLETE = '[Client Common Data] GET_CLIENT_ID_REQUEST_COMPLETE';

export class ClientIdRequest implements StoreAction {
  readonly type = GET_CLIENT_ID_REQUEST;

  constructor() {
  }
}

export class ClientIdRequestComplete implements StoreAction {
  readonly type = GET_CLIENT_ID_REQUEST_COMPLETE;

  constructor(public payload: any) {
  }
}

export type Action = ClientIdRequest | ClientIdRequestComplete;
