import * as replaceWizardActions from '../../actions/replace-equipment-wizard-actions/replace-wizard.actions';

import {VersionActionType} from '@models';

export interface State {
  meterId: string;
  supplyType: number;
  isWizardMode: boolean;
  currentStep: number;
  isLocationWizard: boolean;
  versionDate: Date;
  comment: string;
  actionType: VersionActionType;
}

export const initialState: State = {
  meterId: '',
  supplyType: -1,
  isWizardMode: false,
  currentStep: 0,
  isLocationWizard: false,
  versionDate: null,
  comment: 'Replace meter',
  actionType: VersionActionType.Overwrite
};


export function reducer(state = initialState, action: replaceWizardActions.Action) {
  switch (action.type) {

    case replaceWizardActions.TOGGLE_WIZARD: {
      return {
        ...state,
        isWizardMode: !state.isWizardMode
      };
    }

    case replaceWizardActions.GO_TO_STEP: {
      return {
        ...state,
        currentStep: action.payload
      };

    }

    case replaceWizardActions.UPDATE_METER_ID: {
      return {
        ...state,
        meterId: action.payload.meterId,
        supplyType: action.payload.supplyType
      };
    }

    case replaceWizardActions.RESET_WIZARD:
    case replaceWizardActions.CLOSE_WIZARD: {
      return {
        ...initialState
      };
    }

    case replaceWizardActions.SET_WIZARD_LOCATION_APPOINTMENT: {
      return {
        ...state,
        isLocationWizard: action.payload
      };
    }

    case replaceWizardActions.UPDATE_VERSION_DATA: {
      return {
        ...state,
        ...action.payload
      };
    }

    default:
      return state;
  }
}

export const getIsWizardMode = (state: State) => state.isWizardMode;
export const getWizardStep = (state: State) => state.currentStep;
export const getIsLocationWizard = (state: State) => state.isLocationWizard;
export const getMeterId = (state: State) => state.meterId;
export const getSupplyType = (state: State) => state.supplyType;
