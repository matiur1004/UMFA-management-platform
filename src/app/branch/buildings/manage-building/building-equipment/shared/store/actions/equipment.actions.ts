import {AutomaticMeterReadingAccountViewModel} from '@app/shared/models';
import {PagingOptions} from '@app/shared/models/paging-options.model';
import {Action as StoreAction} from '@ngrx/store';
import {MeterListFilterParameters, MeterViewModel} from '../../models';

export const REQUEST_EQUIPMENT_LIST = '[Building Equipment] REQUEST_EQUIPMENT_LIST';
export const REQUEST_EQUIPMENT_LIST_COMPLETE = '[Building Equipment] REQUEST_EQUIPMENT_LIST_COMPLETE';

export const UPDATE_EQUIPMENTS = '[Building Equipment] UPDATE_EQUIPMENTS';

export const UPDATE_ORDER = '[Building Equipment] UPDATE_ORDER';
export const UPDATE_LOCATION_FILTER = '[Building Equipment] UPDATE_LOCATION_FILTER';
export const UPDATE_SUPPLY_TYPE_FILTER = '[Building Equipment] UPDATE_SUPPLY_TYPE_FILTER';
export const UPDATE_UNIT_FILTER = '[Building Equipment] UPDATE_UNIT_FILTER';
export const UPDATE_NODE_FILTER = '[Building Equipment] UPDATE_NODE_FILTER';
export const UPDATE_SEARCH_KEY = '[Building Equipment] UPDATE_SEARCH_KEY';

export const CLONE_EQUIPMENT = '[Building Equipment] CLONE_EQUIPMENT';

export const RESET_FORM = '[Building Equipment] RESET_FORM';

export const REQUEST_BRANCH_AMR_ACCOUNTS = '[Building Equipment] REQUEST_BRANCH_AMR_ACCOUNTS';
export const REQUEST_BRANCH_AMR_ACCOUNTS_COMPLETE = '[Building Equipment] REQUEST_BRANCH_AMR_ACCOUNTS_COMPLETE';
export const IS_BUILDING_WITH_AMR_ACCOUNT = '[Building Equipment] IS_BUILDING_WITH_AMR_ACCOUNT';

export class RequestEquipmentList implements StoreAction {
  readonly type = REQUEST_EQUIPMENT_LIST;

  constructor(public payload: PagingOptions<MeterListFilterParameters> = {
    skip: 0, take: 0, requestParameters: new MeterListFilterParameters()
  }) {
  }
}

export class RequestEquipmentListComplete implements StoreAction {
  readonly type = REQUEST_EQUIPMENT_LIST_COMPLETE;

  constructor(public payload: any) {
  }
}

export class UpdateEquipments implements StoreAction {
  readonly type = UPDATE_EQUIPMENTS;

  constructor(public payload: MeterViewModel[]) {
  }
}

export class UpdateOrder implements StoreAction {
  readonly type = UPDATE_ORDER;

  constructor(public payload: any) {
  }
}

export class UpdateLocationFilter implements StoreAction {
  readonly type = UPDATE_LOCATION_FILTER;

  constructor(public payload: any) {
  }
}

export class UpdateSupplyTypeFilter implements StoreAction {
  readonly type = UPDATE_SUPPLY_TYPE_FILTER;

  constructor(public payload: any) {
  }
}

export class UpdateNodeFilter implements StoreAction {
  readonly type = UPDATE_NODE_FILTER;

  constructor(public payload: any) {
  }
}

export class UpdateSearchKey implements StoreAction {
  readonly type = UPDATE_SEARCH_KEY;

  constructor(public payload: any) {
  }
}

export class UpdateUnitFilter implements StoreAction {
  readonly type = UPDATE_UNIT_FILTER;

  constructor(public payload: any) {
  }
}

export class CloneEquipment implements StoreAction {
  readonly type = CLONE_EQUIPMENT;

  constructor(public payload: any) {
  }
}

export class ResetForm implements StoreAction {
  readonly type = RESET_FORM;

  constructor() {
  }
}

export class RequestBranchAmrAccounts implements StoreAction {
  readonly type = REQUEST_BRANCH_AMR_ACCOUNTS;

  constructor(public payload: string) {
  }
}

export class RequestBranchAmrAccountsComplete implements StoreAction {
  readonly type = REQUEST_BRANCH_AMR_ACCOUNTS_COMPLETE;

  constructor(public payload: AutomaticMeterReadingAccountViewModel[]) {
  }
}

export class IsBuildingWithAmrAccount implements StoreAction {
  readonly type = IS_BUILDING_WITH_AMR_ACCOUNT;

  constructor(public payload: boolean) {
  }
}

export type Action = RequestEquipmentList
  | RequestEquipmentListComplete
  | UpdateLocationFilter
  | UpdateNodeFilter
  | UpdateOrder
  | UpdateSearchKey
  | UpdateSupplyTypeFilter
  | UpdateUnitFilter
  | CloneEquipment
  | ResetForm
  | UpdateEquipments
  | RequestBranchAmrAccounts
  | RequestBranchAmrAccountsComplete
  | IsBuildingWithAmrAccount;
