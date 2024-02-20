import * as generalInfoActions from '../../actions/shop-detail-actions/general-info.actions';
import {ShopGeneralInfoViewModel} from '../../../profiles/models/shop-detail.model';

export interface State {
  generalInfo: ShopGeneralInfoViewModel;
  shopId: string;
  buildingId: string;
}

export const initialState: State = {
  generalInfo: new ShopGeneralInfoViewModel(),
  shopId: null,
  buildingId: null
};

export function reducer(state = initialState, action: generalInfoActions.Actions) {
  switch (action.type) {
    case generalInfoActions.GET_GENERAL_INFO_REQUEST_COMPLETE: {
      return {
        ...state,
        generalInfo: action.payload
      };
    }

    case generalInfoActions.SET_SHOP_ID: {
      return {
        ...state,
        shopId: action.payload
      };
    }

    case generalInfoActions.SET_BUILDING_ID: {
      return {
        ...state,
        buildingId: action.payload
      };
    }

    default:
      return state;
  }
}

export const getGeneralInfo = (state: State) => state.generalInfo;
export const getShopId = (state: State) => state.shopId;
export const getBuildingId = (state: State) => state.buildingId;

