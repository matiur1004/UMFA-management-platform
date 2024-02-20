import {Action as StoreAction} from '@ngrx/store';
import {RegisterViewModel} from "@models";
import {ChargeLineItemChargingType} from '../../../shared/models';

// GET
export const GET_CHARGE_DATA = '[Charge] GET_CHARGE_DATA';
export const GET_CHARGE_DATA_SUCCESS = '[Charge] GET_CHARGE_DATA_SUCCESS';

export class GetChargeData implements StoreAction {
  readonly type = GET_CHARGE_DATA;

  constructor(public payload: { buildingId: string, chargeId: string }) {
  }
}

export class GetChargeDataSuccess implements StoreAction {
  readonly type = GET_CHARGE_DATA_SUCCESS;

  constructor(public payload: any) {
  }
}

export const GET_EQUIPMENT_REGISTERS = '[Charge] GET_EQUIPMENT_REGISTERS';
export const GET_EQUIPMENT_REGISTERS_SUCCESS = '[Charge] GET_EQUIPMENT_REGISTERS_SUCCESS';

export class GetEquipmentRegisters implements StoreAction {
  readonly type = GET_EQUIPMENT_REGISTERS;

  constructor(public payload?: boolean) {
  }
}

export class GetEquipmentRegistersSuccess implements StoreAction {
  readonly type = GET_EQUIPMENT_REGISTERS_SUCCESS;

  constructor(public payload: RegisterViewModel[]) {
  }
}

export const DELETE_CHARGE_LINE_ITEM = '[Charge] DELETE_CHARGE_LINE_ITEM';

export class DeleteChargeLineItem implements StoreAction {
  readonly type = DELETE_CHARGE_LINE_ITEM;

  constructor(public payload: { id: string, chargingType: ChargeLineItemChargingType }) {
  }
}

export const UPDATE_TYPE_CHARGE_LINE_ITEM = '[Charge] UPDATE_TYPE_CHARGE_LINE_ITEM';

export class UpdateTypeChargeLineItem implements StoreAction {
  readonly type = UPDATE_TYPE_CHARGE_LINE_ITEM;

  constructor(
    public payload: {
      id: string,
      newChargingType: ChargeLineItemChargingType,
      oldChargingType: ChargeLineItemChargingType
    }) {
  }
}

// UPDATE
export const UPDATE_CHARGE_VERSION = '[Charge] UPDATE_CHARGE_VERSION';
export const UPDATE_CHARGE_VERSION_SUCCESS = '[Charge] UPDATE_CHARGE_VERSION_SUCCESS';

export class UpdateChargeVersion implements StoreAction {
  readonly type = UPDATE_CHARGE_VERSION;

  constructor(public payload: any) {
  }
}

export class UpdateChargeVersionSuccess implements StoreAction {
  readonly type = UPDATE_CHARGE_VERSION_SUCCESS;

  constructor(public payload: any) {
  }
}

export const PURGE_EDIT_CHARGE_VERSION_STORE = '[Charge] PURGE_EDIT_CHARGE_VERSION_STORE';

export class PurgeEditChargeVersionStore implements StoreAction {
  readonly type = PURGE_EDIT_CHARGE_VERSION_STORE;
}

export const SET_CHARGE_VERSION_ID = '[Charge] SET_CHARGE_VERSION_ID';

export class SetChargeVersionId implements StoreAction {
  readonly type = SET_CHARGE_VERSION_ID;

  constructor(public payload: string) {
  }
}

export type EditChargeVersionActions =
  | GetChargeData
  | GetChargeDataSuccess
  | GetEquipmentRegisters
  | GetEquipmentRegistersSuccess
  | DeleteChargeLineItem
  | UpdateTypeChargeLineItem
  | UpdateChargeVersion
  | UpdateChargeVersionSuccess
  | PurgeEditChargeVersionStore
  | SetChargeVersionId;
