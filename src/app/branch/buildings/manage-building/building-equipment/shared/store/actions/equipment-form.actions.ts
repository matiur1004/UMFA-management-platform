import {
  AssignedVirtualRegister,
  VirtualRegisterType
} from '@app/branch/buildings/manage-building/building-equipment/shared/models';
import {AssignedRegister} from '@models';
import {Action as StoreAction} from '@ngrx/store';

export const UPDATE_EQUIPMENT_COMMON_DATA = '[Building Equipment Form] UPDATE_EQUIPMENT_COMMON_DATA';
export const SET_EQUIPMENT_DETAIL_REGISTERS = '[Building Equipment Form] SET_EQUIPMENT_DETAIL_REGISTERS';

export const SEND_REQUEST_EQUIPMENT = '[Building Equipment Form] SEND_REQUEST_EQUIPMENT';
export const SEND_REQUEST_EQUIPMENT_COMPLETE = '[Building Equipment Form] SEND_REQUEST_EQUIPMENT_COMPLETE';
export const EDIT_EQUIPMENT = '[Building Equipment Form] EDIT_EQUIPMENT';
export const CLEAR_LOCAL_EQUIPMENT = '[Building Equipment Form] CLEAR_LOCAL_EQUIPMENT';
export const REMOVE_REGISTER = '[Building Equipment Form] REMOVE_REGISTER';
export const REMOVE_REGISTER_WITH_TOTAL_ASSIGNMENT = '[Building Equipment Form] REMOVE_REGISTER_WITH_TOTAL_ASSIGNMENT';
export const ADD_REGISTER = '[Building Equipment Form] ADD_REGISTER';
export const CHANGE_REGISTER_SCALE = '[Building Equipment Form] CHANGE_REGISTER_SCALE';
export const CHANGE_REGISTER_SEQUENCE = '[Building Equipment Form] CHANGE_REGISTER_SEQUENCE';
export const TOGGLE_TECHNOLOGY_ATTRIBUTE = '[Building Equipment Form] TOGGLE_TECHNOLOGY_ATTRIBUTE';

export const ADD_VIRTUAL_REGISTER = '[Building Equipment Form] ADD_VIRTUAL_REGISTER';
export const CHANGE_VIRTUAL_REGISTER_SEQUENCE = '[Building Equipment Form] CHANGE_VIRTUAL_REGISTER_SEQUENCE';
export const REMOVE_VIRTUAL_REGISTER = '[Building Equipment Form] REMOVE_VIRTUAL_REGISTER';
export const REMOVE_ASSIGNED_REGISTER = '[Building Equipment Form] REMOVE_ASSIGNED_REGISTER';
export const ADD_ASSIGNED_REGISTER_TO_VR = '[Building Equipment Form] ADD_ASSIGNED_REGISTER_TO_VR';
export const EXPAND_VIRTUAL_REGISTER = '[Building Equipment Form] EXPAND_VIRTUAL_REGISTER';
export const TARGET_METER_REGISTER = '[Building Equipment Form] TARGET_METER_REGISTER';


export const UPDATE_ACTUAL_PHOTO = '[Building Equipment Form] UPDATE_ACTUAL_PHOTO';
export const UPDATE_ATTRIBUTE_PHOTO = '[Building Equipment Form] UPDATE_ATTRIBUTE_PHOTO';

export const COMBO_SETTINGS_CHANGE = '[Building Equipment Form] COMBO_SETTINGS_CHANGE';

export const GET_LOCATIONS_REQUEST = '[Building Equipment Form ] GET_LOCATIONS_REQUEST';
export const GET_LOCATIONS_REQUEST_COMPLETE = '[Building Equipment Form] GET_LOCATIONS_REQUEST_COMPLETE';
export const GET_SUPPLIES_REQUEST = '[Building Equipment Form] GET_SUPPLIES_REQUEST';
export const GET_SUPPLIES_REQUEST_COMPLETE = '[Building Equipment Form] GET_SUPPLIES_REQUEST_COMPLETE';
export const GET_SHOPS_REQUEST = '[Building Equipment Form ] GET_SHOPS_REQUEST';
export const GET_SHOPS_REQUEST_COMPLETE = '[Building Equipment Form ] GET_SHOPS_REQUEST_COMPLETE';
export const GET_COMMON_AREAS_REQUEST = '[Building Equipment Form ] GET_COMMON_AREAS_REQUEST';
export const GET_COMMON_AREAS_REQUEST_SUCCESS = '[Building Equipment Form ] GET_COMMON_AREAS_REQUEST_SUCCESS';
export const GET_EQUIPMENT_TEMPLATE_REQUEST = '[Building Equipment Form] GET_EQUIPMENT_TEMPLATE_REQUEST';
export const GET_EQUIPMENT_TEMPLATE_REQUEST_COMPLETE = '[Building Equipment Form] GET_EQUIPMENT_TEMPLATE_REQUEST_COMPLETE';
export const GET_EQUIPMENT_TEMPLATES_REQUEST = '[Building Equipment Form] GET_EQUIPMENT_TEMPLATES_REQUEST';
export const GET_EQUIPMENT_TEMPLATES_REQUEST_COMPLETE = '[Building Equipment Form] GET_EQUIPMENT_TEMPLATES_REQUEST_COMPLETE';

