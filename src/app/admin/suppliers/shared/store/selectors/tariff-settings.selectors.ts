import {getTariffSettings} from './common.selectors';
import {createSelector} from '@ngrx/store';


export const getTariffSteps = createSelector(
  getTariffSettings,
  s => s && s.stepsEnabled ? s.tariffSteps : []
);

export const getTariffCategories = createSelector(
  getTariffSettings,
  s => s && s.categoriesEnabled ? s.tariffCategories : []
);
