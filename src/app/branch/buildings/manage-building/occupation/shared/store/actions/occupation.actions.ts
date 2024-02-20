import {Action as StoreAction} from '@ngrx/store';
import {CommonAreaShopRelationsViewModel} from '../../models';
import {
  CommonAreaLiabilityViewModel,
  CommonAreaViewModel,
  ShopViewModel,
  TenantViewModel,
  VersionActionType
} from '@models';
import {BuildingPeriodViewModel} from 'app/branch/buildings/manage-building/shared/models/building-period.model';

export const SAVE_OCCUPATION = '[OCCUPATION] SAVE_OCCUPATION';
export const UPDATE_OCCUPATION = '[OCCUPATION] UPDATE_OCCUPATION';
export const GET_OCCUPATION = '[OCCUPATION] REQUEST_OCCUPATION';
export const GET_OCCUPATION_COMPLETE = '[OCCUPATION] REQUEST_OCCUPATION_COMPLETE';

export const SET_SHOPS = '[OCCUPATION] SET_SHOPS';
export const ADD_SHOP = '[OCCUPATION] ADD_SHOP';
export const UPDATE_SHOP = '[OCCUPATION] UPDATE_SHOP';
export const DELETE_SHOP = '[OCCUPATION] DELETE_SHOP';
export const SAVE_SHOPS = '[OCCUPATION] SAVE_SHOPS';
export const RETURN_DEFAULT_SHOPS = '[OCCUPATION] RETURN_DEFAULT_SHOPS';

export const SET_VACANT_STATUS_FOR_MULTIPLE_SHOPS = '[OCCUPATION] SET_VACANT_STATUS_FOR_MULTIPLE_SHOPS';
export const SET_SPARE_STATUS_FOR_MULTIPLE_SHOPS = '[OCCUPATION] SET_SPARE_STATUS_FOR_MULTIPLE_SHOPS';
export const SET_UNSPARE_STATUS_FOR_MULTIPLE_SHOPS = '[OCCUPATION] SET_UNSPARE_STATUS_FOR_MULTIPLE_SHOPS';
export const MERGE_SHOPS = '[OCCUPATION] MERGE_SHOPS';
export const SPLIT_SHOP = '[OCCUPATION] SPLIT_SHOP';
export const UPDATE_SHOP_STATUS_FILTER = '[OCCUPATION] UPDATE_SHOP_STATUS_FILTER';
export const UPDATE_SHOP_TENANT_DETAILS = '[OCCUPATION] UPDATE_SHOP_TENANT_DETAILS';

export const WIZARD_STEP_CHANGED = '[OCCUPATION] WIZARD_STEP_CHANGED';
export const ADD_COMMON_AREA_SHOP = '[OCCUPATION] ADD_COMMON_AREA_SHOP';
export const DELETE_COMMON_AREA_SHOP = '[OCCUPATION] DELETE_COMMON_AREA_SHOP';
export const RETURN_DEFAULT_AREA = '[OCCUPATION] RETURN_DEFAULT_AREA';
export const UPDATE_SHOP_SEARCH_TERM = '[OCCUPATION] UPDATE_SHOP_SEARCH_TERM';
export const UPDATE_COMMON_AREA_SEARCH_TERM = '[OCCUPATION] UPDATE_COMMON_AREA_SEARCH_TERM';
export const SAVE_COMMON_AREA = '[OCCUPATION] SAVE_COMMON_AREA';
export const UPDATE_SHOP_CONNECT_FILTER = '[OCCUPATION] UPDATE_SHOP_CONNECT_FILTER';
export const CHECK_ALL_COMMON_AREA_SHOPS = '[OCCUPATION] CHECK_ALL_COMMON_AREA_SHOPS';
export const UNCHECK_ALL_COMMON_AREA_SHOPS = '[OCCUPATION] UNCHECK_ALL_COMMON_AREA_SHOPS';
export const CHECK_ALL_SHOP_COMMON_AREAS = '[OCCUPATION] CHECK_ALL_SHOP_COMMON_AREAS';
export const UNCHECK_ALL_SHOP_COMMON_AREAS = '[OCCUPATION] UNCHECK_ALL_SHOP_COMMON_AREAS';
export const UPDATE_RELATIONSHIP_DATA = '[OCCUPATION] UPDATE_RELATIONSHIP_DATA';

