import {createSelector} from '@ngrx/store';

import {getAddNewProfileFormState} from '../reducers';
import * as addNewProfile from '../reducers/add-new-profile-form.store';

export const getAddNewProfileForm = createSelector(
  getAddNewProfileFormState,
  state => state.formState
);

export const getTenantBuiding = createSelector(
  getAddNewProfileFormState,
  addNewProfile.getTenantBuilding
);
