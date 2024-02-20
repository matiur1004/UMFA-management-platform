import {createSelector} from '@ngrx/store';

import {getAddNewChargeValue} from './building-tariffs.selectors';

export const selectAddNewChargeValueFromState = createSelector(getAddNewChargeValue, (state) => state.formState);
export const selectAddNewChargeValueIsComplete = createSelector(getAddNewChargeValue, (state) => state.isComplete);
