import {Action as StoreAction} from '@ngrx/store';
import {EquipmentAttributeViewModel, RegisterViewModel, UnitOfMeasurement} from '@models';

export const SUPPLIER_ADD_NEW = '[Supplier] Supplier Add New Supplier';
export const SUPPLIER_FILTER_TEXT_CHANGED = '[Supplier] Supplier Filter Text Changed';
export const SUPPLIER_FILTER_SUPPLY_TYPE_CHANGED = '[Supplier] Supplier Filter Supply Type Changed';
export const SUPPLIER_ADD_NEW_MODAL_CHANGED = '[Supplier] Add New Modal Changed';
export const API_SUPPLIERS_LIST_REQUEST = '[Supplier] API request list of suppliers';
export const API_SUPPLIERS_LIST_LOADED = '[Supplier] API suppliers list loaded';
export const API_SUPPLIER_LOAD = '[Supplier] Load supplier data';
export const API_SUPPLIER_LOAD_FAILED = '[Supplier] API Supplier request failed';
export const API_SUPPLIER_LOADED = '[Supplier] API Supplier loaded';
export const API_SUPPLIER_DELETE = '[Supplier] API Supplier Delete';
export const API_SUPPLIER_CREATE = '[Supplier] API Supplier Create';
export const API_SUPPLIER_GET_TARIFF_CATEGORIES = '[Supplier Categories] API Get Supplier Categories';
export const API_SUPPLIER_GET_TARIFF_CATEGORIES_SUCCEEDED = '[Supplier Categories] API Get Supplier Categories Succeeded';
export const SUPPLIERS_LIST_ORDER_CHANGED = '[Supplier] Supplier list order changed';

export class ApiSuppliersListRequest implements StoreAction {
  readonly type = API_SUPPLIERS_LIST_REQUEST;

  constructor() {
  }
}

export class ApiSuppliersListLoaded implements StoreAction {
  readonly type = API_SUPPLIERS_LIST_LOADED;

  constructor(public payload: any) {
  }
}

export class ApiSupplierLoaded implements StoreAction {
  readonly type = API_SUPPLIER_LOADED;

  constructor(public payload: any) {
  }
}

export class ApiSupplierLoadFailed implements StoreAction {
  readonly type = API_SUPPLIER_LOAD_FAILED;

  constructor(public payload: any) {
  }
}

export class ApiSupplierDelete implements StoreAction {
  readonly type = API_SUPPLIER_DELETE;

  constructor(public payload: any) {
  }
}

export class ApiSupplierCreate implements StoreAction {
  readonly type = API_SUPPLIER_CREATE;

  constructor() {
  }
}

export class ApiSupplierLoad implements StoreAction {
  readonly type = API_SUPPLIER_LOAD;

  constructor(public payload: { supplierId: string }) {
  }
}

export class SupplierAddNew implements StoreAction {
  readonly type = SUPPLIER_ADD_NEW;

  constructor() {
  }
}

export class SupplierFilterTextChanged implements StoreAction {
  readonly type = SUPPLIER_FILTER_TEXT_CHANGED;

  constructor(public payload: any) {
  }
}

export class SupplierFilterSupplyTypeChanged implements StoreAction {
  readonly type = SUPPLIER_FILTER_SUPPLY_TYPE_CHANGED;

  constructor(public payload: any) {
  }
}

export class SupplierAddNewModalChanged implements StoreAction {
  readonly type = SUPPLIER_ADD_NEW_MODAL_CHANGED;

  constructor(public payload: any) {
  }
}

export class ApiSupplierGetTariffCategories implements StoreAction {
  readonly type = API_SUPPLIER_GET_TARIFF_CATEGORIES;

  constructor() {
  }
}

export class ApiSupplierGetTariffCategoriesSucceeded implements StoreAction {
  readonly type = API_SUPPLIER_GET_TARIFF_CATEGORIES_SUCCEEDED;

  constructor(public payload: any) {
  }
}

export class SuppliersListOrderChanged implements StoreAction {
  readonly type = SUPPLIERS_LIST_ORDER_CHANGED;

