import {Action as StoreAction} from '@ngrx/store';

export const SET_PAGE_SIZE = '[Building Periods] SET_PAGE_SIZE';
export const SET_PAGE = '[Building Periods] SET_PAGE';
export const SET_SEARCH_FILTER = '[Building Periods] SET_SEARCH_FILTER';
export const GET_BUILDING_PERIODS = '[Building Periods] GET_BUILDING_PERIODS';
export const ROLLBACK_BUILDING_PERIOD = '[Building Periods] ROLLBACK_BUILDING_PERIOD';
export const BUILDING_PERIODS_LOADED = '[Building Periods] BUILDING_PERIODS_LOADED';
export const BUILDING_PERIOD_ROLLBACK_FINISHED = '[Building Periods] BUILDING_PERIOD_ROLLBACK_FINISHED';
export const BUILDING_PERIOD_REFERENCES_LOADED = '[Building Periods] BUILDING_PERIOD_REFERENCES_LOADED';
export const SET_EDIT_DIALOG_MODE = '[Building Periods] SET_EDIT_DIALOG_MODE';

export class SetPageSize implements StoreAction {
  readonly type = SET_PAGE_SIZE;

  constructor(public payload: number) {
  }
}

export class SetPage implements StoreAction {
  readonly type = SET_PAGE;

  constructor(public payload: number) {
  }
}

export class SetSearchFilter implements StoreAction {
  readonly type = SET_SEARCH_FILTER;

  constructor(public payload: string) {
  }
}

export class GetBuildingPeriods implements StoreAction {
  readonly type = GET_BUILDING_PERIODS;

  constructor() {
  }
}

export class RollbackBuildingPeriod implements StoreAction {
  readonly type = ROLLBACK_BUILDING_PERIOD;

  constructor(public payload: any) {
  }
}

export class BuildingPeriodsLoaded implements StoreAction {
  readonly type = BUILDING_PERIODS_LOADED;

  constructor(public payload: any) {
  }
}

export class BuildingPeriodRollbackFinished implements StoreAction {
  readonly type = BUILDING_PERIOD_ROLLBACK_FINISHED;

  constructor() {
  }
}

export class BuildingPeriodsReferenceLoaded implements StoreAction {
  readonly type = BUILDING_PERIOD_REFERENCES_LOADED;

  constructor(public payload: any) {
  }
}

export class SetEditDialogMode implements StoreAction {
  readonly type = SET_EDIT_DIALOG_MODE;

  constructor(public payload: any) {
  }
}

export type Action = SetPage | SetPageSize | SetSearchFilter | BuildingPeriodsLoaded | GetBuildingPeriods
  | RollbackBuildingPeriod | BuildingPeriodsReferenceLoaded | SetEditDialogMode;