export const ADD_COMMON_AREA = '[OCCUPATION] ADD_COMMON_AREA';
export const ADD_COMMON_AREAS = '[OCCUPATION] ADD_COMMON_AREAS';
export const UPDATE_COMMON_AREA = '[OCCUPATION] UPDATE_COMMON_AREA';
export const DELETE_COMMON_AREA = '[OCCUPATION] DELETE_COMMON_AREA';
export const REMOVE_COMMON_AREA = '[OCCUPATION] REMOVE_COMMON_AREA';
export const UPDATE_COMMON_SERVICE_LIABILITY = '[OCCUPATION] UPDATE_COMMON_SERVICE_LIABILITY';
export const COMMON_AREA_LIABILITY_SELECTED = '[OCCUPATION] COMMON_AREA_LIABILITY_SELECTED';
export const COMMON_AREA_LIABILITY_SERVICE_SELECTED = '[OCCUPATION] COMMON_AREA_LIABILITY_SERVICE_SELECTED';
export const UPDATE_OWNER_LIABILITY_FOR_SERVICE = '[OCCUPATION] UPDATE_OWNER_LIABILITY_FOR_SERVICE';
export const UPDATE_INCLUDE_NOT_LIABLE_SHOPS_CHANGED_FOR_SERVICE = '[OCCUPATION] UPDATE_INCLUDE_NOT_LIABLE_SHOPS_CHANGED_FOR_SERVICE';
export const UPDATE_INCLUDE_VACANT_SHOP_SQM_CHANGED_FOR_SERVICE = '[OCCUPATION] UPDATE_INCLUDE_VACANT_SHOP_SQM_CHANGED_FOR_SERVICE';
export const UPDATE_LIABILITY_DEFAULT_SETTINGS = '[OCCUPATION] UPDATE_LIABILITY_DEFAULT_SETTINGS';
export const UPDATE_SHOP_ALLOCATION = '[OCCUPATION] UPDATE_SHOP_ALLOCATION';
export const UPDATE_LIABILITY_SHOP_SEARCH_TERM = '[OCCUPATION] UPDATE_LIABILITY_SHOP_SEARCH_TERM';
export const UPDATE_LIABILITY_SHOP_FILTER = '[OCCUPATION] UPDATE_LIABILITY_SHOP_FILTER';
export const UPDATE_LIABLITY_SPLIT = '[OCCUPATION] UPDATE_LIABLITY_SPLIT';
export const UPDATE_SHOP_LIABLE = '[OCCUPATION] UPDATE_SHOP_LIABLE';
export const UPDATE_COMMON_AREA_LIABILITY = '[OCCUPATION] UPDATE_COMMON_AREA_LIABILITY';
export const RESET_FILTERS = '[OCCUPATION] RESET_FILTERS';
export const FULL_RECALC_PROPORTIONS = '[OCCUPATION] FULL_RECALC_PROPORTIONS';
export const FULL_RECALC_PROPORTIONS_COMPLETE = '[OCCUPATION] FULL_RECALC_PROPORTIONS_COMPLETE';
export const UPDATE_SHOP_ALLOCATION_BY_SERVICE = '[OCCUPATION] UPDATE_SHOP_ALLOCATION_BY_SERVICE';
export const UPDATE_SHOP_LIABLE_BY_SERVICE = '[OCCUPATION] UPDATE_SHOP_LIABLE_BY_SERVICE';
export const UPDATE_COMMENT = '[OCCUPATION] UPDATE_COMMENT';
export const OCCUPATION_CANCEL_PRESS = '[OCCUPATION] OCCUPATION_CANCEL_PRESS';

