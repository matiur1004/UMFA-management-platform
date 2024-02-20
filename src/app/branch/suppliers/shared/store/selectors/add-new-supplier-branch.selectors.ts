import {createSelector} from '@ngrx/store';

import {getAddNewSupplierBranchState} from '../reducers';

export const selectSuppliers = createSelector(getAddNewSupplierBranchState, (state) => state.entities);
export const selectFormState = createSelector(getAddNewSupplierBranchState, (state) => state.formState);
export const selectCompleted = createSelector(getAddNewSupplierBranchState, (state) => state.completed);

