import {Action as StoreAction} from '@ngrx/store';

export const INIT_REGISTERS = '[Building Equipment Replace Add Closing Readings Equipment Step] INIT_REGISTERS';

export const UPDATE_REGISTER_FILE = '[Building Equipment Replace Add Closing Readings Equipment Step] UPDATE_REGISTER_FILE';

export const RESET_ADD_CLOSING_READINGS_STEP =
  '[Building Equipment Replace Add Closing Readings Equipment Step] RESET_ADD_CLOSING_READINGS_STEP';

export class UpdateRegisterFile implements StoreAction {
  readonly type = UPDATE_REGISTER_FILE;

  constructor(public payload: any) {
  }
}

export class ResetAddClosingReadingsStep implements StoreAction {
  readonly type = RESET_ADD_CLOSING_READINGS_STEP;

  constructor() {
  }
}

export class InitRegisters implements StoreAction {
  readonly type = INIT_REGISTERS;

  constructor(public payload: any) {
  }
}

export type Action = UpdateRegisterFile | ResetAddClosingReadingsStep | InitRegisters;
