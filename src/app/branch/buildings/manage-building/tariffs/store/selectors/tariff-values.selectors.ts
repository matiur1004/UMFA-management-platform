import {createSelector} from "@ngrx/store";
import {getTariffValuesState} from './building-tariffs.selectors';

export const selectTariffValues = createSelector(getTariffValuesState,
  state => state.tariffValues);
export const selectTariffValuesVersions = createSelector(getTariffValuesState, state => state.tariffValuesVersions);
export const selectTariffValuesPending = createSelector(getTariffValuesState, state => state.pending);
export const selectTariffValuesError = createSelector(getTariffValuesState, state => state.error);
