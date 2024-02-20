import {Action as StoreAction} from '@ngrx/store';

export const TOGGLE_WIZARD = '[Building Bulk Equipment Wizard] TOGGLE_WIZARD';
export const TRY_NEXT_STEP = '[Building Bulk Equipment Wizard] TRY_NEXT_STEP';
export const GO_TO_STEP = '[Building Bulk Equipment Wizard] GO_TO_STEP';
export const RESET_WIZARD = '[Building Bulk Equipment Wizard] RESET_WIZARD';
export const UPDATE_METERS_ID = '[Building  Bulk Equipment Wizard] UPDATE_METERS_ID';
export const CLOSE_WIZARD = '[Building Bulk Equipment Wizard] CLOSE_WIZARD';
export const UPDATE_VERSION_DATA = '[Building Bulk Equipment Wizard] UPDATE_VERSION_DATA';
export const GET_LOCATION = '[Building Bulk Equipment Wizard] GET_LOCATION';

export class ToggleWizard implements StoreAction {
  readonly type = TOGGLE_WIZARD;

  constructor() {
  }
}

export class TryNextStep implements StoreAction {
  readonly type = TRY_NEXT_STEP;

  constructor(public payload: any) {
  }
}

export class GoToStep implements StoreAction {
  readonly type = GO_TO_STEP;

  constructor(public payload: any) {
  }
}

export class ResetWizard implements StoreAction {
  readonly type = RESET_WIZARD;

  constructor() {
  }
}

export class UpdateMetersId implements StoreAction {
  readonly type = UPDATE_METERS_ID;

  constructor(public payload: any) {
  }
}

export class CloseWizard implements StoreAction {
  readonly type = CLOSE_WIZARD;

  constructor() {
  }
}

export class UpdateVersionData implements StoreAction {
  readonly type = UPDATE_VERSION_DATA;

  constructor(public payload: any) {
  }
}

export class GetLocation implements StoreAction {
  readonly type = GET_LOCATION;

  constructor() {
  }
}

export type Action = ToggleWizard | TryNextStep | GoToStep | UpdateMetersId |
  CloseWizard | ResetWizard | UpdateVersionData | GetLocation;
