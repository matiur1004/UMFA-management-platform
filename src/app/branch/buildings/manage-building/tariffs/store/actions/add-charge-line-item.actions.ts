import {Action as StoreAction} from '@ngrx/store';

export const UPDATE_CHARGING_TYPE = '[Add Charge Line Item] UPDATE_CHARGING_TYPE';
export const RESET_IS_COMPLETE = '[Add Charge Line Item] RESET_IS_COMPLETE';
export const CREATE_LINE_ITEM = '[Add Charge Line Item] CREATE_LINE_ITEM';

export class UpdateChargingType implements StoreAction {
  readonly type = UPDATE_CHARGING_TYPE;

  constructor(public payload: number) {
  }
}

export class ResetIsComplete implements StoreAction {
  readonly type = RESET_IS_COMPLETE;

  constructor() {
  }
}

export class CreateLineItem implements StoreAction {
  readonly type = CREATE_LINE_ITEM;

  constructor(public payload: any) {
  }
}


export type AddChargeLineItemActions =
  | UpdateChargingType
  | ResetIsComplete
  | CreateLineItem;
