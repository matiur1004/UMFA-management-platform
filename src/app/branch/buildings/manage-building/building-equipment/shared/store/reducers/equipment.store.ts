import {AutomaticMeterReadingAccountViewModel} from '@app/shared/models';
import {MeterViewModel} from '../../models';

import * as equipmentActions from '../actions/equipment.actions';

const pageSize: number = 10;

export interface State {
  equipments: MeterViewModel[];
  total: number;
  searchKey: string;
  order: number;
  supplyTypeFilter: number;
  selectedUnitId: string;
  selectedNodeId: string;
  selectedLocationId: string;
  nodes: any;
  units: any;
  locations: any;
  supplyTypes: any;
  amrAccounts: AutomaticMeterReadingAccountViewModel[];
  isBuildingWithAmrAccount: boolean;
}

export const initialState: State = {
  equipments: [],
  total: 0,
  searchKey: '',
  order: 1,
  supplyTypeFilter: -1,
  selectedUnitId: null,
  selectedNodeId: null,
  selectedLocationId: null,
  nodes: {},
  units: {},
  locations: {},
  supplyTypes: {},
  amrAccounts: [],
  isBuildingWithAmrAccount: false
};

export function reducer(state = initialState, action: equipmentActions.Action) {
  switch (action.type) {

    case equipmentActions.REQUEST_EQUIPMENT_LIST_COMPLETE: {
      return {
        ...state,
        equipments: action.payload.equipments,
        total: action.payload.total,
        nodes: action.payload.nodes,
        units: action.payload.units,
        locations: action.payload.locations,
        supplyTypes: action.payload.supplyTypes
      };
    }

    case equipmentActions.UPDATE_EQUIPMENTS: {
      return {
        ...state,
        equipments: action.payload
      };
    }

    case equipmentActions.UPDATE_ORDER: {
      return {
        ...state,
        order: action.payload
      };
    }

    case equipmentActions.UPDATE_NODE_FILTER: {
      return {
        ...state,
        selectedNodeId: action.payload
      };
    }

    case equipmentActions.UPDATE_SEARCH_KEY: {
      return {
        ...state,
        searchKey: action.payload
      };
    }

    case equipmentActions.UPDATE_SUPPLY_TYPE_FILTER: {
      return {
        ...state,
        supplyTypeFilter: action.payload
      };
    }

    case equipmentActions.UPDATE_UNIT_FILTER: {
      return {
        ...state,
        selectedUnitId: action.payload
      };
    }

    case equipmentActions.UPDATE_LOCATION_FILTER: {
      return {
        ...state,
        selectedLocationId: action.payload
      };
    }

    case equipmentActions.RESET_FORM: {
      return {
        ...state,
        order: 1,
        supplyTypeFilter: -1,
        selectedUnitId: null,
        selectedNodeId: null,
        selectedLocationId: null,
        nodes: {},
        units: {},
        locations: {},
        supplyTypes: {}
      };
    }

    case equipmentActions.REQUEST_BRANCH_AMR_ACCOUNTS_COMPLETE: {
      return {
        ...state,
        amrAccounts: action.payload
      };
    }

    case equipmentActions.IS_BUILDING_WITH_AMR_ACCOUNT: {
      return {
        ...state,
        isBuildingWithAmrAccount: action.payload
      };
    }

    default:
      return state;
  }
}

export const getEquipments = (state: State) => state.equipments;
export const getEquipmentsTotal = (state: State) => state.total;
export const getSupplyTypeFilter = (state: State) => state.supplyTypeFilter;
export const getNodeIdFilter = (state: State) => state.selectedNodeId;
export const getLocationIdFilter = (state: State) => state.selectedLocationId;
export const getOrder = (state: State) => state.order;
export const getUnitIdFilter = (state: State) => state.selectedUnitId;
export const getSearchKey = (state: State) => state.searchKey;
export const getNodes = (state: State) => state.nodes;
export const getUnits = (state: State) => state.units;
export const getLocations = (state: State) => state.locations;
export const getSupplyTypes = (state: State) => state.supplyTypes;
export const getAmrAccounts = (state: State) => state.amrAccounts;
export const isBuildingWithAmrAccount = (state: State) => state.isBuildingWithAmrAccount;
