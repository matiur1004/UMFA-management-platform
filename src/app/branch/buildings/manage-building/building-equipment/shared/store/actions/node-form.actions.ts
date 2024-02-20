import {Action as StoreAction} from '@ngrx/store';
import {NodeAllocatedRegister, SelectedStatusFilter} from "../../models";

export const EDIT_NODE = '[Building Equipment Node Form] EDIT_NODE';
export const REMOVE_NODE = '[Building Equipment Node Form] REMOVE_NODE'
export const REMOVE_SELECTED_NODES = '[Building Equipment Node Form] REMOVE_SELECTED_NODES';
export const REMOVE_NODE_REGISTERS = '[Building Equipment Node Form] REMOVE_NODE_REGISTERS';
export const ADD_NODE_REGISTERS = '[Building Equipment Node Form] ADD_NODE_REGISTERS';
export const SET_NODE_REGISTERS_CALCULATION_FACTOR = '[Building Equipment Node Form] SET_NODE_REGISTERS_CALCULATION_FACTOR';
export const SEND_NODE_REQUEST = '[Building Equipment Node Form] SEND_NODE_REQUEST';
export const SEND_NODE_REQUEST_COMPLETE = '[Building Equipment Node Form] SEND_NODE_REQUEST_COMPLETE';
export const UPDATE_SEARCH_KEY = '[Building Equipment Node Form] UPDATE_SEARCH_KEY';
export const UPDATE_REGISTER_FILTER = '[Building Equipment Node Form] UPDATE_REGISTER_FILTER';
export const INIT_METERS = '[Building Equipment Node Form] INIT_METERS';
export const UPDATE_ORDER = '[Building Equipment Node Form] UPDATE_ORDER';

export const SET_ALLOCATED_TARIFFS = '[Building Equipment Node Form] SET_ALLOCATED_TARIFFS';
export const SAVE_ALLOCATED_NODES = '[Building Equipment Node Form] SAVE_ALLOCATED_NODES';
export const SAVE_UNITS = '[Building Equipment Node Form] SAVE_UNITS';
export const SAVE_NODE_DETAIL = '[Building Equipment Node Form] SAVE_NODE_DETAIL';
export const SET_NODE_ATTRIBUTES = '[Building Equipment Node Form] SAVE_NODE_ATTRIBUTES';

export const UPDATE_METER_REGISTER_FILTER = '[Building Equipment Node Form] UPDATE_METER_REGISTER_FILTER';
export const UPDATE_METER_ORDER = '[Building Equipment Node Form] UPDATE_METER_ORDER';

export const UPDATE_METER_SEARCH_KEY = '[Building Equipment Node Form] UPDATE_METER_SEARCH_KEY';
export const TOGGLE_NODE_SELECTED = '[Building Equipment Node Form] TOGGLE_NODE_SELECTED';

export const UPDATE_SUPPLY_TO = '[Building Equipment Node Form] UPDATE_SUPPLY_TO';
export const UPDATE_TARIFF_APPLY_TYPE = '[Building Equipment Node Form] UPDATE_TARIFF_APPLY_TYPE';
export const UPDATE_LOCATION_TYPE = '[Building Equipment Node Form] UPDATE_LOCATION_TYPE';

export const UPDATE_STATUS_FILTER = '[Building Equipment Node Form] UPDATE_STATUS_FILTER';

export const SELECT_ALL_NODES = '[Building Equipment Node Form] SELECT_ALL_NODES';

export const SET_CALCULATION_FACTOR = '[Building Equipment Node Form] SET_CALCULATION_FACTOR';

export const SET_NODE_SHOPS = '[[Building Equipment Node Form]] SET_NODE_SHOPS';
export const UPDATE_SHOP_ORDER = '[Building Equipment Node Form] UPDATE_SHOP_ORDER';
export const UPDATE_SHOP_FILTER = '[Building Equipment Node Form] UPDATE_SHOP_FILTER';
export const UPDATE_SHOP_SEARCH_KEY = '[Building Equipment Node Form] UPDATE_SHOP_SEARCH_KEY';
export const TOGGLE_UNIT = '[Building Equipment Node Form] TOGGLE_UNIT';

