import * as commonDataActions from '../actions/common-data.action';
import {State} from '../state/common-data.state';

export const initialState: State = {
  buildingId: '',
  history: [],
  versionId: null,
  isComplete: false,
  disableChangeVersion: false,
  attributes: null,
  registers: null,
  unitsOfMeasurement: null,
  redirectUrl: '',
  activeBuildingPeriod: null,
  isFinalized: false
};

export function reducer(state = initialState, action: commonDataActions.Action) {
  switch (action.type) {
    case commonDataActions.LOAD_ACTIVE_BUILDING_PERIOD_COMPLETE: {
      return {
        ...state,
        activeBuildingPeriod: action.payload.activeBuildingPeriod
      };
    }

    case commonDataActions.SET_EQUIPMENT_ATTRIBUTES: {
      return {
        ...state,
        attributes: action.payload
      };
    }

    case commonDataActions.SET_UNITS_OF_MEASUREMENT: {
      return {
        ...state,
        unitsOfMeasurement: action.payload
      };
    }

    case commonDataActions.SET_EQUIPMENT_REGISTERS: {
      return {
        ...state,
        registers: action.payload
      };
    }

    case commonDataActions.LOAD_BUILDING_HISTORY_COMPLETE: {
      const {logs, isComplete, versionId, buildingId} = action.payload;
      let selectedVersionId = null;
      if (versionId && logs.find(v => v.id === versionId)) {
        selectedVersionId = versionId;
      } else {
        const v = logs.find(s => s.isActualVersion);
        if (v) {
          selectedVersionId = v.id;
        } else if (logs.length) {
          selectedVersionId = logs[0].id;
        }
      }
      return {
        ...state,
        history: logs,
        isComplete,
        versionId: selectedVersionId,
        buildingId
      };
    }

    case commonDataActions.HISTORY_CHANGE: {
      return {
        ...state,
        versionId: action.payload
      };
    }

    case commonDataActions.DISABLE_CHANGING_VERSION: {
      return {
        ...state,
        disableChangeVersion: action.payload
      };
    }

    case commonDataActions.SET_NAVIGATION_URL: {
      return {
        ...state,
        redirectUrl: action.payload
      };
    }
    
    case commonDataActions.SET_IS_FINALIZED: {
      return {
        ...state,
        isFinalized: action.payload
      };
    }

    default:
      return state;
  }
}
