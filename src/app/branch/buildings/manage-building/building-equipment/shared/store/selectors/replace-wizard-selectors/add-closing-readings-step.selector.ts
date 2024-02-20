import {getAddClosingReadingsStepState} from '../../reducers';
import * as addClosingReadingsStep
  from '../../reducers/replace-equipment-wizard-reducers/add-closing-readings-step.store';
import {createSelector} from '@ngrx/store';

export const getFormState = createSelector(
  getAddClosingReadingsStepState,
  addClosingReadingsStep.getFormState
);

export const getRegisterFiles = createSelector(
  getAddClosingReadingsStepState,
  addClosingReadingsStep.getRegisterFiles
);

export const getReplacementDate = createSelector(
  getFormState,
  form => form.value.replacementDate
);
