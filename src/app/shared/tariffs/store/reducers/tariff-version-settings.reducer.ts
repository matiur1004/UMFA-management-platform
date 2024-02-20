import {TariffVersionSettingsViewModel} from "@app/shared/models/tariff-version-settings.model";
import {TariffCategoryAllocatedUnitViewModel} from "../../models/tariff-category-allocated-unit.model";
import * as tariffVersionSettingsActions from '../actions/tariff-version-settings.actions';

export interface State {
  tariffVersionSettings: TariffVersionSettingsViewModel,
  allocatedUnits: TariffCategoryAllocatedUnitViewModel[]
}

export const initialState = {
  tariffVersionSettings: null,
  allocatedUnits: []
}

export const reducer = (state = initialState, action: tariffVersionSettingsActions.Action): State => {
  switch (action.type) {
    case tariffVersionSettingsActions.SET_TARIFF_VERSION_SETTINGS:
      return {
        ...state,
        tariffVersionSettings: action.payload
      };
    case tariffVersionSettingsActions.GET_TARIFF_CATEGORIES_ALLOCATED_UNITS_SUCCESS:
      return {
        ...state,
        allocatedUnits: action.payload.allocatedUnits
      };
    default:
      return state;
  }
};
