import * as wizardActions from '../actions/wizard.actions';
import {VersionActionType} from '@models';

export interface State {
  meterId: string;
  isWizardMode: boolean;
  currentStep: number;
  isLocationWizard: boolean;
  shouldDisplayVersionPopup: boolean;
  versionDate: Date;
  comment: string;
  actionType: VersionActionType
}

export const initialState: State = {
  meterId: '',
  isWizardMode: false,
  currentStep: 0,
  isLocationWizard: false,
  shouldDisplayVersionPopup: true,
  versionDate: null,
  comment: '',
  actionType: VersionActionType.Overwrite
};


export function reducer(state = initialState, action: wizardActions.Action) {
  switch (action.type) {

    case wizardActions.TOGGLE_WIZARD: {
      return {
        ...state,
        isWizardMode: !state.isWizardMode
      };
    }

    case wizardActions.GO_TO_STEP: {
      return {
        ...state,
        currentStep: action.payload
      };

    }

    case wizardActions.UPDATE_METER_ID: {
      return {
        ...state,
        meterId: action.payload
      };
    }

    case wizardActions.RESET_WIZARD:
    case wizardActions.CLOSE_WIZARD: {
      return {
        ...initialState
      };
    }

    case wizardActions.WIZARD_LOCATION_APPOINTMENT: {
      return {
        ...state,
        isLocationWizard: action.payload
      };
    }

    case wizardActions.UPDATE_VERSION_DATA: {
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
export const getIsLocationWizard = (state: State) => state.isLocationWizard;
export const getShouldDisplayVersionPopup = (state: State) => state.shouldDisplayVersionPopup;

