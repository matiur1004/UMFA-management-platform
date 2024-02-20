import {createSelector, MemoizedSelector} from "@ngrx/store";
import * as tariffVersionSettingsReducer from '../reducers/tariff-version-settings.reducer';

export const getTariffVersionSettingsSelectors = (
  getTariffVersionSettingsState: MemoizedSelector<Object, tariffVersionSettingsReducer.State>,
) => {
  const getTariffVersionSettings = createSelector(
    getTariffVersionSettingsState,
    state => state.tariffVersionSettings
  );

  return {
    getTariffVersionSettings,
  };
};
