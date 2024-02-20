import {Action as StoreAction} from '@ngrx/store';
import {BuildingPeriodViewModel} from '../../models/building-period.model';
import {HistoryViewModel, UnitOfMeasurement} from '@models';

export const BUILDING_ID_GUARD_UPDATE_BUILDING_ID = '[Building Common Data] BUILDING_ID_GUARD_UPDATE_BUILDING_ID';
export const GET_ACTIVE_BUILDING_PERIOD = '[Building Common Data] GET_ACTIVE_BUILDING_PERIOD';

export const GET_HISTORY_REQUEST_WITH_VERSION_ID = '[Building Common Data] GET_HISTORY_REQUEST_WITH_VERSION_ID';
export const LOAD_ACTIVE_BUILDING_PERIOD_COMPLETE = '[Building Common Data] LOAD_ACTIVE_BUILDING_PERIOD_COMPLETE';
export const LOAD_BUILDING_HISTORY_COMPLETE = '[Building Common Data] LOAD_BUILDING_HISTORY_COMPLETE';
export const LOAD_BUILDING_HISTORY_FAILED = '[Building Common Data] LOAD_BUILDING_HISTORY_FAILED';
export const HISTORY_CHANGE = '[Building Common Data] HISTORY_CHANGE';

export const DISABLE_CHANGING_VERSION = '[Building Common Data] DISABLE_CHANGING_VERSION';
export const SET_EQUIPMENT_ATTRIBUTES = '[Building Common Data] SET_EQUIPMENT_ATTRIBUTES';
export const SET_EQUIPMENT_REGISTERS = '[Building Common Data] SET_EQUIPMENT_REGISTERS';
export const SET_UNITS_OF_MEASUREMENT = '[Building Common Data] SET_UNITS_OF_MEASUREMENT';
export const NAVIGATE_AFTER_SAVE_ACTION = '[Building Common Data] NAVIGATE_AFTER_SAVE_ACTION';
export const SET_NAVIGATION_URL = '[Building Common Data] SET_NAVIGATION_URL';
export const SET_IS_FINALIZED = '[Building Common Data] SET_IS_FINALIZED';
export const UPDATE_URL_VERSION_ACTION = '[Building Common Data] UPDATE_URL_VERSION_ACTION';
export const CREATE_ITEM_UPDATE_URL_VERSION_ACTION = '[Building Common Data] CREATE_ITEM_UPDATE_URL_VERSION_ACTION';


export class LoadActiveBuildingPeriodComplete implements StoreAction {
  readonly type = LOAD_ACTIVE_BUILDING_PERIOD_COMPLETE;

  constructor(public payload: { activeBuildingPeriod: BuildingPeriodViewModel }) {
  }
}

export class GetActiveBuildingPeriod implements StoreAction {
  readonly type = GET_ACTIVE_BUILDING_PERIOD;

  constructor(public payload: { buildingId: string }) {
  }
}

export class BuildingIdGuardChangeBuildingId implements StoreAction {
  readonly type = BUILDING_ID_GUARD_UPDATE_BUILDING_ID;

  constructor(public payload: { buildingId: string }) {
  }
}

export class SetNavigationUrl implements StoreAction {
  readonly type = SET_NAVIGATION_URL;

  constructor(public payload: string) {
  }
}

export class SetIsFinalized implements StoreAction {
  readonly type = SET_IS_FINALIZED;

  constructor(public payload: boolean) {
  }
}

export class NavigateAfterSaveActionComplete implements StoreAction {
  readonly type = NAVIGATE_AFTER_SAVE_ACTION;

  constructor() {
  }
}

export class LoadBuildingHistoryComplete implements StoreAction {
  readonly type = LOAD_BUILDING_HISTORY_COMPLETE;

  constructor(public payload: {
    logs: HistoryViewModel[],
    isComplete: boolean,
    buildingId: string,
    versionId: string
  }) {
  }
}


export class LoadBuildingHistoryFailed implements StoreAction {
  readonly type = LOAD_BUILDING_HISTORY_FAILED;

  constructor() {
  }
}

export class HistoryChange implements StoreAction {
  readonly type = HISTORY_CHANGE;

  /**
   * Update current selected version in the store
   */
  constructor(public payload: any) {
  }
}

export class DisableChangingVersion implements StoreAction {
  readonly type = DISABLE_CHANGING_VERSION;

  constructor(public payload: boolean) {
  }
}

export class GetHistoryWithVersionId implements StoreAction {
  readonly type = GET_HISTORY_REQUEST_WITH_VERSION_ID;

  constructor(public payload: string) {
  }
}

export class SetEquipmentAttributes implements StoreAction {
  readonly type = SET_EQUIPMENT_ATTRIBUTES;

  constructor(public payload: any) {
  }
}


export class SetUnitsOfMeasurement implements StoreAction {
  readonly type = SET_UNITS_OF_MEASUREMENT;

  constructor(public payload: UnitOfMeasurement[]) {
  }
}

export class SetEquipmentRegisters implements StoreAction {
  readonly type = SET_EQUIPMENT_REGISTERS;

  constructor(public payload: any) {
  }
}

export class UpdateUrlVersionAction implements StoreAction {
  readonly type = UPDATE_URL_VERSION_ACTION;

  constructor(public payload: string | Date) {
  }
}

export class CreateItemUpdateUrlVersionAction implements StoreAction {
  readonly type = CREATE_ITEM_UPDATE_URL_VERSION_ACTION;

  constructor(public payload: { versionDate: string | Date, itemId: string }) {
  }
}

export type Action = BuildingIdGuardChangeBuildingId
  | SetNavigationUrl
  | NavigateAfterSaveActionComplete
  | LoadBuildingHistoryComplete
  | LoadBuildingHistoryFailed
  | HistoryChange
  | DisableChangingVersion
  | GetHistoryWithVersionId
  | SetEquipmentAttributes
  | SetEquipmentRegisters
  | UpdateUrlVersionAction
  | CreateItemUpdateUrlVersionAction
  | LoadActiveBuildingPeriodComplete
  | SetUnitsOfMeasurement
  | SetIsFinalized;


