import {Action as StoreAction} from '@ngrx/store';

export const UPDATE_SUPPLY_TYPE_FOR_EDIT = '[Tariff Form] UPDATE_SUPPLY_TYPE_FOR_EDIT';
export const UPDATE_LINE_ITEM_CHARGING_TYPE = '[Tariff Form] UPDATE_LINE_ITEM_CHARGING_TYPE';
export const UPDATE_DEPENDENT_LINE_ITEMS = '[Tariff Form] UPDATE_DEPENDENT_LINE_ITEMS';
export const DELETE_LINE_ITEM = '[Tariff Form] DELETE_LINE_ITEM';
export const UPDATE_UNIT_OF_MEASUREMENT = '[Tariff Form] UPDATE_UNIT_OF_MEASUREMENT';
export const RESET_COST_PROVIDE_ID = '[Tariff Form] RESET_COST_PROVIDE_ID';
export const UPDATE_ATTRIBUTE = '[Tariff Form] UPDATE_ATTRIBUTE';
export const TOGGLE_BUILDING_CATEGORY = '[Tariff Form] TOGGLE_BUILDING_CATEGORY';
export const CREATE_LINE_ITEM = '[Tariff Form] CREATE_LINE_ITEM';
export const UPDATE_DISABLE_AFTER = '[Tariff Form] UPDATE_DISABLE_AFTER';

export class UpdateSupplyTypeForEdit implements StoreAction {
  readonly type = UPDATE_SUPPLY_TYPE_FOR_EDIT;

  constructor(public payload: any) {
  }
}

export class UpdateLineItemChargingType implements StoreAction {
  readonly type = UPDATE_LINE_ITEM_CHARGING_TYPE;

  constructor(public payload: any) {
  }
}

export class DeleteLineItem implements StoreAction {
  readonly type = DELETE_LINE_ITEM;

  constructor(public payload: any) {
  }
}

export class UpdateDependentLineItems implements StoreAction {
  readonly type = UPDATE_DEPENDENT_LINE_ITEMS;

  constructor(public payload: { lineItemControlId: string, dependentLineItemIds: string[] }) {
  }
}

export class UpdateUnitOfMeasurement implements StoreAction {
  readonly type = UPDATE_UNIT_OF_MEASUREMENT;

  constructor(public payload: any) {
  }
}

export class ResetCostProvideId implements StoreAction {
  readonly type = RESET_COST_PROVIDE_ID;

  constructor(public payload: any) {
  }
}

export class UpdateAttribute implements StoreAction {
  readonly type = UPDATE_ATTRIBUTE;

  constructor(public payload: any) {
  }
}

export class ToggleBuildingCategory implements StoreAction {
  readonly type = TOGGLE_BUILDING_CATEGORY;

  constructor(public payload: { categoryId: string }) {
  }
}

export class CreateLineItem implements StoreAction {
  readonly type = CREATE_LINE_ITEM;

  constructor(public payload: any) {
  }
}

export class UpdateDisableAfter implements StoreAction {
  readonly type = UPDATE_DISABLE_AFTER;

  constructor(public payload: any) {
  }
}

export type Action = CreateLineItem | ToggleBuildingCategory |
  UpdateSupplyTypeForEdit | DeleteLineItem |
  UpdateUnitOfMeasurement | UpdateAttribute | ResetCostProvideId |
  UpdateLineItemChargingType | UpdateDependentLineItems |
  UpdateSupplyTypeForEdit | UpdateDisableAfter;