export const ADD_ALL_COMMON_AREA_SHOP_BY_SHOP = '[OCCUPATION] ADD_ALL_COMMON_AREA_SHOP_BY_SHOP';
export const DELETE_ALL_COMMON_AREA_SHOP_BY_SHOP = '[OCCUPATION] DELETE_ALL_COMMON_AREA_SHOP_BY_SHOP';
export const ADD_ALL_COMMON_AREA_SHOP_BY_COMMON_AREA = '[OCCUPATION] ADD_ALL_COMMON_AREA_SHOP_BY_COMMON_AREA';
export const DELETE_ALL_COMMON_AREA_SHOP_BY_COMMON_AREA = '[OCCUPATION] DELETE_ALL_COMMON_AREA_SHOP_BY_COMMON_AREA';
export const RECALC_COMMON_AREA_GROUP_COMPLETE = '[OCCUPATION] RECALC_COMMON_AREA_GROUP_COMPLETE';
export const RECALC_SHOP_GROUP_COMPLETE = '[OCCUPATION] RECALC_SHOP_GROUP_COMPLETE';
export const UPDATE_COMPLEX_LIABILITY_SHOP_FILTER = '[OCCUPATION] UPDATE_COMPLEX_LIABILITY_SHOP_FILTER';
export const SET_TENANTS = '[OCCUPATION] SET_TENANTS';
export const GET_TENANTS = '[OCCUPATION] GET_TENANTS';

export const GET_HISTORY_REQUEST = '[OCCUPATION] GET_HISTORY_REQUEST';
export const GET_HISTORY_REQUEST_COMPLETE = '[OCCUPATION] GET_HISTORY_REQUEST_COMPLETE';
export const HISTORY_CHANGE = '[OCCUPATION] HISTORY_CHANGE';
export const UPDATE_DATE = '[OCCUPATION] UPDATE_DATE';
export const DUMMY_ACTION = '[OCCUPATION] DUMMY_ACTION';
export const UPDATE_COMMON_AREA_SERVICE_SPLIT = '[OCCUPATION] UPDATE_COMMON_AREA_SERVICE_SPLIT';
export const RECALC_ALL_PROPORTION_REQUEST = '[OCCUPATION]RECALC_ALL_PROPORTION_REQUEST';

export const SELECTED_COMMON_AREA_LIABILITY_BY_ID = '[OCCUPATION] SELECTED_COMMON_AREA_LIABILITY_BY_ID';

export const INIT_LIABILITIES_BY_COMMON_AREA_SERVICES = '[OCCUPATION] INIT_LIABILITIES_BY_COMMON_AREA_SERVICES';
export const INIT_LIABILITIES_BY_COMMON_AREA_SERVICES_COMPLETE = '[OCCUPATION] INIT_LIABILITIES_BY_COMMON_AREA_SERVICES_COMPLETE';

export const UPDATE_COMMON_AREA_SERVICES = '[OCCUPATION] UPDATE_COMMON_AREA_SERVICES';

export const ADD_TENANT = '[OCCUPATION] ADD_TENANT';
export const ADD_TENANT_SUCCESS = '[OCCUPATION] ADD_TENANT_SUCCESS';

export const REQUEST_GET_SHOP_HISTORY = '[OCCUPATION] REQUEST_GET_SHOP_HISTORY';
export const REQUEST_GET_SHOP_HISTORY_COMPLETE = '[OCCUPATION] REQUEST_GET_SHOP_HISTORY_COMPLETE';
export const SHOP_HISTORY_CLOSE = '[OCCUPATION] SHOP_HISTORY_CLOSE';

export const UPDATE_SHOP_ORDER = 'UPDATE_SHOP_ORDER';
export const UPDATE_COMMON_AREA_ORDER = 'UPDATE_COMMON_AREA_ORDER';

export const VERSION_CHANGE = '[OCCUPATION] VERSION_CHANGE';
export const UPDATE_BUILDING_PERIOD = '[OCCUPATION] UPDATE_BUILDING_PERIOD';

export class Get implements StoreAction {
  readonly type = GET_OCCUPATION;

  constructor(public payload: any) {
  }
}

export class SetShops implements StoreAction {
  readonly type = SET_SHOPS;

  constructor(public payload: any) {
  }
}


export class SetTenants implements StoreAction {
  readonly type = SET_TENANTS;

  constructor() {
  }
}

export class GetTenants implements StoreAction {
  readonly type = GET_TENANTS;

  constructor(public payload: any) {
  }
}

export class AddShop implements StoreAction {
  readonly type = ADD_SHOP;

  constructor() {
  }
}

export class UpdateShop implements StoreAction {
  readonly type = UPDATE_SHOP;

  constructor(public payload: {
    id: string,
    path: string,
    value: any
  }) {
  }
}

export class ReturnDefaultFormShopValue implements StoreAction {
  readonly type = RETURN_DEFAULT_SHOPS;

