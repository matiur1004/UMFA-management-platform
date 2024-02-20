import {TariffValueVersionInfoViewModel, TariffVersionInfoViewModel} from "@models";
import * as actions from '../actions/tariff-versions.actions';

export interface State {
  tariffVersions: TariffVersionInfoViewModel[];
  tariffSubVersions: TariffVersionInfoViewModel[];
  tariffVersionsOrder: number;
  tariffSubVersionsOrder: number;

  tariffValuesVersions: TariffValueVersionInfoViewModel[];
  tariffValuesVersionsOrder: number;
}

export const getReducer = (areaName) => {
  const belongsToArea = (a) => a['area'] === areaName;
  const initialState = {
    tariffVersionsOrder: 1,
    tariffSubVersionsOrder: -6,
    tariffValuesVersionsOrder: -6,
    tariffVersions: [],
    tariffSubVersions: [],
    tariffValuesVersions: []
  };

  return (state: State = initialState, action: actions.Action) => {
    if (!belongsToArea(action)) {
      return state;
    }

    switch (action.type) {
      case actions.UPDATE_TARIFF_VERSIONS:
        return {
          ...state,
          tariffVersions: action.payload
        };
      case actions.UPDATE_TARIFF_SUB_VERSIONS:
        return {
          ...state,
          tariffSubVersions: action.payload
        };
      case actions.UPDATE_TARIFF_VALUES_VERSIONS:
        return {
          ...state,
          tariffValuesVersions: action.payload
        };
      case actions.UPDATE_TARIFF_VERSIONS_ORDER: {
        let orderIndex = state.tariffVersionsOrder;

        if (orderIndex === action.payload || orderIndex === (action.payload * -1)) {
          orderIndex *= -1;
        } else {
          orderIndex = action.payload;
        }

        return {
          ...state,
          tariffVersionsOrder: orderIndex
        };
      }
      case actions.UPDATE_TARIFF_SUB_VERSIONS_ORDER: {
        let orderIndex = state.tariffSubVersionsOrder;

        if (orderIndex === action.payload || orderIndex === (action.payload * -1)) {
          orderIndex *= -1;
        } else {
          orderIndex = action.payload;
        }

        return {
          ...state,
          tariffSubVersionsOrder: orderIndex
        };
      }
      case actions.UPDATE_TARIFF_VALUES_VERSIONS_ORDER: {
        let orderIndex = state.tariffValuesVersionsOrder;

        if (orderIndex === action.payload || orderIndex === (action.payload * -1)) {
          orderIndex *= -1;
        } else {
          orderIndex = action.payload;
        }

        return {
          ...state,
          tariffValuesVersionsOrder: orderIndex
        };
      }
      default:
        return state;
    }
  };
};
