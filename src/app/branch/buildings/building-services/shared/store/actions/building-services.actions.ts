import {Action as StoreAction} from '@ngrx/store';

export const UPDATE_BUILDING_ID = '[Building Services] UPDATE_BUILDING_ID';

export const GET_BUILDING_SERVICES_STATUS = '[Building Services] GET_BUILDING_SERVICES_STATUS';
export const GET_BUILDING_SERVICES_APPLIED = '[Building Services] GET_BUILDING_SERVICES_APPLIED';
export const UPDATE_IS_COMPLETED = '[Building Services] UPDATE_IS_COMPLETED';

export const GET_PACKAGES_REQUEST = '[Building Services] GET_PACKAGES_REQUEST';
export const GET_PACKAGES_REQUEST_COMPLETE = '[Building Services] GET_PACKAGES_REQUEST_COMPLETE';

export const GET_PACKAGE_DETAILS_REQUEST = '[Building Services] GET_PACKAGE_DETAILS_REQUEST';
export const GET_PACKAGE_DETAILS_REQUEST_COMPLETE = '[Building Services] GET_PACKAGE_DETAILS_REQUEST_COMPLETE';

export const UPDATE_SERVICE_STATUS = '[Building Services] UPDATE_SERVICE_STATUS';
export const SAVE_SERVICES = '[Building Services] SAVE_SERVICES';

export const TOGGLE_DISPLAY_PRICE = '[Building Services] TOGGLE_DISPLAY_PRICE';
export const TOGGLE_SERVICE_EXPAND = '[Building Services] TOGGLE_SERVICE_EXPAND';
export const UPDATE_SERVICE_FILTER = '[Building Services] UPDATE_SERVICE_FILTER';

export const UPDATE_PACKAGES_SEARCH_TERM = '[Building Services] UPDATE_PACKAGES_SEARCH_TERM';
export const UPDATE_PACKAGES_PAGE = '[Building Services] UPDATE_PACKAGES_PAGE';
export const UPDATE_SELECTED_PACKAGE = '[Building Services] UPDATE_SELECTED_PACKAGE';
export const UPDATE_SELECTED_PACKAGE_COMPLETE = '[Building Services] UPDATE_SELECTED_PACKAGE_COMPLETE';
export const UPDATE_PACKAGE_SUPPLY_TYPES = '[Building Services] UPDATE_PACKAGE_SUPPLY_TYPES';
export const UPDATE_PACKAGE_CHARGING_METHOD = '[Building Services] UPDATE_PACKAGE_CHARGING_METHOD';
export const GET_PACKAGE_DETAILS = '[Building Services] GET_PACKAGE_DETAILS';
export const UPDATE_PACKAGE_CATEGORY_FILTER = '[Building Services] UPDATE_PACKAGE_CATEGORY_FILTER';
export const UPDATE_SERVICE_CHARGING_METHOD = '[Building Services] UPDATE_SERVICE_CHARGING_METHOD';
export const UPDATE_SERVICE_VALUE = '[Building Services] UPDATE_SERVICE_VALUE';
export const UPDATE_SERVICE_METER_VALUE = '[Building Services] UPDATE_SERVICE_METER_VALUE';
export const UPDATE_CHARGING_TYPE = '[Building Services] UPDATE_CHARGING_TYPE';

export const RESET_BUILDING_SERVICES = '[Building Services] RESET_BUILDING_SERVICES';

export class GetBuildingSerivcesStatus implements StoreAction {
  readonly type = GET_BUILDING_SERVICES_STATUS;

  constructor() {
  }
}

export class GetBuildingSerivcesApplied implements StoreAction {
  readonly type = GET_BUILDING_SERVICES_APPLIED;

  constructor() {
  }
}

export class GetPackagesRequest implements StoreAction {
  readonly type = GET_PACKAGES_REQUEST;

  constructor() {
  }
}

export class GetPackagesRequestComplete implements StoreAction {
  readonly type = GET_PACKAGES_REQUEST_COMPLETE;

  constructor(public payload: any) {
  }
}

export class GetPackageDetailsRequest implements StoreAction {
  readonly type = GET_PACKAGE_DETAILS_REQUEST;

  constructor(public payload: any) {
  }
}