  constructor(public payload: { shopIds: string[], defaultShops: ShopViewModel[] }) {
  }
}

export class SaveShops implements StoreAction {
  readonly type = SAVE_SHOPS;

  constructor(public payload: {
    action: VersionActionType,
    comment: string,
    startDate: Date | null
  }) {
  }
}

export class DeleteShop implements StoreAction {
  readonly type = DELETE_SHOP;

  constructor(public payload: string) {
  }
}

export class AddCommonArea implements StoreAction {
  readonly type = ADD_COMMON_AREA;

  constructor(public payload: string) {
  }
}

export class AddCommonAreas implements StoreAction {
  readonly type = ADD_COMMON_AREAS;

  constructor(public payload: string) {
  }
}

export class UpdateCommonArea implements StoreAction {
  readonly type = UPDATE_COMMON_AREA;

  constructor(public payload: {
    id: string,
    path: string,
    value: any
  }) {
  }
}

export class ReturnDefaultFormAreaValue implements StoreAction {
  readonly type = RETURN_DEFAULT_AREA;

  constructor(public payload: { areaIds: string[], defaultAreas: CommonAreaViewModel[] }) {
  }
}

export class DeleteCommonArea implements StoreAction {
  readonly type = DELETE_COMMON_AREA;

  constructor(public payload: string) {
  }
}

export class RemoveCommonArea implements StoreAction {
  readonly type = REMOVE_COMMON_AREA;

  constructor(public payload: string) {
  }
}

export class SaveCommonArea implements StoreAction {
  readonly type = SAVE_COMMON_AREA;

  constructor(public payload: {
    action: VersionActionType,
    comment: string,
    startDate: Date | null
  }) {
  }
}

export class ChangeStep implements StoreAction {
  readonly type = WIZARD_STEP_CHANGED;

  constructor(public payload: number) {
  }
}

export class CommonAreaLiabilitySelected implements StoreAction {
  readonly type = COMMON_AREA_LIABILITY_SELECTED;

  constructor(public payload: string) {
  }
}

export class SaveOccupation implements StoreAction {
  readonly type = SAVE_OCCUPATION;

  constructor(public payload: {
    action: VersionActionType,
    comment: string,
    startDate: Date | null
  }) {
  }
}

export class UpdateOccupation implements StoreAction {
  readonly type = UPDATE_OCCUPATION;

  constructor(public payload: {
    action: VersionActionType,
    comment: string,
    startDate: Date | null
  }) {
  }
}

export class AddCommonAreaShop implements StoreAction {
  readonly type = ADD_COMMON_AREA_SHOP;

  constructor(public payload: {
    commonAreaId: string,
    shopId: string
  }) {
  }
}

export class DeleteCommonAreaShop implements StoreAction {
  readonly type = DELETE_COMMON_AREA_SHOP;

  constructor(public payload: {
    commonAreaId: string,
    shopId: string
  }) {
  }
}

export class UpdateShopSearchTerm implements StoreAction {
  readonly type = UPDATE_SHOP_SEARCH_TERM;

  constructor(public payload: string) {
  }
}

export class UpdateCommonAreaSearchTerm implements StoreAction {
  readonly type = UPDATE_COMMON_AREA_SEARCH_TERM;

  constructor(public payload: string) {
  }
}

export class UpdateShopConnectFilter implements StoreAction {
  readonly type = UPDATE_SHOP_CONNECT_FILTER;

  constructor(public payload: number) {
  }
}

export class CheckAllCommonAreaShops implements StoreAction {
  readonly type = CHECK_ALL_COMMON_AREA_SHOPS;

  constructor(public payload: string) {
  }
}

export class UncheckAllCommonAreaShops implements StoreAction {
  readonly type = UNCHECK_ALL_COMMON_AREA_SHOPS;

  constructor(public payload: string) {
  }
}

export class CheckAllShopCommonAreas implements StoreAction {
  readonly type = CHECK_ALL_SHOP_COMMON_AREAS;

  constructor(public payload: string) {
  }
}

export class UncheckAllShopCommonAreas implements StoreAction {
  readonly type = UNCHECK_ALL_SHOP_COMMON_AREAS;

  constructor(public payload: string) {
  }
}

export class UpdateRelationShipData implements StoreAction {
  readonly type = UPDATE_RELATIONSHIP_DATA;

