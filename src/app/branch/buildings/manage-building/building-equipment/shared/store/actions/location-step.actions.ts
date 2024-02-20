import {Action as StoreAction} from '@ngrx/store';

export const GET_LOCATIONS_REQUEST = '[Building Equipment Location Step] GET_LOCATIONS_REQUEST';
export const GET_LOCATIONS_REQUEST_COMPLETE = '[Building Equipment Location Step] GET_LOCATIONS_REQUEST_COMPLETE';
export const GET_SUPPLIES_REQUEST = '[Building Equipment Location Step] GET_SUPPLIES_REQUEST';
export const GET_SUPPLIES_REQUEST_COMPLETE = '[Building Equipment Location Step] GET_SUPPLIES_REQUEST_COMPLETE';
export const GET_TECHNICIANS_REQUEST = '[Building Equipment Location Step] GET_TECHNICIANS_REQUEST';
export const GET_TECHNICIANS_REQUEST_COMPLETE = '[Building Equipment Location Step] GET_TECHNICIANS_REQUEST_COMPLETE';

export const LOCATION_CHANGED = '[Building Equipment Location Step] LOCATION_CHANGED';
export const SUPPLIE_CHANGED = '[Building Equipment Location Step] SUPPLIE_CHANGED';
export const LOCATION_TYPE_CHANGED = '[Building Equipment Location Step] LOCATION_TYPE_CHANGED';
export const TECHNICIAN_CHANGED = '[Building Equipment Location Step] TECHNICIAN_CHANGED';

export const SET_LOCATION_DATA = '[Building Equipment Location Step] SET_LOCATION_DATA';
export const SET_LOCATION_DATA_FOR_EQUIPMENT = '[Building Equipment Location Step] SET_LOCATION_DATA_FOR_EQUIPMENT';


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

export class LocationChanged implements StoreAction {
  readonly type = LOCATION_CHANGED;

  constructor(public payload: any) {
  }
}

export class SupplieChanged implements StoreAction {
  readonly type = SUPPLIE_CHANGED;

  constructor(public payload: any) {
  }
}

export class LocationTypeChanged implements StoreAction {
  readonly type = LOCATION_TYPE_CHANGED;

  constructor(public payload: any) {
  }
}

export class TechnicianChanged implements StoreAction {
  readonly type = TECHNICIAN_CHANGED;

  constructor(public payload: any) {
  }
}

export class GetTechniciansRequest implements StoreAction {
  readonly type = GET_TECHNICIANS_REQUEST;

  constructor() {
  }
}

export class GetTechniciansRequestComplete implements StoreAction {
  readonly type = GET_TECHNICIANS_REQUEST_COMPLETE;

  constructor(public payload: any) {
  }
}


export class SetLocationData implements StoreAction {
  readonly type = SET_LOCATION_DATA;

  constructor() {
  }
}

export class SetLocationDataForEquipment implements StoreAction {
  readonly type = SET_LOCATION_DATA_FOR_EQUIPMENT;

  constructor() {
  }
}

export type Action = GetLocationsRequest | GetLocationsRequestComplete | LocationChanged
  | GetSuppliesRequest | GetSuppliesRequestComplete | SupplieChanged | LocationTypeChanged | TechnicianChanged
  | GetTechniciansRequest | GetTechniciansRequestComplete | SetLocationData | SetLocationDataForEquipment;
