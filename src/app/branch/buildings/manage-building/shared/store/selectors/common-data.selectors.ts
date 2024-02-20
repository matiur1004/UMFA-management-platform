import {UnitOfMeasurement, UnitOfMeasurementScale} from '@models';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {State} from '../state/common-data.state';

const getCommonDataState = createFeatureSelector('building');

const createUnitsOfMeasurementScalesDictionary = (unitsOfMeasurement: UnitOfMeasurement[] = []) => {
  return unitsOfMeasurement.reduce((acc, curr: UnitOfMeasurement) => {
    acc[curr.unitType] = curr.scales.reduce((accScale, currScale: UnitOfMeasurementScale) => {
      accScale[currScale.id] = currScale;
      return accScale;
    }, {});
    return acc;
  }, {});
};

export const getBuildingId = createSelector(
  getCommonDataState,
  (state: State) => state.buildingId
);

export const getIsFinalized = createSelector(
  getCommonDataState,
  (state: State) => state.isFinalized
);

export const getSelectedVersionId = createSelector(
  getCommonDataState,
  (state: State) => state.versionId
);

export const getActiveBuildingPeriod = createSelector(
  getCommonDataState,
  (state: State) => state.activeBuildingPeriod
);

export const getHistoryLogs = createSelector(
  getCommonDataState,
  (state: State) => state.history
);

export const getIsComplete = createSelector(
  getCommonDataState,
  (state: State) => state.isComplete
);

export const getAttributes = createSelector(
  getCommonDataState,
  (state: State) => state.attributes
);

export const getRegisters = createSelector(
  getCommonDataState,
  (state: State) => state.registers
);

export const getUnitsOfMeasurement = createSelector(
  getCommonDataState,
  (state: State) => state.unitsOfMeasurement
);

export const getUnitsOfMeasurementScales = createSelector(
  getUnitsOfMeasurement,
  (unitsOfMeasurement: UnitOfMeasurement[]) => {
    if (unitsOfMeasurement && unitsOfMeasurement.length) {
      return createUnitsOfMeasurementScalesDictionary(unitsOfMeasurement);
    }
    return {};
  }
);

export const getIsDisableChangeVersionStatus = createSelector(
  getCommonDataState,
  (state: State) => state.disableChangeVersion
);

export const getRedirectUrl = createSelector(
  getCommonDataState,
  (state: State) => state.redirectUrl
);

export const getHistory = createSelector(
  getHistoryLogs,
  (logs) => logs.reduce((acc, l) => {
    acc[l.id] = l;
    return acc;
  }, {})
);

export const getHistoryIds = createSelector(
  getHistoryLogs,
  (logs) => logs.map(l => l.id)
);

export const getSelectedHistoryLog = createSelector(
  getHistory,
  getSelectedVersionId,
  (history, versionId) => {
    if (versionId == null) {
      return null;
    }
    return history[versionId];
  }
);

export const getIsLastVersion = createSelector(
  getHistoryIds,
  getSelectedVersionId,
  (historyIds, versionId) => {
    let isLastVersion = false;

    historyIds.forEach(id => {
      if (!isLastVersion && id != versionId) {
        isLastVersion = true;
      }
    });

    return isLastVersion;
  }
);
