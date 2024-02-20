import {Action as StoreAction} from '@ngrx/store';
import {ChargesListOrder, ChargeViewModel, OrderVersion} from '../../../shared/models';

// GET Additional Charges
export const GET_BUILDING_ADDITIONAL_CHARGES = '[Building Tariffs Assignment] GET_BUILDING_ADDITIONAL_CHARGES';
export const GET_BUILDING_ADDITIONAL_CHARGES_SUCCESS = '[Building Tariffs Assignment] GET_BUILDING_ADDITIONAL_CHARGES_SUCCESS';

export class GetBuildingAdditionalCharges implements StoreAction {
  readonly type = GET_BUILDING_ADDITIONAL_CHARGES;

  constructor(public payload: any) {
  }
}

export class GetBuildingAdditionalChargesSuccess implements StoreAction {
  readonly type = GET_BUILDING_ADDITIONAL_CHARGES_SUCCESS;

  constructor(public payload: ChargeViewModel[]) {
  }
}

// GET Additional Charges Tariffs
export const GET_ADDITIONAL_CHARGE_TARIFFS = '[Building Tariffs Assignment] GET_ADDITIONAL_CHARGE_TARIFFS';
export const GET_ADDITIONAL_CHARGE_TARIFFS_SUCCESS = '[Building Tariffs Assignment] GET_ADDITIONAL_CHARGE_TARIFFS_SUCCESS';

export class GetAdditionalChargeTariffs implements StoreAction {
  readonly type = GET_ADDITIONAL_CHARGE_TARIFFS;

  constructor(public payload: string) {
  }
}

export class GetAdditionalChargeTariffsSuccess implements StoreAction {
  readonly type = GET_ADDITIONAL_CHARGE_TARIFFS_SUCCESS;

  constructor(public payload: any) {
  }
}

// Delete
export const DELETE_ADDITIONAL_CHARGE_VERSION = '[Building Tariffs Assignment] DELETE_ADDITIONAL_CHARGE_VERSION';
export const DELETE_ADDITIONAL_CHARGE_VERSION_SUCCESS = '[Building Tariffs Assignment] DELETE_ADDITIONAL_CHARGE_VERSION_SUCCESS';

export class DeleteAdditionalChargeVersion implements StoreAction {
  readonly type = DELETE_ADDITIONAL_CHARGE_VERSION;

  constructor(public payload: string) {
  }
}

export class DeleteAdditionalChargeVersionSuccess implements StoreAction {
  readonly type = DELETE_ADDITIONAL_CHARGE_VERSION_SUCCESS;

  constructor(public payload: any) {
  }
}

export const DELETE_ADDITIONAL_CHARGE_VALUE = '[Building Tariffs Assignment] DELETE_ADDITIONAL_CHARGE_VALUE';
export const DELETE_ADDITIONAL_CHARGE_VALUE_SUCCESS = '[Building Tariffs Assignment] DELETE_ADDITIONAL_CHARGE_VALUE_SUCCESS';

export class DeleteAdditionalChargeValue implements StoreAction {
  readonly type = DELETE_ADDITIONAL_CHARGE_VALUE;

  constructor(public payload: { chargeId: string, valueId: string }) {
  }
}

export class DeleteAdditionalChargeValueSuccess implements StoreAction {
  readonly type = DELETE_ADDITIONAL_CHARGE_VALUE_SUCCESS;

  constructor(public payload: any) {
  }
}

// Setting
export const SET_ADDITIONAL_CHARGE_ORDER = '[Building Tariffs Assignment] SET_ADDITIONAL_CHARGE_ORDER';

export class SetAdditionalChargeOrder implements StoreAction {
  readonly type = SET_ADDITIONAL_CHARGE_ORDER;

  constructor(public payload: ChargesListOrder) {
  }
}

export const UPDATE_ADDITIONAL_CHARGES = '[Building Tariffs Assignment] UPDATE_ADDITIONAL_CHARGES';

export class UpdateAdditionalCharges implements StoreAction {
  readonly type = UPDATE_ADDITIONAL_CHARGES;

  constructor(public payload: ChargeViewModel[]) {
  }
}

export const SET_CHARGE_VALUE_VERSIONS_ORDER = '[Charge] SET_CHARGE_VALUE_VERSIONS_ORDER';

export class SetChargeValueVersionsOrder implements StoreAction {
  readonly type = SET_CHARGE_VALUE_VERSIONS_ORDER;

  constructor(public payload: OrderVersion) {
  }
}

// Clear
export const PURGE_BUILDING_ADDITIONAL_CHARGES_STORE = '[Building Tariffs Assignment] PURGE_BUILDING_ADDITIONAL_CHARGES_STORE';

export class PurgeBuildingAdditionalChargesStore implements StoreAction {
  readonly type = PURGE_BUILDING_ADDITIONAL_CHARGES_STORE;
}

export type BuildingAdditionalChargesActions =
  | GetBuildingAdditionalCharges
  | GetBuildingAdditionalChargesSuccess
  | GetAdditionalChargeTariffs
  | GetAdditionalChargeTariffsSuccess
  | SetAdditionalChargeOrder
  | UpdateAdditionalCharges
  | DeleteAdditionalChargeVersion
  | DeleteAdditionalChargeVersionSuccess
  | DeleteAdditionalChargeValue
  | DeleteAdditionalChargeValueSuccess
  | SetChargeValueVersionsOrder
  | PurgeBuildingAdditionalChargesStore;