export class GetPackageDetailsRequestComplete implements StoreAction {
  readonly type = GET_PACKAGE_DETAILS_REQUEST_COMPLETE;

  constructor(public payload: any) {
  }
}

export class UpdateServiceStatus implements StoreAction {
  readonly type = UPDATE_SERVICE_STATUS;

  constructor(public payload: any) {
  }
}

export class ToggleDisplayPrice implements StoreAction {
  readonly type = TOGGLE_DISPLAY_PRICE;

  constructor() {
  }
}

export class ToggleServiceExpand implements StoreAction {
  readonly type = TOGGLE_SERVICE_EXPAND;

  constructor(public payload: any) {
  }
}

export class UpdateServiceFilter implements StoreAction {
  readonly type = UPDATE_SERVICE_FILTER;

  constructor(public payload: any) {
  }
}

export class SaveServices implements StoreAction {
  readonly type = SAVE_SERVICES;

  constructor(public payload: boolean) {
  }
}

export class UpdatePackagesSearchTerm implements StoreAction {
  readonly type = UPDATE_PACKAGES_SEARCH_TERM;

  constructor(public payload: any) {
  }
}

export class UpdatePackagesPage implements StoreAction {
  readonly type = UPDATE_PACKAGES_PAGE;

  constructor(public payload: any) {
  }
}

export class UpdateSelectedPackage implements StoreAction {
  readonly type = UPDATE_SELECTED_PACKAGE;

  constructor(public payload: any) {
  }
}

export class UpdateSelectedPackageComplete implements StoreAction {
  readonly type = UPDATE_SELECTED_PACKAGE_COMPLETE;

  constructor(public payload: any) {
  }
}


export class UpdatePackageSupplyTypes implements StoreAction {
  readonly type = UPDATE_PACKAGE_SUPPLY_TYPES;

  constructor(public payload: any) {
  }
}

export class UpdatePackageChargingMethod implements StoreAction {
  readonly type = UPDATE_PACKAGE_CHARGING_METHOD;

  constructor(public payload: any) {
  }
}

export class UpdatePackageCategoryFilter implements StoreAction {
  readonly type = UPDATE_PACKAGE_CATEGORY_FILTER;

  constructor(public payload: any) {
  }
}

export class UpdateBuildingId implements StoreAction {
  readonly type = UPDATE_BUILDING_ID;

  constructor(public payload: any) {
  };
}

export class UpdateIsCompleted implements StoreAction {
  readonly type = UPDATE_IS_COMPLETED;

  constructor(public payload: any) {
  };
}

export class UpdateServiceChargingMethod implements StoreAction {
  readonly type = UPDATE_SERVICE_CHARGING_METHOD;

  constructor(public payload: any) {
  }
}

export class UpdateServiceValue implements StoreAction {
  readonly type = UPDATE_SERVICE_VALUE;

  constructor(public payload: any) {
  }
}

export class UpdateServiceMeterValue implements StoreAction {
  readonly type = UPDATE_SERVICE_METER_VALUE;

  constructor(public payload: any) {
  }
}

export class UpdateChargingType implements StoreAction {
  readonly type = UPDATE_CHARGING_TYPE;

  constructor(public payload: any) {
  }
}

export class ResetBuildingServices implements StoreAction {
  readonly type = RESET_BUILDING_SERVICES;

  constructor() {
  }
}

export type Action = GetPackagesRequest | GetPackagesRequestComplete
  | GetPackageDetailsRequest | GetPackageDetailsRequestComplete | UpdateServiceStatus
  | ToggleDisplayPrice | ToggleServiceExpand | UpdateServiceFilter
  | SaveServices | UpdatePackagesSearchTerm | UpdatePackagesPage
  | UpdateSelectedPackage | UpdateSelectedPackageComplete
  | UpdatePackageSupplyTypes | UpdatePackageChargingMethod | UpdateBuildingId
  | GetBuildingSerivcesStatus | GetBuildingSerivcesApplied | UpdateIsCompleted
  | UpdatePackageCategoryFilter
  | UpdateServiceChargingMethod | UpdateServiceValue | UpdateServiceMeterValue | UpdateChargingType
  | ResetBuildingServices;
