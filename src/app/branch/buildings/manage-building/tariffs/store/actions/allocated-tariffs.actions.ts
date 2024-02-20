import {Action as StoreAction} from '@ngrx/store';
import {BuildingHistoryViewModel} from '../../../shared/models';
import {AggregatedBuildingTariffViewModel, BuildingDetailViewModel, TariffListOrder} from '@models';

// GET Building Data
export const GET_BUILDING_DATA = '[Building Tariffs Assignment] GET_BUILDING_DATA';
export const GET_BUILDING_DATA_SUCCESS = '[Building Tariffs Assignment] GET_BUILDING_DATA_SUCCESS';
export const GET_BUILDING_DATA_FAILED = '[Building Tariffs Assignment] GET_BUILDING_DATA_FAILED';

export class GetBuildingData implements StoreAction {
  readonly type = GET_BUILDING_DATA;

  /**
   *
   * @param payload Building ID
   */
  constructor(public payload: string) {
  }
}

export class GetBuildingDataSuccess implements StoreAction {
  readonly type = GET_BUILDING_DATA_SUCCESS;

  constructor(public payload: BuildingDetailViewModel) {
  }
}

export class GetBuildingDataFailed implements StoreAction {
  readonly type = GET_BUILDING_DATA_FAILED;

  constructor(public payload: any) {
  }
}

// GET Allocated Tariffs
export const GET_ALLOCATED_BUILDING_TARIFFS = '[Building Tariffs Assignment] GET_ALLOCATED_BUILDING_TARIFFS';
export const GET_ALLOCATED_BUILDING_TARIFFS_SUCCESS = '[Building Tariffs Assignment] GET_ALLOCATED_BUILDING_TARIFFS_SUCCESS';
export const GET_ALLOCATED_BUILDING_TARIFFS_FAILED = '[Building Tariffs Assignment] GET_ALLOCATED_BUILDING_TARIFFS_FAILED';

export class GetAllocatedBuildingTariffs implements StoreAction {
  readonly type = GET_ALLOCATED_BUILDING_TARIFFS;

  constructor(public payload: any) {
  }
}

export class GetAllocatedBuildingTariffsSuccess implements StoreAction {
  readonly type = GET_ALLOCATED_BUILDING_TARIFFS_SUCCESS;

  constructor(public payload: AggregatedBuildingTariffViewModel[]) {
  }
}

export class GetAllocatedBuildingTariffsFailed implements StoreAction {
  readonly type = GET_ALLOCATED_BUILDING_TARIFFS_FAILED;

  constructor(public payload: any) {
  }
}

// GET Allocated Tariffs
export const GET_BUILDING_HISTORY = '[Building Tariffs Assignment] GET_BUILDING_HISTORY';
export const GET_BUILDING_HISTORY_SUCCESS = '[Building Tariffs Assignment] GET_BUILDING_HISTORY_SUCCESS';
export const GET_BUILDING_HISTORY_FAILED = '[Building Tariffs Assignment] GET_BUILDING_HISTORY_FAILED';

export class GetBuildingHistory implements StoreAction {
  readonly type = GET_BUILDING_HISTORY;

  constructor(public payload: { buildingId: string, versionId?: string }) {
  }
}

export class GetBuildingHistorySuccess implements StoreAction {
  readonly type = GET_BUILDING_HISTORY_SUCCESS;

  constructor(public payload: BuildingHistoryViewModel) {
  }
}

export class GetBuildingHistoryFailed implements StoreAction {
  readonly type = GET_BUILDING_HISTORY_FAILED;

  constructor(public payload: any) {
  }
}

// Update
export const UPDATE_ALLOCATED_BUILDING_TARIFFS = '[Building Tariffs Assignment] UPDATE_ALLOCATED_BUILDING_TARIFFS';

export class UpdateAllocatedBuildingTariffs implements StoreAction {
  readonly type = UPDATE_ALLOCATED_BUILDING_TARIFFS;

  constructor(public payload: any) {
  }
}

// SET
export const SET_ALLOCATED_BUILDING_TARIFFS_ORDER = '[Building Tariffs Assignment] SET_ALLOCATED_BUILDING_TARIFFS_ORDER';

export class SetAllocatedBuildingTariffsOrder implements StoreAction {
  readonly type = SET_ALLOCATED_BUILDING_TARIFFS_ORDER;

  constructor(public payload: TariffListOrder) {
  }
}

export const SET_ALLOCATED_BUILDING_TARIFFS_BY_SUPPLY_FILTER = '[Building Tariffs Assignment] SET_ALLOCATED_BUILDING_TARIFFS_BY_SUPPLY_FILTER';

export class SetAllocatedBuildingTariffsBySupplyFilter implements StoreAction {
  readonly type = SET_ALLOCATED_BUILDING_TARIFFS_BY_SUPPLY_FILTER;

  constructor(public payload: { supplyType: number, supplierId: string }) {
  }
}

// DELETE Allocated Supplier
export const DELETE_ALLOCATED_BUILDING_TARIFF = '[Building Tariffs Assignment] DELETE_ALLOCATED_BUILDING_TARIFF';
export const DELETE_ALLOCATED_BUILDING_TARIFF_SUCCESS = '[Building Tariffs Assignment] DELETE_ALLOCATED_BUILDING_TARIFF_SUCCESS';
export const DELETE_ALLOCATED_BUILDING_TARIFF_FAILED = '[Building Tariffs Assignment] DELETE_ALLOCATED_BUILDING_TARIFF_FAILED';

export class DeleteAllocatedBuildingTariff implements StoreAction {
  readonly type = DELETE_ALLOCATED_BUILDING_TARIFF;

  constructor(public payload: string) {
  }
}

export class DeleteAllocatedBuildingTariffSuccess implements StoreAction {
  readonly type = DELETE_ALLOCATED_BUILDING_TARIFF_SUCCESS;

  constructor(public payload: any) {
  }
}

export class DeleteAllocatedBuildingTariffFailed implements StoreAction {
  readonly type = DELETE_ALLOCATED_BUILDING_TARIFF_FAILED;

  constructor(public payload: any) {
  }
}

// Clear
export const PURGE_ALLOCATED_BUILDING_TARIFFS_STORE = '[Building Tariffs Assignment] PURGE_ALLOCATED_BUILDING_TARIFFS_STORE';

export class PurgeAllocatedBuildingTariffsStore implements StoreAction {
  readonly type = PURGE_ALLOCATED_BUILDING_TARIFFS_STORE;
}

export type AllocatedBuildingTariffsActions =
  | GetBuildingData
  | GetBuildingDataSuccess
  | GetBuildingDataFailed
  | GetAllocatedBuildingTariffs
  | GetAllocatedBuildingTariffsSuccess
  | GetAllocatedBuildingTariffsFailed
  | GetBuildingHistory
  | GetBuildingHistorySuccess
  | GetBuildingHistoryFailed
  | UpdateAllocatedBuildingTariffs
  | SetAllocatedBuildingTariffsBySupplyFilter
  | SetAllocatedBuildingTariffsOrder
  | DeleteAllocatedBuildingTariff
  | DeleteAllocatedBuildingTariffSuccess
  | DeleteAllocatedBuildingTariffFailed
  | PurgeAllocatedBuildingTariffsStore;
