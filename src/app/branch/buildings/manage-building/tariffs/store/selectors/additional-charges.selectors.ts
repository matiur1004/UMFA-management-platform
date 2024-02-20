import {createSelector} from '@ngrx/store';

import {getAdditionalCharges} from './building-tariffs.selectors';

export const selectAdditionalCharges = createSelector(getAdditionalCharges, (state) => state.charges);
export const selectAdditionalChargesOrder = createSelector(getAdditionalCharges, (state) => state.order);

