import {createSelector} from '@ngrx/store';

import {getTariffValuesFormState, getTariffValuesState} from './common.selectors';

export const selectTariffValues = createSelector(getTariffValuesState,
  state => state.tariffValues);
export const selectTariffValuesVersions = createSelector(getTariffValuesState, state => state.tariffValuesVersions);
export const selectTariffValuesPending = createSelector(getTariffValuesState, state => state.pending);
export const selectTariffValuesError = createSelector(getTariffValuesState, state => state.error);

export const selectTariffValuesForm = createSelector(getTariffValuesFormState, state => state.formState);
