import {
  getAttributesStepState,
  getBulkWizardState,
  getRegistersAndReadingsState,
  getSetupStepState,
  getShopsStepState
} from '../../../reducers';

import * as bulkWizard from '../../bulk-equipment-wizard-reducers/bulk-wizard.store';
import {createSelector} from '@ngrx/store';


export const getWizardMode = createSelector(
  getBulkWizardState,
  bulkWizard.getWizardMode
);

export const getWizardStep = createSelector(
  getBulkWizardState,
  bulkWizard.getWizardStep
);

export const getShouldDisplayVersionPopup = createSelector(
  getBulkWizardState,
  bulkWizard.getShouldDisplayVersionPopup
);

export const getStepStates = createSelector(
  getBulkWizardState,
  getSetupStepState,
  getShopsStepState,
  getAttributesStepState,
  getRegistersAndReadingsState,
  (wizard, setupStep, shopsStep, attributesStep, registersAndReadingsStep) => {
    return {
      bulkWizardState: wizard,
      setupStepState: setupStep,
      shopsStepState: shopsStep,
      attributesStepState: attributesStep,
      registersAndReadingsStepState: registersAndReadingsStep
    }
  }
);
