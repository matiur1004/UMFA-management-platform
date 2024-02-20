import {LocationViewModel} from "@models";

import * as locationEquipmentActions from '../actions/location-equipment.action';

export interface State {
  location: LocationViewModel;
  searchKey: string;
  order: number;
  supplyTypeFilter: number;
  selectedUnitId: string;
  selectedNodeId: string;
  nodes: any;
  units: any;
}

export const initialState: State = {
  location: new LocationViewModel(),
  searchKey: '',
  order: 1,
  supplyTypeFilter: -1,
  selectedUnitId: null,
  selectedNodeId: null,
  nodes: {},
  units: {}
}

export function reducer(state = initialState, action: locationEquipmentActions.Action) {
  switch (action.type) {

    case locationEquipmentActions.SET_LOCATION: {
      return {
        ...state,
        ...action.payload,
        selectedUnitId: null,
        selectedNodeId: null
      }
    }

    case locationEquipmentActions.UPDATE_ORDER: {
      return {
        ...state,
        order: action.payload
      }
    }

    case locationEquipmentActions.UPDATE_SEARCH_KEY_COMPLETE: {
      return {
        ...state,
        searchKey: action.payload
      }
    }

    case locationEquipmentActions.UPDATE_SUPPLY_TYPE: {
      return {
        ...state,
        supplyTypeFilter: action.payload
      }
    }

    case locationEquipmentActions.UPDATE_NODE: {
      return {
        ...state,
        selectedNodeId: action.payload
      }
    }

    case locationEquipmentActions.UPDATE_UNIT: {
      return {
        ...state,
        selectedUnitId: action.payload
      }
    }

    default:
      return state;
  }
}

export const getLocation = (state: State) => state.location;
export const getSearchKey = (state: State) => state.searchKey;
export const getOrderIdx = (state: State) => state.order;
export const getSupplyTypeFilter = (state: State) => state.supplyTypeFilter;
export const getSelectedUnitId = (state: State) => state.selectedUnitId;
export const getSelectedNodeId = (state: State) => state.selectedNodeId;
export const getNodes = (state: State) => state.nodes;
export const getUnits = (state: State) => state.units;
export const getLocationId = (state: State) => state.location.id;