  constructor(public payload: any) {
  }
}


// GET Attributes
export const API_SUPPLIER_GET_ATTRIBUTES = '[Supplier] API_SUPPLIER_GET_ATTRIBUTES';
export const API_SUPPLIER_GET_ATTRIBUTES_SUCCEEDED = '[Supplier] API_SUPPLIER_GET_ATTRIBUTES_SUCCEEDED';

export class ApiGetEquipmentAttributes implements StoreAction {
  readonly type = API_SUPPLIER_GET_ATTRIBUTES;

  constructor(public payload?: boolean) {
  }
}

export class ApiGetEquipmentAttributesSucceeded implements StoreAction {
  readonly type = API_SUPPLIER_GET_ATTRIBUTES_SUCCEEDED;

  constructor(public payload: EquipmentAttributeViewModel[]) {
  }
}

// Get Equipment Register
export const API_SUPPLIER_GET_REGISTERS = '[Supplier] API_SUPPLIER_GET_REGISTERS';
export const API_SUPPLIER_GET_REGISTERS_SUCCESS = '[Supplier] API_SUPPLIER_GET_REGISTERS_SUCCESS';

export class ApiGetRegisters implements StoreAction {
  readonly type = API_SUPPLIER_GET_REGISTERS;

  constructor(public payload?: boolean) {
  }
}

export class ApiGetRegistersSuccess implements StoreAction {
  readonly type = API_SUPPLIER_GET_REGISTERS_SUCCESS;

  constructor(public payload: RegisterViewModel[]) {
  }
}

// Get Equipment Register
export const API_SUPPLIER_GET_UNITS_OF_MEASUREMENT = '[Supplier] API_SUPPLIER_GET_UNITS_OF_MEASUREMENT';
export const API_SUPPLIER_GET_UNITS_OF_MEASUREMENT_SUCCESS = '[Supplier] API_SUPPLIER_GET_UNITS_OF_MEASUREMENT_SUCCESS';

export class ApiGetUnitsOfMeasurement implements StoreAction {
  readonly type = API_SUPPLIER_GET_UNITS_OF_MEASUREMENT;

  constructor() {
  }
}

export class ApiGetUnitsOfMeasurementSuccess implements StoreAction {
  readonly type = API_SUPPLIER_GET_UNITS_OF_MEASUREMENT_SUCCESS;

  constructor(public payload: UnitOfMeasurement[]) {
  }
}

export const API_SUPPLIER_TARIFF_SETTINGS_REQUEST_SUCCEEDED = '[Tariff Settings] API_SUPPLIER_TARIFF_SETTINGS_REQUEST_SUCCEEDED';

export class ApiTariffSettingsRequestSucceeded implements StoreAction {
  readonly type = API_SUPPLIER_TARIFF_SETTINGS_REQUEST_SUCCEEDED;

  constructor(public payload: any) {
  }
}

export const CLEAR_TARIFF_SETTINGS_STORE = '[Tariff Settings] CLEAR_TARIFF_SETTINGS_STORE';

/**
 * Cleare cache of Tariff Settings data
 */
export class ClearTariffSettingsStore implements StoreAction {
  readonly type = CLEAR_TARIFF_SETTINGS_STORE;

  constructor() {
  }
}

export type Action =
  SupplierFilterSupplyTypeChanged
  | SupplierFilterTextChanged
  | SupplierAddNew
  | SupplierAddNewModalChanged
  | ApiSuppliersListRequest
  | ApiSuppliersListLoaded
  | ApiSupplierLoad
  | ApiSupplierLoadFailed
  | ApiSupplierLoaded
  | ApiSupplierDelete
  | ApiSupplierCreate
  | ApiSupplierGetTariffCategories
  | ApiSupplierGetTariffCategoriesSucceeded
  | SuppliersListOrderChanged
  | ApiGetEquipmentAttributes
  | ApiGetEquipmentAttributesSucceeded
  | ApiGetRegisters
  | ApiGetRegistersSuccess
  | ApiGetUnitsOfMeasurementSuccess
  | ApiTariffSettingsRequestSucceeded
  | ClearTariffSettingsStore;
