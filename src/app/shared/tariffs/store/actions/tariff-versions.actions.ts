import {Action as StoreAction} from '@ngrx/store';

export const UPDATE_TARIFF_VERSIONS = '[Tariff Form] UPDATE_TARIFF_VERSIONS';
export const UPDATE_TARIFF_SUB_VERSIONS = '[Tariff Form] UPDATE_TARIFF_SUB_VERSIONS';
export const UPDATE_TARIFF_VALUES_VERSIONS = '[Tariff Form] UPDATE_TARIFF_VALUES_VERSIONS';

export const UPDATE_TARIFF_VERSIONS_ORDER = '[Tariff Form] UPDATE_TARIFF_VERSIONS_ORDER';
export const UPDATE_TARIFF_SUB_VERSIONS_ORDER = '[Tariff Form] UPDATE_TARIFF_SUB_VERSIONS_ORDER';
export const UPDATE_TARIFF_VALUES_VERSIONS_ORDER = '[Tariff Form] UPDATE_TARIFF_VALUES_VERSIONS_ORDER';

export const ADD_TARIFF_VERSION = '[Tariff] ADD_TARIFF_VERSION';
export const OPEN_TARIFF_POPUP = '[Tariff] OPEN_TARIFF_POPUP';
export const RESULT_TARIFF_POPUP_SUCCESS = '[Tariff] RESULT_TARIFF_POPUP_SUCCESS';


export class UpdateTariffVersionsOrder implements StoreAction {
  readonly type = UPDATE_TARIFF_VERSIONS_ORDER;

  constructor(public area: string, public payload: any) {
  }
}

export class UpdateTariffSubVersionsOrder implements StoreAction {
  readonly type = UPDATE_TARIFF_SUB_VERSIONS_ORDER;

  constructor(public area: string, public payload: any) {
  }
}


export class UpdateTariffVersions implements StoreAction {
  readonly type = UPDATE_TARIFF_VERSIONS;

  constructor(public area: string, public payload: any) {
  }
}

export class UpdateTariffSubVersions implements StoreAction {
  readonly type = UPDATE_TARIFF_SUB_VERSIONS;

  constructor(public area: string, public payload: any) {
  }
}

export class UpdateTariffValuesVersions implements StoreAction {
  readonly type = UPDATE_TARIFF_VALUES_VERSIONS;

  constructor(public area: string, public payload: any) {
  }
}

export class UpdateTariffValuesVersionsOrder implements StoreAction {
  readonly type = UPDATE_TARIFF_VALUES_VERSIONS_ORDER;

  constructor(public area: string, public payload: any) {
  }
}

export class AddTariffVersion implements StoreAction {
  readonly type = ADD_TARIFF_VERSION;

  constructor() {
  }
}

export class OpenTariffPopup implements StoreAction {
  readonly type = OPEN_TARIFF_POPUP;

  constructor(public payload: {
    majorVersion: number,
    nextAvaibleDate: Date
  }) {
  }
}

export class ResultTariffPopupSuccess implements StoreAction {
  readonly type = RESULT_TARIFF_POPUP_SUCCESS;

  constructor(public payload: boolean) {
  }
}

export type Action = UpdateTariffVersionsOrder
  | UpdateTariffValuesVersionsOrder
  | UpdateTariffVersionsOrder
  | UpdateTariffSubVersionsOrder
  | UpdateTariffVersions
  | UpdateTariffSubVersions
  | UpdateTariffValuesVersions
  | AddTariffVersion
  | OpenTariffPopup
  | ResultTariffPopupSuccess;
