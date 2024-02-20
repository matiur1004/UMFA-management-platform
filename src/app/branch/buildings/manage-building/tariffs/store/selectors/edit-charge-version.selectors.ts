import {createSelector} from '@ngrx/store';

import {getEditChargeVersion} from './building-tariffs.selectors';

export const selectEditChargeVersionFormState = createSelector(getEditChargeVersion, (state) => state.formState);
export const selectEditChargeVersionRegisters = createSelector(getEditChargeVersion, (state) => state.registers);
export const selectEditChargeValuesVersions = createSelector(getEditChargeVersion, (state) => state.valuesVersions);
export const selectEditChargeValuesVersionsOrder = createSelector(getEditChargeVersion, (state) => state.valuesOrder);
export const selectEditChargeVersionId = createSelector(getEditChargeVersion, (state) => state.chargeId);

