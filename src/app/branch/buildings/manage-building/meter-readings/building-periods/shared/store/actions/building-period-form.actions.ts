import {Action as StoreAction} from '@ngrx/store';

export const EDIT_BUILDING_PERIOD = '[Building period form] EDIT_BUILDING_PERIOD';
export const FINALIZE_BUILDING_PERIOD = '[Building period form] FINALIZE_BUILDING_PERIOD';
export const SAVE_BUILDING_PERIOD = '[Building period form] SAVE_BUILDING_PERIOD';
export const EDIT_BUILDING_PERIOD_COMPLETED = '[Building period form] EDIT_BUILDING_PERIOD_COMPLETED';

export class EditBuildingPeriodCompleted implements StoreAction {
  readonly type = EDIT_BUILDING_PERIOD_COMPLETED;

  constructor() {
  }
}

export class EditBuildingPeriod implements StoreAction {
  readonly type = EDIT_BUILDING_PERIOD;

  constructor(public payload: any) {
  }
}

export class FinalizeBuildingPeriod implements StoreAction {
  readonly type = FINALIZE_BUILDING_PERIOD;

  constructor(public payload: any) {
  }
}

export class SaveBuildingPeriod implements StoreAction {
  readonly type = SAVE_BUILDING_PERIOD;

  constructor() {
  }
}

export type Action = EditBuildingPeriod | FinalizeBuildingPeriod | SaveBuildingPeriod | EditBuildingPeriodCompleted;
