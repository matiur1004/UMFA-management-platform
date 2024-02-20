import {createSelector} from '@ngrx/store';

import {getAddNewCharge} from './building-tariffs.selectors';

export const selectAddNewChargeFromState = createSelector(getAddNewCharge, (state) => state.formState);
export const selectAddNewChargeIsComplete = createSelector(getAddNewCharge, (state) => state.isComplete);
