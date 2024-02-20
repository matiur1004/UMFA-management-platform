import {Action as StoreAction} from '@ngrx/store';

export const API_BUILDING_TARIFF_SETTINGS_UPDATE = '[Building Tariff Settings] API_BUILDING_TARIFF_SETTINGS_UPDATE';

export class ApiUpdateTariffSettings implements StoreAction {
  readonly type = API_BUILDING_TARIFF_SETTINGS_UPDATE;

  constructor() {
  }
}

export const API_BUILDING_TARIFF_SETTINGS_UPDATE_SUCCEEDED = '[Building Tariff Settings] API_BUILDING_TARIFF_SETTINGS_UPDATE_SUCCEEDED';

export class ApiUpdateTariffSettingsSucceeded implements StoreAction {
  readonly type = API_BUILDING_TARIFF_SETTINGS_UPDATE_SUCCEEDED;

  constructor() {
  }
}

export type Actions = ApiUpdateTariffSettings | ApiUpdateTariffSettingsSucceeded;