  constructor(public payload: CommonAreaShopRelationsViewModel[]) {
  }
}

export class SetVacantStatusForShops implements StoreAction {
  readonly type = SET_VACANT_STATUS_FOR_MULTIPLE_SHOPS;

  constructor(public payload: string[]) {
  }
}

export class SetSpareStatusForShops implements StoreAction {
  readonly type = SET_SPARE_STATUS_FOR_MULTIPLE_SHOPS;

  constructor(public payload: string[]) {
  }
}

export class SetUnspareStatusForShops implements StoreAction {
  readonly type = SET_UNSPARE_STATUS_FOR_MULTIPLE_SHOPS;

  constructor(public payload: string[]) {
  }
}

export class MergeShops implements StoreAction {
  readonly type = MERGE_SHOPS;

  constructor(public payload: string[]) {
  }
}

export class SplitShop implements StoreAction {
  readonly type = SPLIT_SHOP;

  constructor(public payload: any) {
  }
}

export class UpdateShopStatusFilter implements StoreAction {
  readonly type = UPDATE_SHOP_STATUS_FILTER;

  constructor(public payload: any) {
  }
}

export class CommonAreaLiabilityServiceSelected implements StoreAction {
  readonly type = COMMON_AREA_LIABILITY_SERVICE_SELECTED;

  constructor(public payload: number) {
  }
}

export class UpdateOwnerLiabilityForService implements StoreAction {
  readonly type = UPDATE_OWNER_LIABILITY_FOR_SERVICE;

  constructor(public payload: boolean) {
  }
}

export class UpdateIncludeNotLiableShopsChangedForService implements StoreAction {
  readonly type = UPDATE_INCLUDE_NOT_LIABLE_SHOPS_CHANGED_FOR_SERVICE;

  constructor(public payload: boolean) {
  }
}

export class UpdateIncludeVacantShopSqMChangedForService implements StoreAction {
  readonly type = UPDATE_INCLUDE_VACANT_SHOP_SQM_CHANGED_FOR_SERVICE;

  constructor(public payload: boolean) {
  }
}

export class UpdateLiabilityDefaultSetting implements StoreAction {
  readonly type = UPDATE_LIABILITY_DEFAULT_SETTINGS;

  constructor(public payload: boolean) {
  }
}

export class UpdateShopAllocation implements StoreAction {
  readonly type = UPDATE_SHOP_ALLOCATION;

  constructor(public payload: {
    id: string,
    allocation: any
  }) {
  }
}

export class UpdateLiabilityShopSearchTerm implements StoreAction {
  readonly type = UPDATE_LIABILITY_SHOP_SEARCH_TERM;

  constructor(public payload: string) {
  }
}

export class UpdateLiabilityShopFilter implements StoreAction {
  readonly type = UPDATE_LIABILITY_SHOP_FILTER;

  constructor(public payload: number) {
  }
}

export class UpdateLiabilitySplit implements StoreAction {
  readonly type = UPDATE_LIABLITY_SPLIT;

  constructor(public payload: number) {
  }
}

export class UpdateShopLiable implements StoreAction {
  readonly type = UPDATE_SHOP_LIABLE;

  constructor(public payload: { shopId: string, value: boolean }) {
  }
}

export class UpdateCommonAreaLiability implements StoreAction {
  readonly type = UPDATE_COMMON_AREA_LIABILITY;

  constructor(public payload: CommonAreaLiabilityViewModel) {
  }
}

export class GetOccupationComplete implements StoreAction {
  readonly type = GET_OCCUPATION_COMPLETE;

  constructor(public payload: any) {
  }
}

export class ResetFilters implements StoreAction {
  readonly type = RESET_FILTERS;

  constructor() {
  }
}

export class FullRecalcProportions implements StoreAction {
  readonly type = FULL_RECALC_PROPORTIONS;

  constructor() {
  }
}

export class FullRecalcProportionsComplete implements StoreAction {
  readonly type = FULL_RECALC_PROPORTIONS_COMPLETE;

  constructor(public payload: any) {
  }
}

export class UpdateCommonServiceLiability implements StoreAction {
  readonly type = UPDATE_COMMON_SERVICE_LIABILITY;

  constructor(public payload: any) {
  }
}

export class UpdateShopAllocationByService implements StoreAction {
  readonly type = UPDATE_SHOP_ALLOCATION_BY_SERVICE;

