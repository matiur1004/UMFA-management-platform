import {Action as StoreAction} from '@ngrx/store';
import {
  AllocatedNodeDetailViewModel,
  AllocatedUnitViewModel,
  ChildNodeAssignmentViewModel,
  NodeDetailViewModel,
  SearchFilterUnits,
  SearchFilterUnitsModel
} from '../../models';
import {SplitType, SupplyToViewModel} from '@models';

export const REQUEST_NODE_LIST = '[Building Equipment Node] REQUEST_NODE_LIST ';
export const ADD_REGISTERS_TO_UNITS = '[Building Equipment Node] ADD_REGISTERS_TO_UNITS ';
export const TOGGLE_NODE_INFO = '[Building Equipment Node] TOGGLE_NODE_INFO ';
export const REQUEST_NODE_LIST_COMPLETE = '[Building Equipment Node] REQUEST_NODE_LIST_COMPLETE';
export const UPDATE_NODE = '[Building Equipment Node] UPDATE_NODE';
export const DELETE_NODE = '[Building Equipment Node] DELETE_NODE';
export const API_REQUEST_CREATE_NODE = '[Building Equipment Node] API_REQUEST_CREATE_NODE';
export const API_REQUEST_CREATE_NODE_SUCCESS = '[Building Equipment Node] API_REQUEST_CREATE_NODE_SUCCESS';
export const API_REQUEST_UPDATE_NODE_SUCCESS = '[Building Equipment Node] API_REQUEST_UPDATE_NODE_SUCCESS';
export const TOGGLE_UNIT_POPUP = '[Building Equipment Node] TOGGLE_UNIT_POPUP';
export const TOGGLE_UNIT_POPUP_SUCCESS = '[Building Equipment Node] TOGGLE_UNIT_POPUP_SUCCESS';
export const MODAL_POPUP = '[Building Equipment Node] MODAL_POPUP';
export const CHANGE_NODE_SPLIT_TYPE = '[Building Equipment Node] CHANGE_NODE_SPLIT_TYPE';
export const UNIT_POPUP_FILTER = '[Building Equipment Node] UNIT_POPUP_FILTER';
export const UPDATE_ORDER = '[Building Equipment Node] UPDATE_ORDER';
export const UPDATE_SEARCH_KEY = '[Building Equipment Node] UPDATE_SEARCH_KEY';
export const UPDATE_UNITS_PER_PAGE = '[Building Equipment Node] UPDATE_UNITS_PER_PAGE';
export const UPDATE_PAGE = '[Building Equipment Node] UPDATE_PAGE';
export const UPDATE_SUPPLY_TYPE_FILTER = '[Building Equipment Node] UPDATE_SUPPLY_TYPE_FILTER';
export const UPDATE_NODE_TYPE_FILTER = '[Building Equipment Node] UPDATE_NODE_TYPE_FILTER';
export const RESET_FORM = '[Building Equipment Node] RESET_FORM';
export const GET_NODE_DETAILS = '[Building Equipment Node] GET_NODE_DETAILS';
export const GET_NODE_DETAILS_FAILED = '[Building Equipment Node] GET_NODE_DETAILS_FAILED';
export const GET_NODE_ALLOWED_CHILDREN = '[Building Equipment Node] GET_NODE_ALLOWED_CHILDREN';
export const GET_NODE_ALLOWED_CHILDREN_SUCCESS = '[Building Equipment Node] GET_NODE_ALLOWED_CHILDREN_SUCCESS';
export const GET_NODE_ALLOWED_CHILDREN_FAILED = '[Building Equipment Node] GET_NODE_ALLOWED_CHILDREN_FAILED';

export const GET_SHOPS = '[Building Equipment Node] GET_SHOPS';
export const GET_SHOPS_SUCCESS = '[Building Equipment Node] GET_SHOPS_SUCCESS';
export const GET_SHOPS_FAILED = '[Building Equipment Node] GET_SHOPS_FAILED';

