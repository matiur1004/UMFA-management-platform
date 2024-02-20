import {createSelector} from '@ngrx/store';

import {getGeneralInfoFormState} from '../../../store/reducers';
import * as generalInfoForm from '../reducers/general-info-form.reducer';

export const getGeneralInfoForm = createSelector(
  getGeneralInfoFormState,
  state => state.formState
);

export const getLogo = createSelector(
  getGeneralInfoFormState,
  generalInfoForm.getLogo
);
