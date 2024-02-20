import {createSelector} from '@ngrx/store';

import {getAddChargeLineItem} from './building-tariffs.selectors';

export const selectAddChargeLineItemFromState = createSelector(getAddChargeLineItem, (state) => state.formState);
export const selectAddChargeLineItemIsComplete = createSelector(getAddChargeLineItem, (state) => state.isComplete);
