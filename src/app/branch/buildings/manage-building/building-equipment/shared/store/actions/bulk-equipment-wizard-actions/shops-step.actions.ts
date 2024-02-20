import {Action as StoreAction} from '@ngrx/store';
import {FilterAttribute} from '@app/branch/buildings/manage-building/building-equipment/shared/models/search-filter.model';

export const LOCATION_CHANGED = '[Building Bulk Equipment Shops Step] LOCATION_CHANGED';
export const SUPPLY_TO_CHANGED = '[Building Bulk Equipment Shops Step] SUPPLY_TO_CHANGED';
export const LOCATION_TYPE_CHANGED = '[Building Bulk Equipment Shops Step] LOCATION_TYPE_CHANGED';
export const UNIT_CHNAGED = '[Building Bulk Equipment Shops Step] UNIT_CHNAGED';
export const SERIAL_NUMBER_CHANGED = '[Building Bulk Equipment Setup Step] SERIAL_NUMBER_CHANGED';
export const PARENT_CHANGED = '[Building Bulk Equipment Setup Step] PARENT_CHANGED';

export const SET_DROPDOWN_DATA = '[Building Bulk Equipment Shops Step] SET_DROPDOWN_DATA';

export const SELECT_ALL_METERS = '[Building Bulk Equipment Shops Step] SELECT_ALL_METERS';

export const INIT_SHOPS_AND_COMMON_AREAS = '[Building Bulk Equipment Shops Step] INIT_SHOPS_AND_COMMON_AREAS';
export const SET_SHOPS = '[Building Bulk Equipment Shops Step] SET_SHOPS';
export const FILTER_SHOPS = '[Building Bulk Equipment Shops Step] FILTER_SHOPS';
export const SET_COMMON_AREAS = '[Building Bulk Equipment Shops Step] SET_COMMON_AREAS';

export const APPLY_BULK_VALUE = '[Building Bulk Equipment Shops Step] APPLY_BULK_VALUE';

export const UPDATE_LOCATION_METERS = '[Building Bulk Equipment Shops Step] UPDATE_LOCATION_METERS';
export const UPDATE_ORDER_METERS = '[Building Bulk Equipment Shops Step] UPDATE_ORDER_METERS';


export class LocationChanged implements StoreAction {
  readonly type = LOCATION_CHANGED;

  constructor(public payload: any) {
  }
}

export class SupplyToChanged implements StoreAction {
  readonly type = SUPPLY_TO_CHANGED;

  constructor(public payload: any) {
  }
}

export class FilterShops implements StoreAction {
  readonly type = FILTER_SHOPS;

  constructor(public payload: FilterAttribute) {
  }
}

export class LocationTypeChanged implements StoreAction {
  readonly type = LOCATION_TYPE_CHANGED;

  constructor(public payload: any) {
  }
}

export class SerialNumberChanged implements StoreAction {
  readonly type = SERIAL_NUMBER_CHANGED;

  constructor(public payload) {
  }
}

export class UnitChanged implements StoreAction {
  readonly type = UNIT_CHNAGED;

  constructor(public payload: any) {
  }
}

export class ParentChanged implements StoreAction {
  readonly type = PARENT_CHANGED;

  constructor(public payload: any) {
  }
}

export class SetDropdownData implements StoreAction {
  readonly type = SET_DROPDOWN_DATA;

  constructor(public payload: any) {
  }
}

export class SelectAllMeters implements StoreAction {
  readonly type = SELECT_ALL_METERS;

  constructor(public payload: any) {
  }
}

export class InitShopsAndCommonAreas implements StoreAction {
  readonly type = INIT_SHOPS_AND_COMMON_AREAS;

  constructor() {
  }
}

export class SetShops implements StoreAction {
  readonly type = SET_SHOPS;

  constructor(public payload: any) {
  }
}

export class SetCommonAreas implements StoreAction {
  readonly type = SET_COMMON_AREAS;

  constructor(public payload: any) {
  }
}

export class ApplyBulkValue implements StoreAction {
  readonly type = APPLY_BULK_VALUE;

  constructor(public payload: any) {
  }
}

export class UpdateLocationMeters implements StoreAction {
  readonly type = UPDATE_LOCATION_METERS;

  constructor(public payload: any) {
  }
}

export class UpdateOrderMeters implements StoreAction {
  readonly type = UPDATE_ORDER_METERS;

  constructor(public payload: any) {
  }
}


export type Action = LocationChanged | SupplyToChanged | LocationTypeChanged |
  SetDropdownData | SelectAllMeters | SetShops | SetCommonAreas | FilterShops |
  ApplyBulkValue | InitShopsAndCommonAreas | UpdateLocationMeters | SerialNumberChanged | ParentChanged | UpdateOrderMeters;