export const GET_COMMON_AREAS = '[Building Equipment Node] GET_COMMON_AREAS';
export const GET_COMMON_AREAS_SUCCESS = '[Building Equipment Node] GET_COMMON_AREAS_SUCCESS';
export const GET_COMMON_AREAS_FAILED = '[Building Equipment Node] GET_COMMON_AREAS_FAILED';

export const GET_ALL_UNITS = '[Building Equipment Node Form] GET_ALL_UNITS';
export const GET_UNITS_SUCCESS = '[Building Equipment Node] GET_UNITS_SUCCESS';
export const GET_UNITS_FAILED = '[Building Equipment Node] GET_UNITS_FAILED';
export const RESET_UNITS = '[Building Equipment Node] RESET_UNITS';

export const OPEN_ADD_CHILD_NODES = '[Building Equipment Node] OPEN_ADD_CHILD_NODES';
export const TOGGLE_ADD_CHILD_NODES_DISPLAY = '[Building Equipment Node] TOGGLE_ADD_CHILD_NODES_DISPLAY';
export const TOGGLE_NODE_ALLOCATION = '[Building Equipment Node] TOGGLE_NODE_ALLOCATION';
export const SET_NODE_DETAIL = '[Building Equipment Node Form] SET_NODE_DETAIL';
export const TRY_OPEN_NODE_UNIT_ALLOCATION = '[Building Equipment Node Form] TRY_OPEN_NODE_UNIT_ALLOCATION';
export const OPEN_TAB = '[Building Equipment Node Form] OPEN_TAB';

export const ALLOCATED_EQUIPMENT_CANCEL = '[Building Equipment Node Form] CANCEL_CLICK';

export class RequestNodeList implements StoreAction {
  readonly type = REQUEST_NODE_LIST;

  constructor() {
  }
}

export class RequestNodeListComplete implements StoreAction {
  readonly type = REQUEST_NODE_LIST_COMPLETE;

  constructor(public payload: any) {
  }
}

export class ChangeNodeSplitType implements StoreAction {
  readonly type = CHANGE_NODE_SPLIT_TYPE;

  constructor(public payload: { splitType: SplitType, allocatedUnits: AllocatedUnitViewModel[] }) {
  }
}

export class UpdateNode implements StoreAction {
  readonly type = UPDATE_NODE;

  constructor(public payload: any) {
  }
}

export class DeleteNode implements StoreAction {
  readonly type = DELETE_NODE;

  constructor(public payload: any) {
  }
}

export class ToggleNodeInfo implements StoreAction {
  readonly type = TOGGLE_NODE_INFO;

  constructor(public payload: string) {
  }
}

export class ApiRequestCreateNode implements StoreAction {
  readonly type = API_REQUEST_CREATE_NODE;

  constructor(public payload: any) {
  }
}

export class ApiRequestCreateNodeSuccess implements StoreAction {
  readonly type = API_REQUEST_CREATE_NODE_SUCCESS;

  constructor(public payload: any) {
  }
}

export class ApiRequestUpdateNodeSuccess implements StoreAction {
  readonly type = API_REQUEST_UPDATE_NODE_SUCCESS;

  constructor(public payload: any) {
  }
}

export class UpdateOrder implements StoreAction {
  readonly type = UPDATE_ORDER;

  constructor(public payload: any) {
  }
}

export class UpdateSearchKey implements StoreAction {
  readonly type = UPDATE_SEARCH_KEY;

  constructor(public payload: any) {
  }
}

export class ModalPopup implements StoreAction {
  readonly type = MODAL_POPUP;

  constructor() {
  }
}

export class ToggleUnitPopupSuccess implements StoreAction {
  readonly type = TOGGLE_UNIT_POPUP_SUCCESS;

  constructor(public payload: SearchFilterUnitsModel[]) {
  }
}

export class ToggleUnitPopup implements StoreAction {
  readonly type = TOGGLE_UNIT_POPUP;

  constructor(public payload: { filterData?: SearchFilterUnits }) {
  }
}

