import {Action as StoreAction} from '@ngrx/store';

export const ADD_TARIFF_VALUE = '[Tariff Value] ADD_TARIFF_VALUE';

export class AddTariffValue implements StoreAction {
  readonly type = ADD_TARIFF_VALUE;

  constructor(public payload: any) {
  }
}

export type Action = AddTariffValue;
