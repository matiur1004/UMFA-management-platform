import {Action as StoreAction} from '@ngrx/store';

// Clear Tariff Values Store
export const PURGE_TARIFF_VALUES = '[Tariff Values Form] PURGE_TARIFF_VALUES_FORM';

export class PurgeTariffValuesForm implements StoreAction {
  readonly type = PURGE_TARIFF_VALUES;

  constructor(public payload: { formId }) {

  }
}

export type Action = PurgeTariffValuesForm;
