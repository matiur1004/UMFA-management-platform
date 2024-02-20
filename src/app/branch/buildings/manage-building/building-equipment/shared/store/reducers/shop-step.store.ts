import {UnitFilter} from '../../models';

import * as shopStepActions from '../actions/shop-step.actions';

export interface State {
  shops: any[];
  commonAreas: any[];
  selectedIds: string[];
  searchTerm: string;
  unitFilter: number;
}

export const initialState: State = {
  shops: [],
  commonAreas: [],
  selectedIds: [],
  searchTerm: '',
  unitFilter: UnitFilter.AllUnits
};

export function reducer(state = initialState, action: shopStepActions.Action) {
  switch (action.type) {

    case shopStepActions.GET_SHOPS_REQUEST_COMPLETE: {
      return {
        ...state,
        shops: action.payload
      };
    }

    case shopStepActions.GET_COMMON_AREAS_REQUEST_SUCCESS: {
      return {
        ...state,
        commonAreas: action.payload
      };
    }

    case shopStepActions.RESET_SHOP_DATA: {
      return {
        ...state,
        shops: [],
        selectedIds: [],
        searchTerm: '',
        unitFilter: UnitFilter.AllUnits
      };
    }

    case shopStepActions.TOGGLE_UNIT: {

      const unitId = action.payload;
      const isSelected = state.selectedIds.includes(unitId);

      return {
        ...state,
        selectedIds: isSelected ?
          state.selectedIds.filter(id => id != unitId) :
          [...state.selectedIds, unitId]
      };
    }

    case shopStepActions.UPDATE_SEARCH_TERM: {
      return {
        ...state,
        searchTerm: action.payload
      };
    }

    case shopStepActions.UPDATE_SHOP_FILTER: {
      return {
        ...state,
        unitFilter: action.payload
      };
    }
    default:
      return state;
  }
}

export const getShops = (state: State) => state.shops;
export const getCommonAreas = (state: State) => state.commonAreas;
export const getSelectedIds = (state: State) => state.selectedIds;
export const getSearchTerm = (state: State) => state.searchTerm;
export const getShopFilter = (state: State) => state.unitFilter;