  constructor(public payload: any) {
  }
}

export class UpdateShopLiableByService implements StoreAction {
  readonly type = UPDATE_SHOP_LIABLE_BY_SERVICE;

  constructor(public payload: any) {
  }
}

export class AddAllCommonAreaShopByShop implements StoreAction {
  readonly type = ADD_ALL_COMMON_AREA_SHOP_BY_SHOP;

  constructor(public payload: any) {
  }
}

export class RecalcCommonAreaGroupComplete implements StoreAction {
  readonly type = RECALC_COMMON_AREA_GROUP_COMPLETE;

  constructor(public payload: any) {
  }
}

export class DeleteAllCommonAreaShopByShop implements StoreAction {
  readonly type = DELETE_ALL_COMMON_AREA_SHOP_BY_SHOP;

  constructor(public payload: any) {
  }
}

export class RecalcShopGroupProportions implements StoreAction {
  readonly type = RECALC_SHOP_GROUP_COMPLETE;

  constructor(public payload: any) {
  }
}

export class AddAllCommonAreaShopByCommonArea implements StoreAction {
  readonly type = ADD_ALL_COMMON_AREA_SHOP_BY_COMMON_AREA;

  constructor(public payload: any) {
  }
}

export class DeleteAllCommonAreaShopByCommonArea implements StoreAction {
  readonly type = DELETE_ALL_COMMON_AREA_SHOP_BY_COMMON_AREA;

  constructor(public payload: any) {
  }
}

export class UpdateComplexLiabilityShopFilter implements StoreAction {
  readonly type = UPDATE_COMPLEX_LIABILITY_SHOP_FILTER;

  constructor(public payload: any) {
  }
}

export class UpdateComment implements StoreAction {
  readonly type = UPDATE_COMMENT;

  constructor(public payload: string) {
  }
}

export class OccupationCancel implements StoreAction {
  readonly type = OCCUPATION_CANCEL_PRESS;

  constructor() {
  }
}

export class GetHistoryRequest implements StoreAction {
  readonly type = GET_HISTORY_REQUEST;

  constructor(public payload: any) {
  }
}

export class GetHistoryRequestComplete implements StoreAction {
  readonly type = GET_HISTORY_REQUEST_COMPLETE;

  constructor(public payload: any) {
  }
}

export class HistoryChange implements StoreAction {
  readonly type = HISTORY_CHANGE;

  constructor(public payload: string) {
  }
}

export class UpdateDate implements StoreAction {
  readonly type = UPDATE_DATE;

  constructor(public payload: Date) {
  }
}

export class InitLiabilitiesByCommonAreaServices implements StoreAction {
  readonly type = INIT_LIABILITIES_BY_COMMON_AREA_SERVICES;

  constructor() {
  }
}

export class InitLiabilitiesByCommonAreaServicesComplete implements StoreAction {
  readonly type = INIT_LIABILITIES_BY_COMMON_AREA_SERVICES_COMPLETE;

  constructor(public payload: any) {
  }
}

export class UpdateCommonAreaServices implements StoreAction {
  readonly type = UPDATE_COMMON_AREA_SERVICES;

  constructor(public payload: {
    id: string,
    path: string,
    value: any
  }) {
  }
}

export class UpdateCommonAreaServiceSplit implements StoreAction {
  readonly type = UPDATE_COMMON_AREA_SERVICE_SPLIT;

  constructor(public payload: any) {
  }
}

export class RecalcAllProportionsRequest implements StoreAction {
  readonly type = RECALC_ALL_PROPORTION_REQUEST;

  constructor() {
  }
}

export class DummyAction implements StoreAction {
  readonly type = DUMMY_ACTION;

  constructor() {
  }
}

export class UpdateShopRentDetails implements StoreAction {
  readonly type = UPDATE_SHOP_TENANT_DETAILS;

  constructor(public payload: any) {
  }
}

export class SelectedCommonAreaLiabilityById implements StoreAction {
  readonly type = SELECTED_COMMON_AREA_LIABILITY_BY_ID;

  constructor(public payload: any) {
  }
}

export class AddTenant implements StoreAction {
  readonly type = ADD_TENANT;

  constructor(public payload: TenantViewModel) {
  }
}

