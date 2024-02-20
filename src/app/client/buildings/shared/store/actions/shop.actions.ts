import {Action as StoreAction} from '@ngrx/store';

// Split shop
export const SET_SHOP = '[Client Shop Actions] SET_SHOP';
export const CHANGE_SHOPS_NUMBER = '[Client Shop Actions] CHANGE_SHOPS_NUMBER';
export const REMOVE_SHOP = '[Client Shop Actions] REMOVE_SHOP';
export const SPLIT_SHOP = '[Client Shop Actions] SPLIT_SHOP';

// Spare shop
export const TOGGLE_SPARE = '[Client Shop Actions] TOGGLE_SPARE';

// Occupy shop
export const CHANGE_RENT_DETAILS = '[Client Shop Actions] CHANGE_RENT_DETAILS';

export class ChangeShopsNumber implements StoreAction {
  readonly type = CHANGE_SHOPS_NUMBER;

  constructor(public payload: any) {
  }
}

export class RemoveShop implements StoreAction {
  readonly type = REMOVE_SHOP;

  constructor(public payload: any) {
  }
}

export class SplitShop implements StoreAction {
  readonly type = SPLIT_SHOP;

  constructor(public payload: any) {
  }
}

export class ToggleSpare implements StoreAction {
  readonly type = TOGGLE_SPARE;

  constructor(public payload: any) {
  }
}

export class ChangeRentDetails implements StoreAction {
  readonly type = CHANGE_RENT_DETAILS;

  constructor(public payload: any) {
  }
}

export class SetShop implements StoreAction {
  readonly type = SET_SHOP;

  constructor(public payload: any) {
  }
}

export type Action = ChangeShopsNumber | RemoveShop | SplitShop |
  ToggleSpare | ChangeRentDetails | SetShop;