export const GET_TARIFFS = '[Building Equipment Node Form] GET_TARIFFS';
export const SET_TARIFFS = '[Building Equipment Node Form] SET_TARIFFS';

export const GET_RECOMMENDED_TARIFFS = '[Building Equipment Node Form] GET_RECOMMENDED_TARIFFS';
export const SET_RECOMMENDED_TARIFFS = '[Building Equipment Node Form] SET_RECOMMENDED_TARIFFS';

export const RESET_NODE_DETAIL_CHANGES = '[Building Equipment Node Form] RESET_NODE_DETAIL_CHANGES';
export const SET_DEFAULT_SUPPLY_TO = '[Building Equipment Node Form] SET_DEFAULT_SUPPLY_TO';

export class SendNodeRequest implements StoreAction {
  readonly type = SEND_NODE_REQUEST;

  constructor(public payload: any) {
  }
}

export class SendNodeRequestComplete implements StoreAction {
  readonly type = SEND_NODE_REQUEST_COMPLETE;

  constructor(public payload: { nodeId: string }) {
  }
}

export class UpdateSearchKey implements StoreAction {
  readonly type = UPDATE_SEARCH_KEY;

  constructor(public payload: any) {
  }
}

export class UpdateRegisterFilter implements StoreAction {
  readonly type = UPDATE_REGISTER_FILTER;

  constructor(public payload: any[]) {
  }
}

export class InitMeters implements StoreAction {
  readonly type = INIT_METERS;

  constructor(public payload: any) {
  }
}

export class RemoveNode implements StoreAction {
  readonly type = REMOVE_NODE;

  constructor(public payload: any) {
  }
}

export class UpdateOrder implements StoreAction {
  readonly type = UPDATE_ORDER;

  constructor(public payload: any) {
  }
}

export class UpdateMeterSearchKey implements StoreAction {
  readonly type = UPDATE_METER_SEARCH_KEY;

  constructor(public payload: any) {
  }
}

export class ToggleNodeSelected implements StoreAction {
  readonly type = TOGGLE_NODE_SELECTED;

  constructor(public payload: { id: string, selected: boolean }) {
  }
}

export class UpdateMeterRegisterFilter implements StoreAction {
  readonly type = UPDATE_METER_REGISTER_FILTER;

  constructor(public payload: any) {
  }
}

export class UpdateSupplyTo implements StoreAction {
  readonly type = UPDATE_SUPPLY_TO;

  constructor(public payload: any) {
  }
}

export class UpdateTariffApplyType implements StoreAction {
  readonly type = UPDATE_TARIFF_APPLY_TYPE;

  constructor(public payload: number) {
  }
}

export class UpdateLocationType implements StoreAction {
  readonly type = UPDATE_LOCATION_TYPE;

  constructor(public payload: any) {
  }
}

export class UpdateStatusFilter implements StoreAction {
  readonly type = UPDATE_STATUS_FILTER;

  constructor(public payload: SelectedStatusFilter) {
  }
}

export class SelectNodes implements StoreAction {
  readonly type = SELECT_ALL_NODES;

  constructor(public payload: { nodeIds: string[], selected: boolean }) {
  }
}

export class SetCalculationFactor implements StoreAction {
  readonly type = SET_CALCULATION_FACTOR;

  constructor(public payload: { nodes: string[], calculationFactor: number }) {
  }
}

export class UpdateShopOrder implements StoreAction {
  readonly type = UPDATE_SHOP_ORDER;

  constructor(public payload: any) {
  }
}

export class UpdateShopFilter implements StoreAction {
  readonly type = UPDATE_SHOP_FILTER;

  constructor(public payload: any) {
  }
}

export class UpdateShopSearchKey implements StoreAction {
  readonly type = UPDATE_SHOP_SEARCH_KEY;

  constructor(public payload: any) {
  }
}

export class ToggleUnit implements StoreAction {
  readonly type = TOGGLE_UNIT;

  constructor(public payload: any) {
  }
}

