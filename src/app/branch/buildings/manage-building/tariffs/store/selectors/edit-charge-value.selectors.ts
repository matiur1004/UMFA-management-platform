import {createSelector} from '@ngrx/store';

import {getEditChargeValue} from './building-tariffs.selectors';

export const selectEditChargeValueFormState = createSelector(getEditChargeValue, (state) => state.formState);
export const selectEditChargeValueVersions = createSelector(getEditChargeValue, (state) => state.valuesVersions);
export const selectEditChargeValueVersionsOrder = createSelector(getEditChargeValue, (state) => state.valuesOrder);
export const selectEditChargeValueChargeId = createSelector(getEditChargeValue, (state) => state.chargeId);
export const selectEditChargeValueId = createSelector(getEditChargeValue, (state) => state.valueId);
