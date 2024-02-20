import {Action as StoreAction} from '@ngrx/store';

export const TOGGLE_WIZARD = '[Building Equipment Wizard] TOGGLE_WIZARD';
export const TRY_NEXT_STEP = '[Building Equipment Wizard] TRY_NEXT_STEP';
export const GO_TO_STEP = '[Building Equipment Wizard] GO_TO_STEP';
export const RESET_WIZARD = '[Building Equipment Wizard] RESET_WIZARD';
export const UPDATE_METER_ID = '[Building Equipment Wizard] UPDATE_METER_ID';
export const CLOSE_WIZARD = '[Building Equipment Wizard] CLOSE_WIZARD';
export const WIZARD_LOCATION_APPOINTMENT = '[Building Equipment Wizard] WIZARD_LOCATION_APPOINTMENT';
export const UPDATE_VERSION_DATA = '[Building Equipment Wizard] UPDATE_VERSION_DATA';

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

export class UpdateMeterId implements StoreAction {
  readonly type = UPDATE_METER_ID;

  constructor(public payload: any) {
  }
}

export class CloseWizard implements StoreAction {
  readonly type = CLOSE_WIZARD;

  constructor() {
  }
}

export class WizardLocationAppointment implements StoreAction {
  readonly type = WIZARD_LOCATION_APPOINTMENT;

  constructor(public payload: any) {
  }
}

export class UpdateVersionData implements StoreAction {
  readonly type = UPDATE_VERSION_DATA;

  constructor(public payload: any) {
  }
}

export type Action = ToggleWizard | TryNextStep | GoToStep | UpdateMeterId | CloseWizard | ResetWizard
  | WizardLocationAppointment | UpdateVersionData;
