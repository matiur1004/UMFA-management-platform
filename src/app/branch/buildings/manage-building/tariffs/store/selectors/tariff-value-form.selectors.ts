import {getTariffValueFormState} from './building-tariffs.selectors';
import {createSelector} from '@ngrx/store';

export const getTariffValuesForm = createSelector(getTariffValueFormState, state => state.formState);



