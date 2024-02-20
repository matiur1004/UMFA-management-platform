import {
  getAddClosingReadingsStepState,
  getReplaceEquipmentStepState,
  getReplaceNodeTariffStepState,
  getReplaceWizardState
} from '../../reducers';
import * as replaceWizard from '../../reducers/replace-equipment-wizard-reducers/replace-wizard.store';
import {createSelector} from '@ngrx/store';

export const getWizardStep = createSelector(
  getReplaceWizardState,
  replaceWizard.getWizardStep
);

export const getIsLocationWizard = createSelector(
  getReplaceWizardState,
  replaceWizard.getIsLocationWizard
);

export const getMeterId = createSelector(
  getReplaceWizardState,
  replaceWizard.getMeterId
);

export const getSupplyType = createSelector(
  getReplaceWizardState,
  replaceWizard.getSupplyType
);

export const getIsWizardMode = createSelector(
  getReplaceWizardState,
  replaceWizard.getIsWizardMode
);

export const getWizardStepStates = createSelector(
  getReplaceWizardState,
  getAddClosingReadingsStepState,
  getReplaceEquipmentStepState,
  getReplaceNodeTariffStepState,
  (wizard, addClosingReadings, replaceEquipment, replaceNodeTariff) => {
    return {
      wizardState: wizard,
      addClosingReadingsState: addClosingReadings,
      replaceEquipmentState: replaceEquipment,
      replaceNodeTariffState: replaceNodeTariff
    };
  }
);
