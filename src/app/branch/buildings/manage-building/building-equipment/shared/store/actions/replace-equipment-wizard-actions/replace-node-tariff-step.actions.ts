import {Action as StoreAction} from '@ngrx/store';

export const GET_NODE_REQUEST = '[Building Equipment Replace Node Tariff Step] GET_NODE_TEMPLATES';
export const GET_NODE_REQUEST_COMPLETE =
  '[Building Equipment Replace Node Tariff Step] GET_NODE_REQUEST_COMPLETE';

export const GET_TARIFFS_REQUEST = '[Building Equipment Replace Node Tariff Step] GET_TARIFFS_REQUEST';
export const GET_TARIFFS_REQUEST_COMPLETE = '[Building Equipment Replace Node Tariff Step] GET_TARIFFS_REQUEST_COMPLETE';

export const UPDATE_TARIFF = '[Building Equipment Replace Node Tariff Step] UPDATE_TARIFF';
export const TOGGLE_LINE_ITEM_IS_ACTIVE = '[Building Equipment Replace Node Tariff Step] TOGGLE_LINE_ITEM_IS_ACTIVE';
export const UPDATE_LINE_ITEM_CATEGORY = '[Building Equipment Replace Node Tariff Step] UPDATE_LINE_ITEM_CATEGORY';
export const RESET_STATE = '[Building Equipment Replace Node Tariff Step] RESET_STATE';

export class GetNodeRequest implements StoreAction {
  readonly type = GET_NODE_REQUEST;

  constructor() {
  }
}

export class GetNodeRequestComplete implements StoreAction {
  readonly type = GET_NODE_REQUEST_COMPLETE;

  constructor(public payload: any) {
  }
}

export class GetTariffsRequest implements StoreAction {
  readonly type = GET_TARIFFS_REQUEST;

  constructor() {
  }
}

export class GetTariffsRequestComplete implements StoreAction {
  readonly type = GET_TARIFFS_REQUEST_COMPLETE;

  constructor(public payload: any) {
  }
}

export class UpdateTariff implements StoreAction {
  readonly type = UPDATE_TARIFF;

  constructor(public payload: any) {
  }
}

export class ToggleLineItemIsActive implements StoreAction {
  readonly type = TOGGLE_LINE_ITEM_IS_ACTIVE;

  constructor(public payload: any) {
  }
}

export class UpdateLineItemCategory implements StoreAction {
  readonly type = UPDATE_LINE_ITEM_CATEGORY;

  constructor(public payload: any) {
  }
}

export class ResetState implements StoreAction {
  readonly type = RESET_STATE;

  constructor() {
  }
}

export type Action = GetNodeRequest | GetNodeRequestComplete |
  GetTariffsRequest | GetTariffsRequestComplete |
  UpdateTariff | ToggleLineItemIsActive |
  UpdateLineItemCategory | ResetState;
