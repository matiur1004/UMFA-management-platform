import {Action as StoreAction} from '@ngrx/store';
import {EquipmentViewModel} from '../../../models';

export const GET_EQUIPMENT_TEMPLATES_REQUEST = '[Building Equipment Replace Equipment Step] GET_EQUIPMENT_TEMPLATES';
export const GET_EQUIPMENT_TEMPLATES_REQUEST_COMPLETE =
  '[Building Equipment Replace Equipment Step] GET_EQUIPMENT_TEMPLATES_REQUEST_COMPLETE';

export const EQUIPMENT_TEMPLATE_CHANGED = '[Building Equipment Replace Equipment Step] EQUIPMENT_TEMPLATE_CHANGED';
export const SET_SELECTED_TEMPLATE = '[Building Equipment Replace Equipment Step] SET_SELECTED_TEMPLATE';

export const COMBO_SETTINGS_CHANGE = '[Building Equipment Replace Equipment Step] COMBO_SETTINGS_CHANGE';

export const ADD_REGISTER = '[Building Equipment Replace Equipment Step] ADD_REGISTER';
export const REMOVE_REGISTER = '[Building Equipment Replace Equipment Step] REMOVE_REGISTER';
export const CHANGE_REGISTER_SCALE = '[Building Equipment Replace Equipment Step] CHANGE_REGISTER_SCALE';
export const CHANGE_REGISTER_SEQUENCE = '[Building Equipment Replace Equipment Step] CHANGE_REGISTER_SEQUENCE';
export const UPDATE_ACTUAL_PHOTO = '[Building Equipment Replace Equipment Step] UPDATE_ACTUAL_PHOTO';
export const UPDATE_ATTRIBUTE_PHOTO = '[Building Equipment Replace Equipment Step] UPDATE_ATTRIBUTE_PHOTO';

export const ADD_REGISTER_FILE = '[Building Equipment Replace Equipment Step] ADD_REGISTER_FILE';
export const RESET_EQUIPMENT_STEP = '[Building Equipment Replace Equipment Step] RESET_EQUIPMENT_STEP';

export const GET_METERS_REQUEST = '[Building Equipment Replace Equipment Step] GET_METERS_REQUEST';
export const GET_METERS_REQUEST_COMPLETE = '[Building Equipment Replace Equipment Step] GET_METERS_REQUEST_COMPLETE';

export const CHANGE_PARENT_METER = '[Building Equipment Replace Equipment Step] CHANGE_PARENT_METER';

export const SET_LOCATION = '[Building Equipment Replace Equipment Step] SET_LOCATION';
export const SET_SHOP_IDS = '[Building Equipment Replace Equipment Step] SET_SHOP_IDS';
export const SET_COMMON_AREA_IDS = '[Building Equipment Replace Equipment Step] SET_COMMON_AREA_IDS';

export class GetEquipmentTemplateRequest implements StoreAction {
  readonly type = GET_EQUIPMENT_TEMPLATES_REQUEST;

  constructor() {
  }
}

export class GetEquipmentTemplateRequestComplete implements StoreAction {
  readonly type = GET_EQUIPMENT_TEMPLATES_REQUEST_COMPLETE;

  constructor(public payload: any) {
  }
}

export class SetSelectedTemplate implements StoreAction {
  readonly type = SET_SELECTED_TEMPLATE;

  constructor(public payload: EquipmentViewModel) {
  }
}

export class EquipmentTemplateChanged implements StoreAction {
  readonly type = EQUIPMENT_TEMPLATE_CHANGED;

  constructor(public payload: any) {
  }
}

export class RemoveRegister implements StoreAction {
  readonly type = REMOVE_REGISTER;

  constructor(public payload: any) {
  }
}

export class AddRegister implements StoreAction {
  readonly type = ADD_REGISTER;

  constructor(public payload: any) {
  }
}

export class UpdateActualPhoto implements StoreAction {
  readonly type = UPDATE_ACTUAL_PHOTO;

  constructor(public payload: any) {
  }
}

export class UpdateAttributePhoto implements StoreAction {
  readonly type = UPDATE_ATTRIBUTE_PHOTO;

  constructor(public payload: any) {
  }
}

export class AddRegisterFile implements StoreAction {
  readonly type = ADD_REGISTER_FILE;

  constructor(public payload: any) {
  }
}

export class ResetEquipmentStep implements StoreAction {
  readonly type = RESET_EQUIPMENT_STEP;

  constructor() {
  }
}

export class ComboSettingsChange implements StoreAction {
  readonly type = COMBO_SETTINGS_CHANGE;

  constructor(public payload: any) {
  }
}

export class ChangeRegisterScale implements StoreAction {
  readonly type = CHANGE_REGISTER_SCALE;

  constructor(public payload: any) {
  }
}

export class ChangeRegisterSequence implements StoreAction {
  readonly type = CHANGE_REGISTER_SEQUENCE;

  constructor(public payload: { from: number, to: number }) {
  }
}

export class GetMetersRequest implements StoreAction {
  readonly type = GET_METERS_REQUEST;

  constructor() {
  }
}

export class GetMetersRequestComplete implements StoreAction {
  readonly type = GET_METERS_REQUEST_COMPLETE;

  constructor(public payload: any) {
  }
}

export class ChangeParentMeter implements StoreAction {
  readonly type = CHANGE_PARENT_METER;

  constructor(public payload: any) {
  }
}

export class SetLocation implements StoreAction {
  readonly type = SET_LOCATION;

  constructor(public payload: any) {
  }
}

export class SetShopIds implements StoreAction {
  readonly type = SET_SHOP_IDS;

  constructor(public payload: any) {
  }
}

export class SetCommonAreaIds implements StoreAction {
  readonly type = SET_COMMON_AREA_IDS;

  constructor(public payload: any) {
  }
}

export type Action = GetEquipmentTemplateRequest | GetEquipmentTemplateRequestComplete | EquipmentTemplateChanged
  | RemoveRegister | AddRegister | UpdateActualPhoto | UpdateAttributePhoto | AddRegisterFile
  | ResetEquipmentStep | ComboSettingsChange | ChangeRegisterScale | GetMetersRequest | GetMetersRequestComplete
  | ChangeParentMeter | SetLocation | SetShopIds | SetCommonAreaIds | ChangeRegisterSequence | SetSelectedTemplate;
