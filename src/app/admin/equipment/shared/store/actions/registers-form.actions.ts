import {Action as StoreAction} from '@ngrx/store';
import {TimeOfUse} from "@models";

export const GET_REGISTERS = '[REGISTER Form] GET_REGISTERS';
export const REGISTER_INIT_FOR_EDIT = '[REGISTER Form] REGISTER_INIT_FOR_EDIT';
export const REGISTER_INIT_FOR_CREATE = '[REGISTER Form] REGISTER_INIT_FOR_CREATE';

export const REGISTER_ADD = '[REGISTER Form] REGISTERS_ADD';
export const REGISTER_CREATE = '[REGISTER Form] REGISTER_CREATE';
export const REGISTER_UPDATE = '[REGISTER Form] REGISTER_UPDATE';

export const REGISTER_ADD_SUPPLY_TYPE = '[RGISTER Form] REGISTER_ADD_SUPPLY_TYPE';
export const REGISTER_REMOVE_SUPPLY_TYPE = '[RGISTER Form] REGISTER_REMOVE_SUPPLY_TYPE';

export const REGISTER_EDIT_TOU = '[REGISTER Form] REGISTER_EDIT_TOU';

export class GetRegisters implements StoreAction {
  readonly type = GET_REGISTERS;

  constructor(public payload: any) {
  }
}

export class RegisterInitForCreate implements StoreAction {
  readonly type = REGISTER_INIT_FOR_CREATE;

  constructor() {
  }
}

export class RegisterInitForEdit implements StoreAction {
  readonly type = REGISTER_INIT_FOR_EDIT;

  constructor(public payload: any) {
  }
}

export class RegisterCreate implements StoreAction {
  readonly type = REGISTER_CREATE;

  constructor(public payload: any) {
  }
}

export class RegisterUpdate implements StoreAction {
  readonly type = REGISTER_UPDATE;

  constructor(public payload: any) {
  }
}

export class RegisterAdd implements StoreAction {
  readonly type = REGISTER_ADD;

  constructor() {
  }
}


// #region SupplyTypes
export class RegisterAddSupplyType implements StoreAction {
  readonly type = REGISTER_ADD_SUPPLY_TYPE;

  constructor(public payload: any) {
  }
}

export class RegisterRemoveSupplyType implements StoreAction {
  readonly type = REGISTER_REMOVE_SUPPLY_TYPE;

  constructor(public payload: any) {
  }
}

// #endregion

// #region TOU
export class RegisterEditTou implements StoreAction {
  readonly type = REGISTER_EDIT_TOU;

  constructor(public payload: { timeOfUse: TimeOfUse }) {
  }
}

// #endregion

export type Action = GetRegisters |
  RegisterUpdate |
  RegisterCreate |
  RegisterAdd |
  RegisterInitForEdit |
  RegisterInitForCreate |
  RegisterEditTou |
  RegisterAddSupplyType |
  RegisterRemoveSupplyType;

