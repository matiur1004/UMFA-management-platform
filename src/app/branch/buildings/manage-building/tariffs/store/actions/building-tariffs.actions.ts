import {Action as StoreAction} from '@ngrx/store';
import {EquipmentAttributeViewModel, RegisterViewModel} from '@models';

// GET Attributes
export const API_GET_EQUIPMENT_ATTRIBUTES = '[Building Tariffs] API_GET_EQUIPMENT_ATTRIBUTES';
export const API_GET_EQUIPMENT_ATTRIBUTES_SUCCEEDED = '[Building Tariffs] API_GET_EQUIPMENT_ATTRIBUTES_SUCCEEDED';

export class ApiGetEquipmentAttributes implements StoreAction {
  readonly type = API_GET_EQUIPMENT_ATTRIBUTES;

  constructor(public payload?: boolean) {
  }
}

export class ApiGetEquipmentAttributesSucceeded implements StoreAction {
  readonly type = API_GET_EQUIPMENT_ATTRIBUTES_SUCCEEDED;

  constructor(public payload: EquipmentAttributeViewModel[]) {
  }
}

// Get Equipment Register
export const API_EQUIPMENT_GET_REGISTERS = '[Building Tariffs] API_EQUIPMENT_GET_REGISTERS';
export const API_EQUIPMENT_GET_REGISTERS_SUCCESS = '[Building Tariffs] API_EQUIPMENT_GET_REGISTERS_SUCCESS';

export class ApiEquipmentGetRegisters implements StoreAction {
  readonly type = API_EQUIPMENT_GET_REGISTERS;

  constructor(public payload?: boolean) {
  }
}

export class ApiEquipmentGetRegistersSuccess implements StoreAction {
  readonly type = API_EQUIPMENT_GET_REGISTERS_SUCCESS;

  constructor(public payload: RegisterViewModel[]) {
  }
}

export const UPDATE_BUILDING_ID = '[Building Tariffs] UPDATE_BUILDING_ID';

export class UpdateBuildingId implements StoreAction {
  readonly type = UPDATE_BUILDING_ID;

  constructor(public payload: { buildingId: string }) {
  }
}

export const API_BUILDING_TARIFF_SETTINGS_REQUEST_SUCCEEDED = '[Building Tariff Settings] API_BUILDING_TARIFF_SETTINGS_REQUEST_SUCCEEDED';

export class ApiTariffSettingsRequestSucceeded implements StoreAction {
  readonly type = API_BUILDING_TARIFF_SETTINGS_REQUEST_SUCCEEDED;

  constructor(public payload: any) {
  }
}

export const API_TARIFF_DETAILS_REQUEST_SUCCEEDED = '[Building Tariff Settings] API_TARIFF_DETAILS_REQUEST_SUCCEEDED';

export class ApiTariffDetailsRequestSucceeded implements StoreAction {
  readonly type = API_TARIFF_DETAILS_REQUEST_SUCCEEDED;

  constructor(public payload: any) {
  }
}

export type Action =
  ApiGetEquipmentAttributes
  | ApiGetEquipmentAttributesSucceeded
  | ApiEquipmentGetRegisters
  | ApiEquipmentGetRegistersSuccess
  | UpdateBuildingId
  | ApiTariffSettingsRequestSucceeded
  | ApiTariffDetailsRequestSucceeded;
