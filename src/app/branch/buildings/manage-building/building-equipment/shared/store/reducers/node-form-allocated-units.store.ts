import * as nodeFormActions from '../actions/node-form.actions';
import * as nodeActions from '../actions/node.actions';

export interface State {
  shops: any[];
  commonAreas: any[];
  selectedUnits: { [key: string]: boolean };
  shopOrder: number;
  shopFilter: number;
  shopSearchKey: string;
  metersWithSupply: any[];
}

export const initialState: State = {
  shops: null,
  commonAreas: null,
  selectedUnits: {},
  shopOrder: 1,
  shopFilter: 0,
  shopSearchKey: null,
  metersWithSupply: []
};


export function reducer(state = initialState, action: nodeFormActions.Action | nodeActions.Action) {
  switch (action.type) {

    case nodeActions.GET_SHOPS_SUCCESS: {
      return {
        ...state,
        shops: action.payload.shops
      };
    }

    case nodeActions.RESET_UNITS: {
      return {...state, commonAreas: null, shops: null};
    }

    case nodeActions.SET_NODE_DETAIL: {
      const node = action.payload.node;
      let selectedUnits = node.shopIds.reduce((dict, id) => {
        dict[id] = true;
        return dict;
      }, {});
      selectedUnits = node.commonAreaIds.reduce((dict, id) => {
        dict[id] = true;
        return dict;
      }, selectedUnits);
      return {
        ...state,
        selectedUnits: selectedUnits
      };
    }

    case nodeActions.GET_COMMON_AREAS_SUCCESS: {
      return {
        ...state,
        commonAreas: action.payload.commonAreas
      };
    }

    case nodeActions.GET_UNITS_SUCCESS: {
      return {
        ...state,
        commonAreas: action.payload.commonAreas,
        shops: action.payload.shops
      };
    }

    case nodeActions.GET_ALL_METERS_WITH_SUPPLY_SUCCESS: {
      return {
        ...state,
        metersWithSupply: action.payload,
      };
    }

    case nodeFormActions.TOGGLE_UNIT: {
      const selectedUnits = {...state.selectedUnits};
      if (selectedUnits[action.payload]) {
        delete selectedUnits[action.payload];
      } else {
        selectedUnits[action.payload] = true;
      }

      return {
        ...state,
        selectedUnits: selectedUnits
      };
    }

    case nodeFormActions.UPDATE_SHOP_ORDER: {
      return {
        ...state,
        shopOrder: action.payload
      };
    }

    case nodeFormActions.UPDATE_SHOP_FILTER: {
      return {
        ...state,
        shopFilter: action.payload
      };
    }

    case nodeFormActions.UPDATE_SHOP_SEARCH_KEY: {
      return {
        ...state,
        shopSearchKey: action.payload
      };
    }

    default:
      return state;

  }
}

export const getShops = (state: State) => state.shops;
export const getCommonAreas = (state: State) => state.commonAreas;
export const getSelectedUnits = (state: State) => state.selectedUnits;
export const getShopOrder = (state: State) => state.shopOrder;
export const getShopFilter = (state: State) => state.shopFilter;
export const getShopSearchKey = (state: State) => state.shopSearchKey;
