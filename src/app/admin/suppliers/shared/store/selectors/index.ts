import {getTariffVersionsSelectors} from 'app/shared/tariffs/store/selectors/tariff-versions.selectors';
import {getTariffFormState, getTariffVersionsState} from './common.selectors';
import {createSelector} from '@ngrx/store';

export * from './common.selectors';
export * from './supplier-tariff-settings.selectors';
export * from './supplier.selectors';
export * from './tariff-form.selectors';
export * from './tariff-values.selectors';
export * from './tariffs.selectors';
export * from './tariff-settings.selectors';
export * from './tariff-version-settings.selectors';

const tariffVersionSelectors = getTariffVersionsSelectors(getTariffVersionsState);

export const getTariffVersionsSorted = tariffVersionSelectors.getTariffVersionsSorted;
export const getTariffSubVersionsSorted = tariffVersionSelectors.getTariffSubVersionsSorted;
export const getPreviousSubVersion = tariffVersionSelectors.getPreviousSubVersion;
export const getTariffVersionsOrder = tariffVersionSelectors.getTariffVersionsOrder;
export const getTariffSubVersionsOrder = tariffVersionSelectors.getTariffSubVersionsOrder;
export const getTariffValuesOrder = tariffVersionSelectors.getTariffValuesOrder;
export const getTariffValuesSorted = tariffVersionSelectors.getTariffValuesSorted;

export const getTariffFormMaxMajorVersion = createSelector(
  getTariffVersionsSorted,
  getTariffFormState,
  (versions, formState) => Math.max(...versions.map(v => v.majorVersion), formState.formState.value.majorVersion)
);

export const getTariffFormMaxMinorVersion = createSelector(
  getTariffSubVersionsSorted,
  getTariffFormState,
  (subVersions, formState) => {
    return Math.max(...subVersions.map(v => v.minorVersion), formState.formState.value.minorVersion);
  }
);

export const isLastVersion = createSelector(
  getTariffFormState,
  getTariffFormMaxMajorVersion,
  (tariffFormState, majorVersion) => {
    return majorVersion === tariffFormState.formState.value.majorVersion;
  }
);
