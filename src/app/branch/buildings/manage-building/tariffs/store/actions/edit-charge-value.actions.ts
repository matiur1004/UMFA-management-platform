import {Action as StoreAction} from '@ngrx/store';

// GET
export const GET_CHARGE_VALUE_DATA = '[Charge] GET_CHARGE_VALUE_DATA';
export const GET_CHARGE_VALUE_DATA_SUCCESS = '[Charge] GET_CHARGE_VALUE_DATA_SUCCESS';

export class GetChargeValueData implements StoreAction {
  readonly type = GET_CHARGE_VALUE_DATA;

  constructor(public payload: { buildingId: string, chargeId: string, valueId: string }) {
  }
}

export class GetChargeValueDataSuccess implements StoreAction {
  readonly type = GET_CHARGE_VALUE_DATA_SUCCESS;

  constructor(public payload: any) {
  }
}

// UPDATE
export const UPDATE_CHARGE_VALUE = '[Charge] UPDATE_CHARGE_VALUE';
export const UPDATE_CHARGE_VALUE_SUCCESS = '[Charge] UPDATE_CHARGE_VALUE_SUCCESS';

export class UpdateChargeValue implements StoreAction {
  readonly type = UPDATE_CHARGE_VALUE;

  constructor(public payload: any) {
  }
}

export class UpdateChargeValueSuccess implements StoreAction {
  readonly type = UPDATE_CHARGE_VALUE_SUCCESS;

  constructor(public payload: any) {
  }
}

export const PURGE_EDIT_CHARGE_VALUE_STORE = '[Charge] PURGE_EDIT_CHARGE_VALUE_STORE';

export class PurgeEditChargeValueStore implements StoreAction {
  readonly type = PURGE_EDIT_CHARGE_VALUE_STORE;
}

export const SET_CHARGE_VALUE_IDS = '[Charge] SET_CHARGE_VALUE_IDS';

export class SetChargeValueIds implements StoreAction {
  readonly type = SET_CHARGE_VALUE_IDS;

  constructor(public payload: { chargeId: string, valueId: string }) {
  }
}

export type EditChargeValueActions =
  | GetChargeValueData
  | GetChargeValueDataSuccess
  | UpdateChargeValue
  | UpdateChargeValueSuccess
  | PurgeEditChargeValueStore
  | SetChargeValueIds;
