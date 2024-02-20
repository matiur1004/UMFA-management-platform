import {Action as StoreAction} from '@ngrx/store';
import {TariffValueVersionModel} from '@app/shared/models/tariff-value.model';
import {NewTariffVersionCurrentTariff} from '@models';

export const CREATE_TARIFF_CLICK = '[Tariff Form] CREATE_TARIFF_CLICK';
export const CREATE_TARIFF_OPEN_MODAL = '[Tariff Form] CREATE_TARIFF_OPEN_MODAL';
export const CREATE_TARIFF_REQUEST = '[Tariff Form] CREATE_TARIFF_REQUEST';
export const CREATE_TARIFF_REQUEST_COMPLETE = '[Tariff Form] CREATE_TARIFF_REQUEST_COMPLETE';

export const EDIT_TARIFF = '[Tariff Form] EDIT_TARIFF';
export const SEND_TARIFF_REQUEST = '[Tariff Form] SEND_TARIFF_REQUEST';
export const SEND_TARIFF_REQUEST_COMPLETE = '[Tariff Form] SEND_TARIFF_REQUEST_COMPLETE';

export const UPDATE_SUPPLY_TYPE = '[Tariff Form] UPDATE_SUPPLY_TYPE';
export const UPDATE_SUPPLY_TYPE_FOR_EDIT = '[Tariff Form] UPDATE_SUPPLY_TYPE_FOR_EDIT';

export const UPDATE_LINE_ITEM_CHARGING_TYPE = '[Tariff Form] UPDATE_LINE_ITEM_CHARGING_TYPE';

export const RESET_IS_COMPLETE = '[Tariff Form] RESET_IS_COMPLETE';

export const UPDATE_EQUIPMENT_ATTRIBUTES_LIST = '[Tariff Form] UPDATE_EQUIPMENT_ATTRIBUTES_LIST';
export const UPDATE_REGISTERS_LIST = '[Tariff Form] UPDATE_REGISTERS_LIST';
export const UPDATE_SUPPLIER_CATEGORIES_LIST = '[Tariff Form] UPDATE_SUPPLIER_CATEGORIES_LIST';

export const UPDATE_TARIFF_VERSIONS = '[Tariff Form] UPDATE_TARIFF_VERSIONS';
export const UPDATE_TARIFF_VALUES_VERSIONS = '[Tariff Form] UPDATE_TARIFF_VALUES_VERSIONS';

export const UPDATE_TARIFF_VERSIONS_ORDER = '[Tariff Form] UPDATE_TARIFF_VERSIONS_ORDER';
export const UPDATE_TARIFF_VALUES_VERSIONS_ORDER = '[Tariff Form] UPDATE_TARIFF_VALUES_VERSIONS_ORDER';

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

export class CreateTariffClick implements StoreAction {
  readonly type = CREATE_TARIFF_CLICK;

  constructor() {
  }
}

export class OpenCreateTariffModal implements StoreAction {
  readonly type = CREATE_TARIFF_OPEN_MODAL;

  constructor() {
  }
}

export class EditTariff implements StoreAction {
  readonly type = EDIT_TARIFF;

  constructor() {
  }
}

export class CreateTariffRequest implements StoreAction {
  readonly type = CREATE_TARIFF_REQUEST;

  constructor(public payload: { name: string, supplyType: number, buildingTariffCategoriesFormIdIds: string[] }) {
  }
}

export class CreateTariffRequestComplete implements StoreAction {
  readonly type = CREATE_TARIFF_REQUEST_COMPLETE;

  constructor(public payload: { supplierId: string, tariffVersionId: string }) {
  }
}

export class UpdateSupplyType implements StoreAction {
  readonly type = UPDATE_SUPPLY_TYPE;

  constructor(public payload: any) {
  }
}

export class UpdateEquipmentAttributesList implements StoreAction {
  readonly type = UPDATE_EQUIPMENT_ATTRIBUTES_LIST;

  constructor(public payload: any) {
  }
}

export class UpdateTariffVersionsOrder implements StoreAction {
  readonly type = UPDATE_TARIFF_VERSIONS_ORDER;

  constructor(public payload: any) {
  }
}

export class UpdateRegistersList implements StoreAction {
  readonly type = UPDATE_REGISTERS_LIST;

  constructor(public payload: any) {
  }
}

export class UpdateSupplierCategoriesList implements StoreAction {
  readonly type = UPDATE_SUPPLIER_CATEGORIES_LIST;

  constructor(public payload: any) {
  }
}

export class UpdateTariffVersions implements StoreAction {
  readonly type = UPDATE_TARIFF_VERSIONS;

  constructor(public payload: any) {
  }
}

export class UpdateTariffValuesVersions implements StoreAction {
  readonly type = UPDATE_TARIFF_VALUES_VERSIONS;

  constructor(public payload: any) {
  }
}

export class UpdateTariffValuesVersionsOrder implements StoreAction {
  readonly type = UPDATE_TARIFF_VALUES_VERSIONS_ORDER;

  constructor(public payload: any) {
  }
}

export type Action =
  SendTariffRequest
  | SendTariffRequestComplete
  | CreateTariffClick
  | OpenCreateTariffModal
  | EditTariff
  |
  CreateTariffRequest
  | CreateTariffRequestComplete
  | UpdateSupplyType
  |
  UpdateEquipmentAttributesList
  | UpdateRegistersList
  |
  UpdateSupplierCategoriesList
  | UpdateTariffVersionsOrder
  |
  UpdateTariffVersions
  | UpdateTariffValuesVersions
  | UpdateTariffValuesVersionsOrder;
