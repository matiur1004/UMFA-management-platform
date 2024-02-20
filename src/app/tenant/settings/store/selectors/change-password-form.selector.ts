import {createSelector} from '@ngrx/store';

import {getChangePasswordFormState} from '../../../store/reducers';

export const getChangePasswordForm = createSelector(
  getChangePasswordFormState,
  state => state.formState
);
