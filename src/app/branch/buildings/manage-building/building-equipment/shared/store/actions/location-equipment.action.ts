import {Action as StoreAction} from '@ngrx/store';

export const REQUEST_EQUIPMENT_LIST = '[Building Equipment Location Equipments] REQUEST_EQUIPMENT_LIST';
export const REQUEST_EQUIPMENT_LIST_COMPLETE = '[Building Equipment Location Equipments] REQUEST_EQUIPMENT_LIST_COMPLETE';
export const UPDATE_EQUIPMENT = '[Building Equipment Location Equipments] UPDATE_EQUIPMENT';
export const DELETE_EQUIPMENT = '[Building Equipment Location Equipments] DELETE_EQUIPMENT';
export const ADD_EQUIPMENT = '[Building Equipment Location Equipments] ADD_EQUIPMENT';
export const CLONE_EQUIPMENT_REQUEST = '[Building Equipment Location Equipments] CLONE_EQUIPMENT_REQUEST';
export const UPDATE_ORDER = '[Building Equipment Location Equipments] UPDATE_ORDER';
export const UPDATE_SEARCH_KEY = '[Building Equipment Location Equipments] UPDATE_SEARCH_KEY';
export const UPDATE_SEARCH_KEY_COMPLETE = '[Building Equipment Location Equipments] UPDATE_SEARCH_KEY_COMPLETE';

export const UPDATE_EQUIPMENTS = '[Building Equipment Location Equipments] UPDATE_EQUIPMENTS';

export const UPDATE_SUPPLY_TYPE = '[Building Equipment Location Equipments] UPDATE_SUPPLY_TYPE';
export const UPDATE_UNIT = '[Building Equipment Location Equipments] UPDATE_UNIT';
export const UPDATE_NODE = '[Building Equipment Location Equipments] UPDATE_NODE';
export const UPDATE_PAGE = '[Building Equipment Location Equipments] UPDATE_PAGE';

export const GET_LOCATION = '[Building Equipment Location Equipments] GET_LOCATION';
export const SET_LOCATION = '[Building Equipment Location Equipments] SET_LOCATION';
export const GET_UNITS = '[Building Equipment Location Equipments] GET_UNITS';
export const GET_NODES = '[Building Equipment Location Equipments] GET_NODES';
export const SET_UNITS = '[Building Equipment Location Equipments] SET_UNITS';
export const SET_NODES = '[Building Equipment Location Equipments] SET_NODES';
export const RELOAD_LOCATION_DATA = '[Building Equipment Location Equipments] RELOAD_LOCATION_DATA';


export class GetLocation implements StoreAction {
  readonly type = GET_LOCATION;

  constructor(public payload: any) {
  }
}

export class SetLocation implements StoreAction {
  readonly type = SET_LOCATION;

  constructor(public payload: any) {
  }
}

export class GetUnits implements StoreAction {
  readonly type = GET_UNITS;

  constructor() {
  }
}

export class GetNodes implements StoreAction {
  readonly type = GET_NODES;

  constructor() {
  }
}

export class SetUnits implements StoreAction {
  readonly type = SET_UNITS;

  constructor(public payload: any) {
  }
}

export class SetNodes implements StoreAction {
  readonly type = SET_NODES;

  constructor(public payload: any) {
  }
}

export class RequestEquipmentList implements StoreAction {
  readonly type = REQUEST_EQUIPMENT_LIST;

  constructor() {
  }
}

export class RequestEquipmentListComplete implements StoreAction {
  readonly type = REQUEST_EQUIPMENT_LIST_COMPLETE

  constructor(public payload: any) {
  }
}

export class UpdateEquipment implements StoreAction {
  readonly type = UPDATE_EQUIPMENT;

  constructor(public payload: any) {
  }
}

export class DeleteEquipment implements StoreAction {
  readonly type = DELETE_EQUIPMENT;

  constructor(public payload: any) {
  }
}

export class CloneEquipmentRequest implements StoreAction {
  readonly type = CLONE_EQUIPMENT_REQUEST;

  constructor(public payload: any) {
  }
}

export class UpdateOrder implements StoreAction {
  readonly type = UPDATE_ORDER;

  constructor(public payload: any) {
  }
}

export class UpdateSearchKey implements StoreAction {
  readonly type = UPDATE_SEARCH_KEY;

  constructor(public payload: any) {
  }
}

export class UpdateSearchKeyComplete implements StoreAction {
  readonly type = UPDATE_SEARCH_KEY_COMPLETE;

  constructor(public payload: any) {
  }
}

export class UpdateEquipments implements StoreAction {
  readonly type = UPDATE_EQUIPMENTS;

  constructor(public payload: any) {
  }
}

export class UpdateSupplyType implements StoreAction {
  readonly type = UPDATE_SUPPLY_TYPE;

  constructor(public payload: any) {
  }
}

export class UpdateUnit implements StoreAction {
  readonly type = UPDATE_UNIT;

  constructor(public payload: any) {
  }
}

export class UpdateNode implements StoreAction {
  readonly type = UPDATE_NODE;

  constructor(public payload: any) {
  }
}

export class UpdatePage implements StoreAction {
  readonly type = UPDATE_PAGE;

  constructor(public payload: any) {
  }
}

export class AddEquipment implements StoreAction {
  readonly type = ADD_EQUIPMENT;

  constructor(public payload: any) {
  }
}

export class ReloadLocationData implements StoreAction {
  readonly type = RELOAD_LOCATION_DATA;

  constructor(public payload: { versionId: string } = {versionId: null}) {
  }
}

export type Action = RequestEquipmentList | RequestEquipmentListComplete | UpdateEquipment |
  UpdateEquipments | DeleteEquipment | CloneEquipmentRequest | UpdateOrder | UpdateSearchKey |
  UpdateNode | UpdateSupplyType | UpdateUnit | UpdatePage | AddEquipment | GetLocation |
  SetLocation | GetNodes | GetUnits | SetNodes | SetUnits | ReloadLocationData |
  UpdateSearchKeyComplete;