export const GET_METERS_REQUEST = '[Building Equipment Form] GET_METERS_REQUEST';
export const GET_METERS_REQUEST_COMPLETE = '[Building Equipment Form] GET_METERS_REQUEST_COMPLETE';
export const CHANGE_PARENT_METER = '[Building Equipment Form] CHANGE_PARENT_METER';

export const CONNECT_TO_AMR_REQUEST = '[Building Equipment Form] CONNECT_TO_AMR_REQUEST';
export const CONNECT_TO_AMR_REQUEST_COMPLETE = '[Building Equipment Form] CONNECT_TO_AMR_REQUEST_COMPLETE';
export const GET_READINGS_FROM_AMR_REQUEST = '[Building Equipment Form] GET_READINGS_FROM_AMR_REQUEST';
export const GET_READINGS_FROM_AMR_REQUEST_COMPLETE = '[Building Equipment Form] GET_READINGS_FROM_AMR_REQUEST_COMPLETE';

export const TOGGLE_BREAKER_REQUEST = '[Building Equipment Form] TOGGLE_BREAKER_REQUEST';
export const TOGGLE_BREAKER_REQUEST_COMPLETE = '[Building Equipment Form] TOGGLE_BREAKER_REQUEST_COMPLETE';

export class UpdateEquipmentCommonData implements StoreAction {
  readonly type = UPDATE_EQUIPMENT_COMMON_DATA;

  constructor() {
  }
}

export class SetEquipmentDetailRegisters implements StoreAction {
  readonly type = SET_EQUIPMENT_DETAIL_REGISTERS;

  constructor(public payload: any) {
  }
}


export class SendRequestEquipment implements StoreAction {
  readonly type = SEND_REQUEST_EQUIPMENT;

  constructor(public payload: any) {
  }
}

export class SendRequestEquipmentComplete implements StoreAction {
  readonly type = SEND_REQUEST_EQUIPMENT_COMPLETE;
}

export class EditEquipment implements StoreAction {
  readonly type = EDIT_EQUIPMENT;

  constructor(public payload: any) {
  }
}

export class ClearLocalEquipment implements StoreAction {
  readonly type = CLEAR_LOCAL_EQUIPMENT;
}

export class GetLocationsRequest implements StoreAction {
  readonly type = GET_LOCATIONS_REQUEST;

  constructor() {
  }
}

export class GetLocationsRequestComplete implements StoreAction {
  readonly type = GET_LOCATIONS_REQUEST_COMPLETE;

  constructor(public payload: any) {
  }
}

export class GetSuppliesRequest implements StoreAction {
  readonly type = GET_SUPPLIES_REQUEST;

  constructor() {
  }
}

export class GetSuppliesRequestComplete implements StoreAction {
  readonly type = GET_SUPPLIES_REQUEST_COMPLETE;

  constructor(public payload: any) {
  }
}

export class ExpandVirtualRegister implements StoreAction {
  readonly type = EXPAND_VIRTUAL_REGISTER;

  constructor(public payload: string) {
  }
}

export class GetShopsRequest implements StoreAction {
  readonly type = GET_SHOPS_REQUEST;

  constructor() {
  }
}

export class GetShopsRequestComplete implements StoreAction {
  readonly type = GET_SHOPS_REQUEST_COMPLETE;

  constructor(public payload: any) {
  }
}

export class GetCommonAreasRequest implements StoreAction {
  readonly type = GET_COMMON_AREAS_REQUEST;

  constructor() {
  }
}

export class GetCommonAreasRequestSuccess implements StoreAction {
  readonly type = GET_COMMON_AREAS_REQUEST_SUCCESS;

  constructor(public payload: any) {
  }
}

export class GetEquipmentTemplateRequest implements StoreAction {
  readonly type = GET_EQUIPMENT_TEMPLATE_REQUEST;

  constructor(public payload: any) {
  }
}

export class GetEquipmentTemplateRequestComplete implements StoreAction {
  readonly type = GET_EQUIPMENT_TEMPLATE_REQUEST_COMPLETE;

  constructor(public payload: any) {
  }
}

export class RemoveRegister implements StoreAction {
  readonly type = REMOVE_REGISTER;

  constructor(public payload: any) {
  }
}

export class RemoveRegisterWithTotalAssignment implements StoreAction {
  readonly type = REMOVE_REGISTER_WITH_TOTAL_ASSIGNMENT;

