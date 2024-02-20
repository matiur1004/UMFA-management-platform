import * as profileActions from '../actions/profile.actions';
import {initialState, State} from '../../../store/reducers/profiles.store';

export function reducer(state = initialState, action: profileActions.Action) {
  switch (action.type) {
    case profileActions.TENANT_BUILDING_LIST_REQUEST_COMPLETE: {
      return {
        ...state,
        tenantBuildings: action.payload
      };
    }

    case profileActions.UPDATE_BUILDING_FILTER: {
      return {
        ...state,
        buildingId: action.payload
      };
    }

    case profileActions.UPDATE_SEARCH_KEY: {
      return {
        ...state,
        searchKey: action.payload
      };
    }

    default:
      return state;
  }
}

export const getTenantBuildings = (state: State) => state.tenantBuildings;
export const getSearchKey = (state: State) => state.searchKey;
export const getBuildingId = (state: State) => state.buildingId;
