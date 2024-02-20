import * as tariffValuesActions from '../actions/tariff-values.actions';
import {TariffValuesViewModel, TariffValueVersionInfoViewModel, VersionViewModel} from '@models';

export interface State {
  tariffValues: VersionViewModel<TariffValuesViewModel>;
  tariffValuesVersions: TariffValueVersionInfoViewModel[];
  pending: boolean;
  error: any;
}

export const initialState: State = {
  tariffValues: null,
  tariffValuesVersions: [],
  pending: false,
  error: null,
};

export function reducer(
  state: State = initialState,
  action: tariffValuesActions.Action
) {
  switch (action.type) {
    // Get Tariff Value
    case tariffValuesActions.GET_TARIFF_VALUES: {
      return {
        ...state,
        error: null,
        pending: true
      };
    }

    case tariffValuesActions.GET_TARIFF_VALUES_SUCCESS: {
      return {
        ...state,
        tariffValues: action.payload,
        tariffValuesVersions: action.payload.entity.versions,
        pending: false
      };
    }

    case tariffValuesActions.GET_TARIFF_VALUES_FAILED: {
      return {
        ...state,
        error: action.payload,
        pending: false
      };
    }


    // Update Tariff Value
    case tariffValuesActions.UPDATE_TARIFF_VALUES: {
      return {
        ...state,
        error: null,
        pending: true
      };
    }

    case tariffValuesActions.UPDATE_TARIFF_VALUES_SUCCESS: {
      return {
        ...state,
        pending: false
      };
    }

    case tariffValuesActions.UPDATE_TARIFF_VALUES_FAILED: {
      return {
        ...state,
        error: action.payload,
        pending: false
      };
    }

    case tariffValuesActions.UPDATE_TARIFF_VALUES_ORDER: {
      return {
        ...state,
        tariffValuesVersions: action.payload,
      };
    }

    case tariffValuesActions.DELETE_TARIFF_VALUES_VERSION_REQUEST_COMPLETE: {
      return {
        ...state,
        tariffValuesVersions: state.tariffValuesVersions.filter(v => v.versionId !== action.payload.valueVersionId),
      };
    }

    case tariffValuesActions.DELETE_TARIFF_VALUE_REQUEST_COMPLETE: {
      return {
        ...state,
        tariffValuesVersions: state.tariffValuesVersions.filter(v => v.valueId !== action.payload.tariffValueId),
      };
    }

    // Clear Store
    case tariffValuesActions.PURGE_TARIFF_VALUES: {
      return initialState;
    }

    default:
      return state;
  }
}