export class RemoveSelectedNodes implements StoreAction {
  readonly type = REMOVE_SELECTED_NODES;

  constructor(public payload: any) {
  }
}

export class RemoveNodeRegisters implements StoreAction {
  readonly type = REMOVE_NODE_REGISTERS;

  constructor(public payload: NodeAllocatedRegister[]) {
  }
}

export class AddNodeRegisters implements StoreAction {
  readonly type = ADD_NODE_REGISTERS;

  constructor(public payload: NodeAllocatedRegister[]) {
  }
}

export class SetNodeRegistersCalculationFactor implements StoreAction {
  readonly type = SET_NODE_REGISTERS_CALCULATION_FACTOR;

  constructor(public payload: { register: NodeAllocatedRegister, factorValue: number }) {
  }
}

export class UpdateMeterOrder implements StoreAction {
  readonly type = UPDATE_METER_ORDER;

  constructor(public payload: any) {
  }
}

export const UPDATE_COST_TARIFF = '[Building Equipment Node Form] UPDATE_COST_TARIFF';

export class UpdateCostTariff implements StoreAction {
  readonly type = UPDATE_COST_TARIFF;

  constructor(public payload: any) {
  }
}

export class GetTariffs implements StoreAction {
  readonly type = GET_TARIFFS;

  constructor(public payload: { versionId: string } = {versionId: null}) {
  }
}

export class SetTariffs implements StoreAction {
  readonly type = SET_TARIFFS;

  constructor(public payload: any) {
  }
}

export class GetRecommendedTariffs implements StoreAction {
  readonly type = GET_RECOMMENDED_TARIFFS;

  constructor() {
  }
}

export class SetRecommendedTariffs implements StoreAction {
  readonly type = SET_RECOMMENDED_TARIFFS;

  constructor(public payload: any) {
  }
}

export class SetAllocatedTariffs implements StoreAction {
  readonly type = SET_ALLOCATED_TARIFFS;

  constructor(public payload: any) {
  }
}

export class SetNodeShops implements StoreAction {
  readonly type = SET_NODE_SHOPS;

  constructor(public payload: any) {
  }
}

export class SaveAllocatedNodes implements StoreAction {
  readonly type = SAVE_ALLOCATED_NODES;

  constructor(public payload: any) {
  }
}

export class SaveUnits implements StoreAction {
  readonly type = SAVE_UNITS;

  constructor(public payload: any) {
  }
}

export class SaveNodeDetail implements StoreAction {
  readonly type = SAVE_NODE_DETAIL;

  constructor(public payload: any) {
  }
}

export class SetNodeAttributes implements StoreAction {
  readonly type = SET_NODE_ATTRIBUTES;

  constructor(public payload: any) {
  }
}

export class ResetNodeDetailChanges implements StoreAction {
  readonly type = RESET_NODE_DETAIL_CHANGES;

  constructor() {
  }
}

export class SetDefaultSupplyTo implements StoreAction {
  readonly type = SET_DEFAULT_SUPPLY_TO;

  constructor() {
  }
}


export type Action = SendNodeRequest | SendNodeRequestComplete |
  UpdateRegisterFilter | UpdateSearchKey | UpdateTariffApplyType |
  InitMeters | RemoveNode | UpdateOrder | UpdateMeterSearchKey | ToggleNodeSelected |
  UpdateMeterRegisterFilter | UpdateMeterOrder | UpdateCostTariff |
  UpdateLocationType | UpdateSupplyTo | UpdateStatusFilter | SelectNodes | SetCalculationFactor |
  UpdateShopOrder | UpdateShopFilter | UpdateShopSearchKey | ToggleUnit | RemoveSelectedNodes |
  GetTariffs | SetTariffs | GetRecommendedTariffs | SetRecommendedTariffs | SetAllocatedTariffs |
  SetNodeShops | SaveAllocatedNodes | SaveUnits | SaveNodeDetail | SetNodeAttributes | ResetNodeDetailChanges |
  SetDefaultSupplyTo | RemoveNodeRegisters | AddNodeRegisters | SetNodeRegistersCalculationFactor;