export class UnitPopupFilter implements StoreAction {
  readonly type = UNIT_POPUP_FILTER;

  constructor(public payload: SearchFilterUnits) {
  }
}

export class UpdateUnitsPerPage implements StoreAction {
  readonly type = UPDATE_UNITS_PER_PAGE;

  constructor(public payload: any) {
  }
}

export class UpdatePage implements StoreAction {
  readonly type = UPDATE_PAGE;

  constructor(public payload: any) {
  }
}

export class UpdateSupplyTypeFilter implements StoreAction {
  readonly type = UPDATE_SUPPLY_TYPE_FILTER;

  constructor(public payload: any) {
  }
}

export class UpdateNodeTypeFilter implements StoreAction {
  readonly type = UPDATE_NODE_TYPE_FILTER;

  constructor(public payload: any) {
  }
}

export class ResetUnits implements StoreAction {
  readonly type = RESET_UNITS;

  constructor() {
  }
}

export class ResetForm implements StoreAction {
  readonly type = RESET_FORM;

  constructor() {
  }
}

export const GET_SUPPLIES_REQUEST = '[Building Equipment Node] GET_SUPPLIES_REQUEST';
export const GET_SUPPLIES_REQUEST_COMPLETE = '[Building Equipment Node] GET_SUPPLIES_REQUEST_COMPLETE';
export const GET_SUPPLIES_REQUEST_FAILED = '[Building Equipment Node] GET_SUPPLIES_REQUEST_FAILED';

export class GetSuppliesRequest implements StoreAction {
  readonly type = GET_SUPPLIES_REQUEST;

  constructor() {
  }
}

export class GetSuppliesRequestComplete implements StoreAction {
  readonly type = GET_SUPPLIES_REQUEST_COMPLETE;

  constructor(public payload: SupplyToViewModel[]) {
  }
}

export class GetSuppliesRequestFailed implements StoreAction {
  readonly type = GET_SUPPLIES_REQUEST_FAILED;

  constructor() {
  }
}

export class GetNodeDetails implements StoreAction {
  readonly type = GET_NODE_DETAILS;

  constructor(public payload: { nodeId: string }) {
  }
}

export class GetNodeDetailsFailed implements StoreAction {
  readonly type = GET_NODE_DETAILS_FAILED;

  constructor() {
  }
}

export class GetAllowedChildrenForNode implements StoreAction {
  readonly type = GET_NODE_ALLOWED_CHILDREN;

  constructor(public payload: { nodeId: string }) {
  }
}

export class GetAllowedChildrenForNodeFailed implements StoreAction {
  readonly type = GET_NODE_ALLOWED_CHILDREN_FAILED;

  constructor() {
  }
}

export class GetAllowedChildrenForNodeSuccess implements StoreAction {
  readonly type = GET_NODE_ALLOWED_CHILDREN_SUCCESS;

  constructor(public payload: { nodes: any[] }) {
  }
}


export class GetShops implements StoreAction {
  readonly type = GET_SHOPS;

  constructor() {
  }
}

export class GetShopsFailed implements StoreAction {
  readonly type = GET_SHOPS_FAILED;

  constructor() {
  }
}

export class GetShopsSuccess implements StoreAction {
  readonly type = GET_SHOPS_SUCCESS;

  constructor(public payload: { shops: any[] }) {
  }
}

export class GetCommonAreas implements StoreAction {
  readonly type = GET_COMMON_AREAS;

  constructor() {
  }
}

export class GetCommonAreasFailed implements StoreAction {
  readonly type = GET_COMMON_AREAS_FAILED;

  constructor() {
  }
}

export class GetCommonAreasSuccess implements StoreAction {
  readonly type = GET_COMMON_AREAS_SUCCESS;

  constructor(public payload: { commonAreas: any[] }) {
  }
}

export class AddRegistersToUnits implements StoreAction {
  readonly type = ADD_REGISTERS_TO_UNITS;

  constructor(public payload) {
  }
}

export class GetAllUnits implements StoreAction {
  readonly type = GET_ALL_UNITS;

