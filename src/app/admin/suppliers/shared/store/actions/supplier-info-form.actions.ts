import {Action as StoreAction} from '@ngrx/store';

export const SUPPLIER_LOGO_SELECTED = '[Supplier Information Form] Logo Selected';
export const API_SAVE_SUPPLIER = '[Supplier Information Form] Save Supplier';
export const SET_SUPPLIER_LOGO_URL = '[Supplier Information Form] Set Logo Url';
export const RESET_SUPPLIER_DETAIL = '[Supplier Information Form] RESET_SUPPLIER_DETAIL';
export const SET_SHOW_SUPPLIER_INFO_FORM = '[Supplier Information Form] SET_SHOW_SUPPLIER_INFO_FORM';

export class SupplierLogoSelected implements StoreAction {
  readonly type = SUPPLIER_LOGO_SELECTED;

  constructor(public payload: any) {
  }
}

export class ApiSaveSupplier implements StoreAction {
  readonly type = API_SAVE_SUPPLIER;

  constructor() {
  }
}

export class SetSupplierLogoUrl implements StoreAction {
  readonly type = SET_SUPPLIER_LOGO_URL;

  constructor(public payload: any) {
  }
}

export class ResetSupplierDetail implements StoreAction {
  readonly type = RESET_SUPPLIER_DETAIL;

  constructor() {
  }
}

export class SetShowSupplierInfoForm implements StoreAction {
  readonly type = SET_SHOW_SUPPLIER_INFO_FORM;

  constructor(public payload: any) {
  }
}

export type Action = SupplierLogoSelected | ApiSaveSupplier | SetSupplierLogoUrl |
  ResetSupplierDetail | SetShowSupplierInfoForm;
