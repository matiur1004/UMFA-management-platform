import * as bulkWizardActions from '../../actions/bulk-equipment-wizard-actions/bulk-wizard.actions';

import {VersionActionType} from '@models';
import {MeterDetailsViewModel} from '../../../../../meter-readings/billing-readings/shared/models/billing-reading.model';

export interface State {
  meters: MeterDetailsViewModel[];
  isWizardMode: boolean;
  currentStep: number;
  shouldDisplayVersionPopup: boolean;
  versionDate: Date;
  comment: string;
  actionType: VersionActionType;
}

export const initialState: State = {
  meters: [],
  isWizardMode: false,
  currentStep: 0,
  shouldDisplayVersionPopup: true,
  versionDate: null,
  comment: '',
  actionType: VersionActionType.Overwrite
};

export function reducer(state = initialState, action: bulkWizardActions.Action) {
  switch (action.type) {

    case bulkWizardActions.TOGGLE_WIZARD: {
      return {
        ...state,
        isWizardMode: !state.isWizardMode
      };
    }

    case bulkWizardActions.GO_TO_STEP: {
      return {
        ...state,
        currentStep: action.payload
      };

    }

    case bulkWizardActions.UPDATE_METERS_ID: {
      return {
        ...state,
        metersId: action.payload
      };
    }

    case bulkWizardActions.RESET_WIZARD:
    case bulkWizardActions.CLOSE_WIZARD: {
      return {
        ...initialState
      };
    }

    case bulkWizardActions.UPDATE_VERSION_DATA: {
      return {
        ...state,
        ...action.payload
      };
    }

    default:
      return state;
  }
}

export const getWizardMode = (state: State) => state.isWizardMode;
export const getWizardStep = (state: State) => state.currentStep;
export const getShouldDisplayVersionPopup = (state: State) => state.shouldDisplayVersionPopup;