  constructor(public payload: any) {
  }
}

export class TargetMeterRegister implements StoreAction {
  readonly type = TARGET_METER_REGISTER;

  constructor(public payload: { id: string, vrId: string }) {
  }
}

export class AddRegister implements StoreAction {
  readonly type = ADD_REGISTER;

  constructor(public payload: any) {
  }
}

export class AddVirtualRegister implements StoreAction {
  readonly type = ADD_VIRTUAL_REGISTER;

  constructor(public payload: AssignedVirtualRegister) {
  }
}

export class RemoveVirtualRegister implements StoreAction {
  readonly type = REMOVE_VIRTUAL_REGISTER;

  constructor(public payload: string) {
  }
}

export class RemoveAssignedRegister implements StoreAction {
  readonly type = REMOVE_ASSIGNED_REGISTER;

  constructor(public payload: { vrId: string, assignedMeterId: string, type: VirtualRegisterType }) {
  }
}

export class AddAssignedRegisterToVR implements StoreAction {
  readonly type = ADD_ASSIGNED_REGISTER_TO_VR;

  constructor(public payload: { vrId: string, type: VirtualRegisterType, register: AssignedRegister }) {
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

export class ComboSettingsChange implements StoreAction {
  readonly type = COMBO_SETTINGS_CHANGE;

  constructor(public payload: any) {
  }
}

export class GetEquipmentTemplatesRequest implements StoreAction {
  readonly type = GET_EQUIPMENT_TEMPLATES_REQUEST;

  constructor(public payload: any) {
  }
}

export class GetEquipmentTemplatesRequestComplete implements StoreAction {
  readonly type = GET_EQUIPMENT_TEMPLATES_REQUEST_COMPLETE;

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

export class ChangeVirtualRegisterSequence implements StoreAction {
  readonly type = CHANGE_VIRTUAL_REGISTER_SEQUENCE;

  constructor(public payload: { from: number, to: number }) {
  }
}

export class ConnectToAmrSystemRequest implements StoreAction {
  readonly type = CONNECT_TO_AMR_REQUEST;

  constructor(public payload: any) {
  }
}

export class ConnectToAmrSystemRequestComplete implements StoreAction {
  readonly type = CONNECT_TO_AMR_REQUEST_COMPLETE;

  constructor() {
  }
}

export class GetReadingsFromAmrSystemRequest implements StoreAction {
  readonly type = GET_READINGS_FROM_AMR_REQUEST;

  constructor(public payload: string) {
  }
}

export class GetReadingsFromAmrSystemRequestComplete implements StoreAction {
  readonly type = GET_READINGS_FROM_AMR_REQUEST_COMPLETE;

  constructor() {
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

export class ToggleTechnologyAttribute implements StoreAction {
  readonly type = TOGGLE_TECHNOLOGY_ATTRIBUTE;

  constructor() {
  }
}

export class ToggleBreakerRequest implements StoreAction {
  readonly type = TOGGLE_BREAKER_REQUEST;

  constructor(public payload: any) {
  }
}

export class ToggleBreakerRequestComplete implements StoreAction {
  readonly type = TOGGLE_BREAKER_REQUEST_COMPLETE;

  constructor(public payload: any) {
  }
}

export type Action = SendRequestEquipment
  | SendRequestEquipmentComplete
  | EditEquipment
  | ClearLocalEquipment
  | ToggleTechnologyAttribute
  | GetLocationsRequest
  | GetLocationsRequestComplete
  | GetShopsRequest
  | GetShopsRequestComplete
  | GetCommonAreasRequest
  | GetCommonAreasRequestSuccess
  | GetSuppliesRequest
  | GetSuppliesRequestComplete
  | GetEquipmentTemplateRequest
  | GetEquipmentTemplateRequestComplete
  | RemoveRegister
  | RemoveRegisterWithTotalAssignment
  | AddRegister
  | UpdateActualPhoto
  | UpdateAttributePhoto
  | GetEquipmentTemplatesRequest
  | GetEquipmentTemplatesRequestComplete
  | ComboSettingsChange
  | ChangeRegisterScale
  | ConnectToAmrSystemRequest
  | ConnectToAmrSystemRequestComplete
  | GetReadingsFromAmrSystemRequest
  | GetReadingsFromAmrSystemRequestComplete
  | GetMetersRequest
  | TargetMeterRegister
  | GetMetersRequestComplete
  | ChangeParentMeter
  | ToggleBreakerRequest
  | ToggleBreakerRequestComplete
  | ChangeRegisterSequence
  | AddVirtualRegister
  | RemoveVirtualRegister
  | ChangeVirtualRegisterSequence
  | ExpandVirtualRegister
  | RemoveAssignedRegister
  | AddAssignedRegisterToVR
  | UpdateEquipmentCommonData
  | SetEquipmentDetailRegisters;
