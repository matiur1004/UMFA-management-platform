import * as tariffActions from '../actions/tariff.actions';
import {TariffViewModel, VersionViewModel} from '@models';

export interface State {
  tariffs: VersionViewModel<TariffViewModel>[];
  searchKey: string;
  order: number;
  versionOrder: number;
  supplyTypeFilter: number;
  buildingCategoryId: string;
  tariffVersionId: string;
}

export const initialState: State = {
  tariffs: [],
  searchKey: '',
  order: 1,
  versionOrder: 2,
  supplyTypeFilter: -1,
  buildingCategoryId: '',
  tariffVersionId: ''
};

export const reducer = (state = initialState, action: tariffActions.Action) => {
  switch (action.type) {
    case tariffActions.REQUEST_TARIFF_LIST_COMPLETE: {
      return {
        ...state,
        tariffs: action.payload
      };
    }

    case tariffActions.UPDATE_ORDER: {
      return {
        ...state,
        order: action.payload
      };
    }
    case tariffActions.UPDATE_VERSION_ORDER: {
      return {
        ...state,
        versionOrder: action.payload
      };
    }

    case tariffActions.UPDATE_SEARCH_KEY: {
      return {
        ...state,
        searchKey: action.payload
      };
    }

    case tariffActions.UPDATE_SUPPLY_TYPE_FILTER: {
      return {
        ...state,
        supplyTypeFilter: action.payload
      };
    }

    case tariffActions.UPDATE_BUILDING_CATEGORY_ID: {
      return {
        ...state,
        buildingCategoryId: action.payload
      };
    }

    case tariffActions.UPDATE_TARIFF_VERSION_ID: {
      return {
        ...state,
        tariffVersionId: action.payload
      };
    }

    default:
      return state;
  }
};
