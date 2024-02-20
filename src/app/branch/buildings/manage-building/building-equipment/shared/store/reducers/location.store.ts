import {LocationViewModel} from "@models";

import * as locationActions from '../actions/location.actions';


export interface State {
  locations: LocationViewModel[];
  searchKey: string;
  order: number;
  totalItem: number;
}

export const initialState: State = {
  locations: [],
  searchKey: '',
  order: 1,
  totalItem: 0,
}


export function reducer(state = initialState, action: locationActions.Action) {
  switch (action.type) {

    case locationActions.REQUEST_LOCATION_LIST_COMPLETE: {
      return {
        ...state,
        locations: action.payload
      };
    }

    case locationActions.ADD_LOCATION: {
      return {
        ...state,
        locations: [...state.locations, action.payload]
      }
    }

    case locationActions.UPDATE_LOCATION: {
      let locations = state.locations.map(i => Object.assign({}, i));
      Object.assign(locations.find(l => l.id == action.payload.id), action.payload);
      return {
        ...state,
        locations: locations
      }
    }

    case locationActions.UPDATE_ORDER: {
      return {
        ...state,
        order: action.payload
      }
    }

    case locationActions.UPDATE_SEARCH_KEY: {
      return {
        ...state,
        searchKey: action.payload
      }
    }

    case locationActions.RESET_FORM: {
      return {
        ...state,
        searchKey: '',
        order: 1,
        totalItem: 0
      }
    }

    default:
      return state;
  }
}

export const getLocations = (state: State) => state.locations;
export const getSearchKey = (state: State) => state.searchKey;
export const getOrder = (state: State) => state.order;
