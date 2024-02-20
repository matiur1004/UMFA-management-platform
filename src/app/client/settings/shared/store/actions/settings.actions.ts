import {Action as StoreAction} from '@ngrx/store';

export const GET_USER_REQUEST = '[Client user settings] GET_USER_REQUEST';

export class GetUserRequest implements StoreAction {
  readonly type = GET_USER_REQUEST;

  constructor() {
  }
}

export type Action = GetUserRequest;
