import {Action as StoreAction} from '@ngrx/store';

export const TOGGLE_WIZARD = '[Building Replace Equipment Wizard] TOGGLE_WIZARD';
export const TRY_NEXT_STEP = '[Building Replace Equipment Wizard] TRY_NEXT_STEP';
export const GO_TO_STEP = '[Building Replace Equipment Wizard] GO_TO_STEP';
export const RESET_WIZARD = '[Building Replace Equipment Wizard] RESET_WIZARD';
export const CLOSE_WIZARD = '[Building Replace Equipment Wizard] CLOSE_WIZARD';
export const UPDATE_METER_ID = '[Building Replace Equipment Wizard] UPDATE_METER_ID';
export const SET_WIZARD_LOCATION_APPOINTMENT = '[Building Replace Equipment Wizard] SET_WIZARD_LOCATION_APPOINTMENT';
export const UPDATE_VERSION_DATA = '[Building Replace Equipment Wizard] UPDATE_VERSION_DATA';

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

export class CloseWizard implements StoreAction {
  readonly type = CLOSE_WIZARD;

  constructor() {
  }
}

export class UpdateMeterId implements StoreAction {
  readonly type = UPDATE_METER_ID;

  constructor(public payload: any) {
  }
}

export class UpdateVersionData implements StoreAction {
  readonly type = UPDATE_VERSION_DATA;

  constructor(public payload: any) {
  }
}

export class SetWizardLocationAppointment implements StoreAction {
  readonly type = SET_WIZARD_LOCATION_APPOINTMENT;

  constructor(public payload: any) {
  }
}

export type Action = ToggleWizard | TryNextStep | GoToStep | CloseWizard |
  ResetWizard | UpdateVersionData | UpdateMeterId |
  SetWizardLocationAppointment;
