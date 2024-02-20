import {getTariffCategoriesState} from './building-tariffs.selectors';
import {createSelector} from '@ngrx/store';

export const getTariffCategoriesFormState = createSelector(
  getTariffCategoriesState,
  state => state.formState
);
