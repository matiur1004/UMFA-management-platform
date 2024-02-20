import * as buildingDetailsActions from '../actions/building-details.actions';
import * as shopActions from '../actions/shop.actions';
import {ShopStatus} from '@models';
import {BuildingDetailViewModel, BuildingShopViewModel} from '../../models/buildings.model';

export interface State {
  building: BuildingDetailViewModel;
  searchKey: string;
  tenantId: string;
  floor: number | null;
  status: number | null;
}

export const initialState: State = {
  building: null,
  searchKey: null,
  tenantId: null,
  floor: null,
  status: null
};

const getToggleSpareShops = (shops: BuildingShopViewModel[], index: number) => {
  const newShops = [...shops];
  const isSpare = !newShops[index].isSpare;
  newShops.splice(index, 1, {
    ...newShops[index],
    tenant: null,
    isSpare: isSpare,
    status: isSpare ? ShopStatus.Spare : ShopStatus.Vacant
  });
  return newShops;
};

export function reducer(state = initialState, action: buildingDetailsActions.Action | shopActions.Action) {
  switch (action.type) {
    case buildingDetailsActions.BUILDING_DETAILS_REQUEST_COMPLETE: {
      return {
        ...state,
        building: action.payload
      };
    }

    case buildingDetailsActions.UPDATE_FLOOR_FILTER: {
      return {
        ...state,
        floor: action.payload
      };
    }

    case buildingDetailsActions.UPDATE_SEARCH_KEY: {
      return {
        ...state,
        searchKey: action.payload
      };
    }

    case buildingDetailsActions.UPDATE_STATUS_FILTER: {
      return {
        ...state,
        status: action.payload
      };
    }

    case buildingDetailsActions.UPDATE_TENANT_FILTER: {
      return {
        ...state,
        tenantId: action.payload
      };
    }

    case buildingDetailsActions.SET_SHOPS: {
      return {
        ...state,
        building: {...state.building, shops: action.payload}
      };
    }

    case buildingDetailsActions.UPDATE_IS_TOGGLE: {

      const shops = [...state.building.shops];

      shops.splice(action.payload.index, 1, {
        ...shops[action.payload.index],
        isSelected: !shops[action.payload.index].isSelected
      });

      return {
        ...state,
        building: {
          ...state.building,
          shops: shops
        }
      };
    }

    case buildingDetailsActions.SET_SHOP_DETAILS: {

      const shops = [...state.building.shops];

      shops.splice(action.payload.index, 1, action.payload.shop);

      return {
        ...state,
        building: {
          ...state.building,
          shops: shops
        }
      };
    }

    case shopActions.TOGGLE_SPARE: {
      return {
        ...state,
        building: {...state.building, shops: getToggleSpareShops(state.building.shops, action.payload)}
      };
    }

    default:
      return state;
  }
}

export const getBuilding = (state: State) => state.building;
export const getSearchKey = (state: State) => state.searchKey;
export const getTenantId = (state: State) => state.tenantId;
export const getFloor = (state: State) => state.floor;
export const getStatus = (state: State) => state.status;