export class AddTenantSuccess implements StoreAction {
  readonly type = ADD_TENANT_SUCCESS;

  constructor(public payload: TenantViewModel) {
  }
}

export class RequestGetShopHistory implements StoreAction {
  readonly type = REQUEST_GET_SHOP_HISTORY;

  constructor(public payload: any) {
  }
}

export class RequestGetShopHistoryComplete implements StoreAction {
  readonly type = REQUEST_GET_SHOP_HISTORY_COMPLETE;

  constructor(public payload: any) {
  }
}

export class ShopHistoryClose implements StoreAction {
  readonly type = SHOP_HISTORY_CLOSE;

  constructor(public payload: any) {
  }
}

export class UpdateShopOrder implements StoreAction {
  readonly type = UPDATE_SHOP_ORDER;

  constructor(public payload: any) {
  }
}

export class UpdateCommonAreaOrder implements StoreAction {
  readonly type = UPDATE_COMMON_AREA_ORDER;

  constructor(public payload: any) {
  }
}

export class VersionChangeResult implements StoreAction {
  readonly type = VERSION_CHANGE;

  constructor(public payload: any) {
  }
}

export class UpdateBuildingPeriod implements StoreAction {
  readonly type = UPDATE_BUILDING_PERIOD;

  constructor(public payload: BuildingPeriodViewModel) {
  }
}

export type Action =
  Get
  | SetShops
  | AddShop
  | UpdateShop
  | DeleteShop
  | AddCommonAreaShop
  | DeleteCommonAreaShop
  | UpdateShopSearchTerm
  | UpdateCommonAreaSearchTerm
  | UpdateShopConnectFilter
  | CheckAllCommonAreaShops
  | UncheckAllCommonAreaShops
  | CheckAllShopCommonAreas
  | UncheckAllShopCommonAreas
  | UpdateRelationShipData
  | SaveOccupation
  | UpdateOccupation
  | AddCommonArea
  | UpdateCommonArea
  | DeleteCommonArea
  | SetVacantStatusForShops
  | SetSpareStatusForShops
  | SetUnspareStatusForShops
  | MergeShops
  | SplitShop
  | UpdateShopStatusFilter
  | ChangeStep
  | CommonAreaLiabilitySelected
  | UpdateOwnerLiabilityForService
  | UpdateIncludeNotLiableShopsChangedForService
  | UpdateIncludeVacantShopSqMChangedForService
  | UpdateShopAllocation
  | CommonAreaLiabilityServiceSelected
  | UpdateLiabilityShopSearchTerm
  | UpdateLiabilityShopFilter
  | UpdateLiabilitySplit
  | UpdateShopLiable
  | UpdateCommonAreaLiability
  | AddCommonAreas
  | GetOccupationComplete
  | ResetFilters
  | FullRecalcProportions
  | FullRecalcProportionsComplete
  | UpdateCommonServiceLiability
  | UpdateShopAllocationByService
  | UpdateShopLiableByService
  | RecalcCommonAreaGroupComplete
  | AddAllCommonAreaShopByShop
  | DeleteAllCommonAreaShopByShop
  | AddTenantSuccess
  | AddAllCommonAreaShopByCommonArea
  | DeleteAllCommonAreaShopByCommonArea
  | RecalcShopGroupProportions
  | UpdateComplexLiabilityShopFilter
  | UpdateComment
  | OccupationCancel
  | ReturnDefaultFormShopValue
  | ReturnDefaultFormAreaValue
  | GetHistoryRequest
  | GetHistoryRequestComplete
  | HistoryChange
  | UpdateDate
  | GetTenants
  | SetTenants
  | InitLiabilitiesByCommonAreaServices
  | InitLiabilitiesByCommonAreaServicesComplete
  | UpdateCommonAreaServices
  | DummyAction
  | UpdateShopRentDetails
  | UpdateCommonAreaServiceSplit
  | RecalcAllProportionsRequest
  | UpdateLiabilityDefaultSetting
  | SelectedCommonAreaLiabilityById
  | AddTenant
  | RequestGetShopHistory
  | RequestGetShopHistoryComplete
  | ShopHistoryClose
  | UpdateShopOrder
  | UpdateCommonAreaOrder
  | VersionChangeResult
  | UpdateBuildingPeriod
  | SaveCommonArea
  | SaveShops
  | RemoveCommonArea;
