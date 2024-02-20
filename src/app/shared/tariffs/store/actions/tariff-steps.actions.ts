import {Action as StoreAction} from '@ngrx/store';
import {TariffStepModelBase, TariffStepRangeModel} from '@models';

// Work with steps
export const TARIFF_STEP_ADD_NEW_STEP = '[Tariff Steps] TARIFF_STEP_ADD_NEW_STEP';
export const TARIFF_STEP_ADD_NEW_STEP_FOR_VERSION = '[Tariff Steps] TARIFF_STEP_ADD_NEW_STEP_FOR_VERSION';
export const TARIFF_STEP_DELETE_STEP = '[Tariff Steps] TARIFF_STEP_DELETE_STEP';

export class TariffStepAddNewStep implements StoreAction {
  readonly type = TARIFF_STEP_ADD_NEW_STEP;

  constructor(public featureName: string, public payload: TariffStepModelBase[]) {
  }
}

export class TariffStepAddNewStepForVersion implements StoreAction {
  readonly type = TARIFF_STEP_ADD_NEW_STEP_FOR_VERSION;

  constructor(public featureName: string) {
  }
}

export class TariffStepDeleteStep implements StoreAction {
  readonly type = TARIFF_STEP_DELETE_STEP;

  constructor(public featureName: string, public payload: string) {
  }
}

// Work with ranges
export const TARIFF_STEP_ADD_NEW_RANGE = '[Tariff Steps] TARIFF_STEP_ADD_NEW_RANGE';
export const TARIFF_STEP_DELETE_RANGE = '[Tariff Steps] TARIFF_STEP_DELETE_RANGE';
export const TARIFF_STEP_SET_DATA_RANGE = '[Tariff Steps] TARIFF_STEP_SET_DATA_RANGE';

export class TariffStepAddNewRange implements StoreAction {
  readonly type = TARIFF_STEP_ADD_NEW_RANGE;

  constructor(public featureName: string, public payload: string) {
  }
}

export class TariffStepDeleteRange implements StoreAction {
  readonly type = TARIFF_STEP_DELETE_RANGE;

  constructor(public featureName: string, public payload: { stepId: string, rangeId: string }) {
  }
}

export class TariffStepSetDataRange implements StoreAction {
  readonly type = TARIFF_STEP_SET_DATA_RANGE;

  constructor(public featureName: string, public payload: { rangeData: TariffStepRangeModel, stepId: string, rangeId: string }) {
  }
}

export type Action =
  | TariffStepAddNewStep
  | TariffStepDeleteStep
  | TariffStepAddNewRange
  | TariffStepDeleteRange
  | TariffStepSetDataRange;
