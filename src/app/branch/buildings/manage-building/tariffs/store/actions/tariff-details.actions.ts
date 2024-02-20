import {Action as StoreAction} from '@ngrx/store';
import {TariffValueVersionModel} from '@app/shared/models/tariff-value.model';
import {NewTariffVersionCurrentTariff} from '@models';

export const SEND_TARIFF_REQUEST = '[Building Tariff Form] SEND_TARIFF_REQUEST';
export const SEND_TARIFF_REQUEST_COMPLETE = '[Building Tariff Form] SEND_TARIFF_REQUEST_COMPLETE';

export class SendTariffRequest implements StoreAction {
  readonly type = SEND_TARIFF_REQUEST;

  constructor(public payload: {
    tariffValueVersion: TariffValueVersionModel,
    currTariff?: NewTariffVersionCurrentTariff,
    isSubVersion: boolean
  }) {
  }
}

export class SendTariffRequestComplete implements StoreAction {
  readonly type = SEND_TARIFF_REQUEST_COMPLETE;

  constructor() {
  }
}

export type Actions = SendTariffRequest | SendTariffRequestComplete;
