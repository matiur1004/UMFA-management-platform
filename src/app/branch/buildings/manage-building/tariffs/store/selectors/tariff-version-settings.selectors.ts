import {createSelector} from '@ngrx/store';
import {getTariffVersionSettings} from './building-tariffs.selectors';
import {getTariffVersionSettingsSelectors} from '@app/shared/tariffs/store/selectors/tariff-version-settings.selectors';

const tariffVersionSettingsSelectors = getTariffVersionSettingsSelectors(getTariffVersionSettings);

export const getVersionSettings = tariffVersionSettingsSelectors.getTariffVersionSettings

export const getVersionCategories = createSelector(
  getVersionSettings,
  state => state.tariffCategories
)

export const getVersionSteps = createSelector(
  getVersionSettings,
  state => state.tariffSteps
)
