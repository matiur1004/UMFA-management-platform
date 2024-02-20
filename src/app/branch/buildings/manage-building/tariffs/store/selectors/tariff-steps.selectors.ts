import {getTariffStepsState} from './building-tariffs.selectors';
import {createSelector} from '@ngrx/store';

export const getTariffStepsFormState = createSelector(
  getTariffStepsState,
  state => state.formState
);
