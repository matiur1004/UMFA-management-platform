import {Action as StoreAction} from '@ngrx/store';

export const GET_TARIFFS_FOR_APPLYING = '[Building Equipment Node Form Allocated Tariff] GET_TARIFFS_FOR_APPLYING';
export const SET_TARIFFS_FOR_APPLYING = '[Building Equipment Node Form Allocated Tariff] SET_TARIFFS_FOR_APPLYING';
export const SELECT_SUPPLIER = '[Building Equipment Node Form Allocated Tariff] SELECT_SUPPLIER';
export const SELECT_TARIFF_VERSION = '[Building Equipment Node Form Allocated Tariff] SELECT_TARIFF_VERSION';
export const APPLY_NEW_TARIFF = '[Building Equipment Node Form Allocated Tariff] APPLY_NEW_TARIFF';

export const SET_NODE_TARIFFS = '[Building Equipment Node Form Allocated Tariff] SET_NODE_TARIFFS';
export const SET_NODE_RECOMMENDED_TARIFFS = '[Building Equipment Node Form Allocated Tariff] SET_NODE_RECOMMENDED_TARIFFS';
export const DELETE_TARIFF = '[Building Equipment Node Form Allocated Tariff] DELETE_TARIFF';
export const UPDATE_TARIFF_IS_BILLING = '[Building Equipment Node Form Allocated Tariff] UPDATE_TARIFF_IS_BILLING';
export const UPDATE_LINE_ITEM_IS_BILLING = '[Building Equipment Node Form Allocated Tariff] UPDATE_LINE_ITEM_IS_BILLING';
export const UPDATE_LINE_ITEM_IS_ACTIVE = '[Building Equipment Node Form Allocated Tariff] UPDATE_LINE_ITEM_IS_ACTIVE';
export const UPDATE_LINE_ITEM_CATEGORY = '[Building Equipment Node Form Allocated Tariff] UPDATE_LINE_ITEM_CATEGORY';
export const SAVE_TARIFFS = '[Building Equipment Node Form Allocated Tariff] SAVE_TARIFFS';

export class GetTariffsForApplying implements StoreAction {
  readonly type = GET_TARIFFS_FOR_APPLYING;

  constructor() {
  }
}

export class SetTariffsForApplying implements StoreAction {
  readonly type = SET_TARIFFS_FOR_APPLYING;

  constructor(public payload: any) {
  }
}

export class SelectSupplier implements StoreAction {
  readonly type = SELECT_SUPPLIER;

  constructor(public payload: any) {
  }
}

export class SelectTariffVersion implements StoreAction {
  readonly type = SELECT_TARIFF_VERSION;

  constructor(public payload: any) {
  }
}

export class ApplyNewTariff implements StoreAction {
  readonly type = APPLY_NEW_TARIFF;

  constructor(public payload: { isRecommended: boolean }) {
  }
}

export class SetNodeTariffs implements StoreAction {
  readonly type = SET_NODE_TARIFFS;

  constructor(public payload: any) {
  }
}

export class SetNodeRecommendedTariffs implements StoreAction {
  readonly type = SET_NODE_RECOMMENDED_TARIFFS;

  constructor(public payload: any) {
  }
}

export class DeleteTariff implements StoreAction {
  readonly type = DELETE_TARIFF;

  constructor(public payload: any) {
  }
}

export class UpdateTariffIsBilling implements StoreAction {
  readonly type = UPDATE_TARIFF_IS_BILLING;

  constructor(public payload: any) {
  }
}

export class UpdateLineItemIsBilling implements StoreAction {
  readonly type = UPDATE_LINE_ITEM_IS_BILLING;

  constructor(public payload: any) {
  }
}

export class UpdateLineItemIsActive implements StoreAction {
  readonly type = UPDATE_LINE_ITEM_IS_ACTIVE;

  constructor(public payload: any) {
  }
}

export class UpdateLineItemCategory implements StoreAction {
  readonly type = UPDATE_LINE_ITEM_CATEGORY;

  constructor(public payload: any) {
  }
}

export class SaveTariffs implements StoreAction {
  readonly type = SAVE_TARIFFS;

  constructor(public payload: any) {
  }
}

export type Action = GetTariffsForApplying | SetTariffsForApplying | SelectSupplier | SelectTariffVersion |
  ApplyNewTariff | SetNodeTariffs | SetNodeRecommendedTariffs | DeleteTariff | UpdateTariffIsBilling |
  UpdateLineItemIsBilling | UpdateLineItemIsActive | UpdateLineItemCategory | SaveTariffs;
