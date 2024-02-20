import {Action as StoreAction} from '@ngrx/store';

export const CREATE_NEW_CHARGE_VALUE = '[Add New Charge Value] CREATE_NEW_CHARGE_VALUE';
export const CREATE_NEW_CHARGE_VALUE_SUCCESS = '[Add New Charge Value] CREATE_NEW_CHARGE_VALUE_SUCCESS';

export class CreateNewChargeValue implements StoreAction {
  readonly type = CREATE_NEW_CHARGE_VALUE;

  constructor(public payload: any) {
  }
}

export class CreateNewChargeValueSuccess implements StoreAction {
  readonly type = CREATE_NEW_CHARGE_VALUE_SUCCESS;

  constructor(public payload: any) {
  }
}

export const CREATE_NEW_CHARGE_VALUE_INIT = '[Add New Charge Value] CREATE_NEW_CHARGE_VALUE_INIT';

export class CreateNewChargeValueInit implements StoreAction {
  readonly type = CREATE_NEW_CHARGE_VALUE_INIT;

  constructor(public payload: any) {
  }
}

export const CREATE_NEW_CHARGE_VALUE_INCREASE_CHANGED = '[Add New Charge Value] CREATE_NEW_CHARGE_VALUE_INCREASE_CHANGED';

export class CreateNewChargeValueIncreaseChanged implements StoreAction {
  readonly type = CREATE_NEW_CHARGE_VALUE_INCREASE_CHANGED;
}


export type AddNewChargeValueActions =
  | CreateNewChargeValue
  | CreateNewChargeValueSuccess
  | CreateNewChargeValueInit
  | CreateNewChargeValueIncreaseChanged;
