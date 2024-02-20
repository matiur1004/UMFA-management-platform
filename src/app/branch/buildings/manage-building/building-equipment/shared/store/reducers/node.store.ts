import {NodeViewModel, SearchFilterUnits, SearchFilterUnitsModel} from '../../models';

import * as nodeActions from '../actions/node.actions';
import {SupplyToViewModel} from '@models';

export interface State {
  nodes: NodeViewModel[];
  unitFilter: SearchFilterUnits;
  unitModal: SearchFilterUnitsModel[];
  searchKey: string;
  total: number;
  order: number;
  page: number;
  unitsPerPage: number | null;
  supplyTypeFilter: number;
  nodeTypeFilter: number;
  supplies: SupplyToViewModel[];

}

export const initialState: State = {
  nodes: [],
  searchKey: '',
  unitModal: [],
  unitFilter: new SearchFilterUnits(),
  total: 0,
  order: 1,
  page: 1,
  unitsPerPage: 30,
  supplyTypeFilter: -1,
  nodeTypeFilter: -1,
  supplies: null
};

export function reducer(state = initialState, action: nodeActions.Action) {
  switch (action.type) {

    case nodeActions.REQUEST_NODE_LIST_COMPLETE: {
      return {
        ...state,
        nodes: action.payload.items,
        total: action.payload.total,
        page: 1
      };
    }

    case nodeActions.TOGGLE_UNIT_POPUP_SUCCESS: {
      return {...state, unitModal: action.payload};
    }

    case nodeActions.UNIT_POPUP_FILTER: {
      return {
        ...state,
        unitFilter: action.payload
      };
    }

    case nodeActions.UPDATE_ORDER: {
      return {
        ...state,
        order: action.payload
      };
    }

    case nodeActions.UPDATE_SEARCH_KEY: {
      return {
        ...state,
        searchKey: action.payload
      };
    }

    case nodeActions.UPDATE_PAGE: {
      return {
        ...state,
        page: action.payload
      };
    }

    case nodeActions.UPDATE_UNITS_PER_PAGE: {
      return {
        ...state,
        unitsPerPage: action.payload
      };
    }

    case nodeActions.UPDATE_NODE_TYPE_FILTER: {
      return {
        ...state,
        nodeTypeFilter: action.payload
      };
    }

    case nodeActions.UPDATE_SUPPLY_TYPE_FILTER: {
      return {
        ...state,
        supplyTypeFilter: action.payload
      };
    }

    case nodeActions.RESET_FORM: {
      return {
        ...state,
        total: 0,
        order: 1,
        page: 1,
        unitsPerPage: 30,
        supplyTypeFilter: -1,
        nodeTypeFilter: -1
      };
    }

    case nodeActions.GET_SUPPLIES_REQUEST_COMPLETE: {
      return {
        ...state,
        supplies: action.payload
      };
    }

    default:
      return state;
  }
}

export const getNodes = (state: State) => state.nodes;
export const getUnitFilter = (state: State) => state.unitFilter;
export const getUnitModal = (state: State) => state.unitModal;
export const getTotal = (state: State) => state.total;
export const getSearchKey = (state: State) => state.searchKey;
export const getOrder = (state: State) => state.order;
export const getUnitsPerPage = (state: State) => state.unitsPerPage;
export const getPage = (state: State) => state.page;
export const getNodeTypeFilter = (state: State) => state.nodeTypeFilter;
export const getSupplyTypeFilter = (state: State) => state.supplyTypeFilter;
export const getAllSupplies = (state: State) => state.supplies;