  constructor() {
  }
}

export const GET_ALL_METERS_WITH_SUPPLY = '[Building Equipment Node] GET_ALL_METERS_WITH_SUPPLY';

export class GetMetersWithSupply implements StoreAction {
  readonly type = GET_ALL_METERS_WITH_SUPPLY;

  constructor(public payload: any) {
  }
}

export class GetUnitsSuccess implements StoreAction {
  readonly type = GET_UNITS_SUCCESS;

  constructor(public payload: { shops: any[], commonAreas: any[] }) {
  }
}

export const GET_ALL_METERS_WITH_SUPPLY_SUCCESS = '[Building Equipment Node] GET_ALL_METERS_WITH_SUPPLY_SUCCESS';

export class GetMettersWithSupplySuccess implements StoreAction {
  readonly type = GET_ALL_METERS_WITH_SUPPLY_SUCCESS;

  constructor(public payload: any[]) {
  }
}

export class OpenNodesAllocationView implements StoreAction {
  readonly type = OPEN_ADD_CHILD_NODES;

  constructor() {
  }
}

export class ToggleAddChildNodesDisplay implements StoreAction {
  readonly type = TOGGLE_ADD_CHILD_NODES_DISPLAY;

  constructor(public payload: { show: boolean }) {
  }
}

export class SetNodeDetail implements StoreAction {
  readonly type = SET_NODE_DETAIL;

  constructor(public payload: { node: NodeDetailViewModel, costSplitRegister?: string }) {
  }
}

export const SAVE_NODE_COST_ALLOCATION = '[Building Equipment Node] SAVE_NODE_COST_ALLOCATION';

export class SaveNodeCostAllocation {
  readonly type = SAVE_NODE_COST_ALLOCATION;

  constructor(public payload: any) {
  }
}


export class ToggleNodeAllocation implements StoreAction {
  readonly type = TOGGLE_NODE_ALLOCATION;

  constructor(public payload: { node: ChildNodeAssignmentViewModel | AllocatedNodeDetailViewModel, allocated: boolean }) {
  }
}


export class TryOpenUnitAllocation implements StoreAction {
  readonly type = TRY_OPEN_NODE_UNIT_ALLOCATION;

  constructor() {
  }
}

export class OpenTab implements StoreAction {
  readonly type = OPEN_TAB;

  constructor(public payload: { tab: string }) {
  }
}

export class AllocatedEquipmentCancelClick implements StoreAction {
  readonly type = ALLOCATED_EQUIPMENT_CANCEL;

  constructor() {
  }
}

export type Action = RequestNodeList | RequestNodeListComplete | UpdateNode | DeleteNode |
  GetNodeDetails | GetNodeDetailsFailed | SetNodeDetail | ToggleUnitPopup | UnitPopupFilter | AddRegistersToUnits |
  ToggleUnitPopupSuccess | GetShops | GetShopsFailed | GetShopsSuccess | GetAllUnits | GetUnitsSuccess | ModalPopup |
  OpenTab | TryOpenUnitAllocation | GetMetersWithSupply | GetMettersWithSupplySuccess |
  GetCommonAreas | GetCommonAreasFailed | GetCommonAreasSuccess | ResetUnits | ToggleNodeInfo | ChangeNodeSplitType |
  ApiRequestCreateNode | ApiRequestCreateNodeSuccess | ApiRequestUpdateNodeSuccess |
  GetSuppliesRequest | GetSuppliesRequestComplete | GetSuppliesRequestFailed |
  UpdateOrder | UpdateSearchKey | UpdateUnitsPerPage | UpdatePage | SaveNodeCostAllocation |
  GetAllowedChildrenForNode | GetAllowedChildrenForNodeFailed | GetAllowedChildrenForNodeSuccess |
  OpenNodesAllocationView | ToggleAddChildNodesDisplay | ToggleNodeAllocation |
  UpdateSupplyTypeFilter | UpdateNodeTypeFilter | ResetForm | AllocatedEquipmentCancelClick;
