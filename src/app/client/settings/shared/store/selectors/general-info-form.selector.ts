import {createSelector} from '@ngrx/store';

import {getGeneralInfoFormState} from '../reducers';

export const getGeneralInfoForm = createSelector(
  getGeneralInfoFormState,
  state => state.formState
);
