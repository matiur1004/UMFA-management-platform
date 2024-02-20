import {Action as StoreAction} from '@ngrx/store';

export const EDIT_USER = '[Tenant user settings] EDIT_USER';
export const SAVE_USER = '[Tenant user settings] SAVE_USER';
export const SAVE_USER_COMPLETE = '[Tenant user settings] SAVE_USER_COMPLETE';

export const CHANGE_PASSWORD = '[Tenant user settings] CHANGE_PASSWORD';
export const CHANGE_PASSWORD_COMPLETE = '[Tenant user settings] CHANGE_PASSWORD_COMPLETE';

export const SET_LOGO = '[Tenant user settings] SET_LOGO';

export class EditUser implements StoreAction {
  readonly type = EDIT_USER;

  constructor() {
  }
}

export class SaveUser implements StoreAction {
  readonly type = SAVE_USER;

  constructor() {
  }
}

export class ChangePassword implements StoreAction {
  readonly type = CHANGE_PASSWORD;

  constructor() {
  }
}

export class SetLogo implements StoreAction {
  readonly type = SET_LOGO;

  constructor(public payload: any) {
  }
}

export class SaveUserComplete implements StoreAction {
  readonly type = SAVE_USER_COMPLETE;

  constructor() {
  }
}

export class ChangePasswordComplete implements StoreAction {
  readonly type = CHANGE_PASSWORD_COMPLETE;

  constructor() {
  }
}

export type Action = EditUser | SaveUser | ChangePassword | SetLogo |
  SaveUserComplete | ChangePasswordComplete;
