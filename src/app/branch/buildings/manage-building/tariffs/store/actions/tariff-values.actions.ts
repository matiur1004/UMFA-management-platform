import {Action as StoreAction} from '@ngrx/store';
import {
  CreateTariffValueViewModel,
  NewTariffVersionCurrentTariff,
  TariffValuesViewModel,
  TariffValueVersionInfoViewModel,
  TariffViewModel,
  VersionViewModel
} from '@models';

//#region Create Tariff Value
export const API_CREATE_TARIFF_VALUE = '[Building tariff - create value] API Save Tariff Value';
export const API_CREATE_TARIFF_VALUE_SUCCESS = '[Building tariff - create value] API Save Tariff Value Success';
export const API_CREATE_TARIFF_VALUE_FAILED = '[Building tariff - create value] API Save Tariff Value Failed';
export const CREATE_TARIFF_VALUE_FORM_INIT = '[Building tariff - create value] Init Form';
export const CREATE_TARIFF_VALUE_ADD_NEW_VALUE = '[Building tariff - create value] Add new tariff value';
export const CREATE_TARIFF_VALUE_VERSION = '[Building tariff - create value version] CREATE_TARIFF_VALUE_VERSION';

export class ApiCreateTariffValue implements StoreAction {
  readonly type = API_CREATE_TARIFF_VALUE;

  constructor(public payload: CreateTariffValueViewModel) {
  }
}

export class CreateTariffValueAddNewValue implements StoreAction {
  readonly type = CREATE_TARIFF_VALUE_ADD_NEW_VALUE;

  constructor(public payload: {
    tariffVersion: VersionViewModel<TariffViewModel>
  }) {
  }
}

export class CreateTariffValueFormInit implements StoreAction {
  readonly type = CREATE_TARIFF_VALUE_FORM_INIT;

  constructor(public payload: {
    lineItems: any[],
    tariffVersionId: string,
    baseTariffValueId?: string,
    versionMainInfo?: {
      versionId: string
      versionDate: string,
      versionTariffName: string,
      versionMajorVersion: number,
      currentTariff: NewTariffVersionCurrentTariff
    }
  }) {
  }
}

export class ApiCreateTariffValueSuccess implements StoreAction {
  readonly type = API_CREATE_TARIFF_VALUE_SUCCESS;

  constructor(public payload: any) {
  }
}

export class ApiCreateTariffValueFailed implements StoreAction {
  readonly type = API_CREATE_TARIFF_VALUE_FAILED;

  constructor(private payload: any) {
  }
}

export class CreateTariffValueVersion implements StoreAction {
  readonly type = CREATE_TARIFF_VALUE_VERSION;

  constructor(public payload: { tariffVersionId: string, tariffValueId: string }) {
  }
}

//#endregion


// GET
export const GET_TARIFF_VALUES = '[Building Tariff Values] GET_TARIFF_VALUES';
export const GET_TARIFF_VALUES_SUCCESS = '[Building Tariff Values] GET_TARIFF_VALUES_SUCCESS';
export const GET_TARIFF_VALUES_FAILED = '[Building Tariff Values] GET_TARIFF_VALUES_FAILED';

export class GetTariffValues implements StoreAction {
  readonly type = GET_TARIFF_VALUES;

  constructor(public payload: any) {
  }
}

export class GetTariffValuesSuccess implements StoreAction {
  readonly type = GET_TARIFF_VALUES_SUCCESS;

  constructor(public payload: VersionViewModel<TariffValuesViewModel>) {
  }
}

export class GetTariffValuesFailed implements StoreAction {
  readonly type = GET_TARIFF_VALUES_FAILED;

  constructor(public payload: any) {
  }
}

// UPDATE
export const UPDATE_TARIFF_VALUES = '[Building Tariff Values] UPDATE_TARIFF_VALUES';
export const UPDATE_TARIFF_VALUES_SUCCESS = '[Building Tariff Values] UPDATE_TARIFF_VALUES_SUCCESS';
export const UPDATE_TARIFF_VALUES_FAILED = '[Building Tariff Values] UPDATE_TARIFF_VALUES_FAILED';

export class UpdateTariffValues implements StoreAction {
  readonly type = UPDATE_TARIFF_VALUES;

  constructor(public payload: any) {
  }
}

export class UpdateTariffValuesSuccess implements StoreAction {
  readonly type = UPDATE_TARIFF_VALUES_SUCCESS;

  constructor() {
  }
}

export class UpdateTariffValuesFailed implements StoreAction {
  readonly type = UPDATE_TARIFF_VALUES_FAILED;

  constructor(public payload: any) {
  }
}

// Clear Building Tariff Values Store
export const PURGE_TARIFF_VALUES = '[Building Tariff Values] PURGE_TARIFF_VALUES';

export class PurgeTariffValues implements StoreAction {
  readonly type = PURGE_TARIFF_VALUES;
}

export const UPDATE_TARIFF_VALUES_ORDER = '[Building Tariff Values] UPDATE_TARIFF_VALUES_ORDER';

export class UpdateTariffValuesOrder implements StoreAction {
  readonly type = UPDATE_TARIFF_VALUES_ORDER;

  constructor(public payload: TariffValueVersionInfoViewModel[]) {
  }
}

export const DELETE_TARIFF_VALUES_VERSION_REQUEST = '[Building Tariff Values] DELETE_TARIFF_VALUES_VERSION_REQUEST';
export const DELETE_TARIFF_VALUE_REQUEST = '[Building Tariff Values] DELETE_TARIFF_VALUE_REQUEST';
export const DELETE_TARIFF_VALUES_VERSION_REQUEST_COMPLETE = '[Building Tariff Values] DELETE_TARIFF_VALUES_VERSION_REQUEST_COMPLETE';
export const DELETE_TARIFF_VALUE_REQUEST_COMPLETE = '[Building Tariff Values] DELETE_TARIFF_VALUE_REQUEST_COMPLETE';

export class DeleteTariffValuesVersionRequest implements StoreAction {
  readonly type = DELETE_TARIFF_VALUES_VERSION_REQUEST;

  constructor(public payload: { tariffVersionId: string, tariffValueVersionId: string }) {
  }
}

export class DeleteTariffValueRequest implements StoreAction {
  readonly type = DELETE_TARIFF_VALUE_REQUEST;

  constructor(public payload: { tariffVersionId: string, tariffValueId: string }) {
  }
}

export class DeleteTariffValuesVersionRequestComplete implements StoreAction {
  readonly type = DELETE_TARIFF_VALUES_VERSION_REQUEST_COMPLETE;

  constructor(public payload: { tariffVersionId: string, valueVersionId: string }) {
  }
}

export class DeleteTariffValueRequestComplete implements StoreAction {
  readonly type = DELETE_TARIFF_VALUE_REQUEST_COMPLETE;

  constructor(public payload: { tariffValueId: string }) {
  }
}


export type Action =
  | ApiCreateTariffValue
  | CreateTariffValueAddNewValue
  | CreateTariffValueFormInit
  | ApiCreateTariffValueSuccess
  | ApiCreateTariffValueFailed
  | GetTariffValues
  | GetTariffValuesSuccess
  | GetTariffValuesFailed
  | UpdateTariffValues
  | UpdateTariffValuesSuccess
  | UpdateTariffValuesFailed
  | PurgeTariffValues
  | UpdateTariffValuesOrder
  | DeleteTariffValuesVersionRequest
  | DeleteTariffValuesVersionRequestComplete
  | DeleteTariffValueRequest
  | DeleteTariffValueRequestComplete;
