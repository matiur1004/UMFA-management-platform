import {Action as StoreAction} from '@ngrx/store';

export const CREATE_NEW_CHARGE = '[Add New Charge] CREATE_NEW_CHARGE';
export const CREATE_NEW_CHARGE_SUCCESS = '[Add New Charge] CREATE_NEW_CHARGE_SUCCESS';

export class CreateNewCharge implements StoreAction {
  readonly type = CREATE_NEW_CHARGE;

  constructor(public payload: any) {
  }
}

export class CreateNewChargeSuccess implements StoreAction {
  readonly type = CREATE_NEW_CHARGE_SUCCESS;

  constructor(public payload: any) {
  }
}


export type AddNewChargeActions =
  | CreateNewCharge
  | CreateNewChargeSuccess;
