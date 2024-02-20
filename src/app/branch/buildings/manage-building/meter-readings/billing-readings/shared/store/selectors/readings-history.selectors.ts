import {getReadingsHistoryState} from '../reducers';
import {createSelector} from '@ngrx/store';
import * as readingsHistory from '../state/readings-history.state';
import {MeterViewModel} from '../../models/readings-history.model';

const _getMeters = createSelector(
  getReadingsHistoryState,
  readingsHistory.getMeters
);

export const getMeterId = createSelector(
  getReadingsHistoryState,
  readingsHistory.getMeterId
);

const _getReadingRatio = (readings, registers) => {
  if (!readings) {
    return [];
  }
  return readings.map(r => {
    const register = registers.find(reg => reg.id === r.registerId);
    const ratio = (register && register.ratio) ? register.ratio : 0;
    return {
      ...r,
      ratio: ratio
    };
  });
};

export const getSelectedMeter = createSelector(
  _getMeters,
  getMeterId,
  (meters, meterId) => meters.find(m => m.id === meterId)
);

export const getReadings = createSelector(
  getReadingsHistoryState,
  getSelectedMeter,
  (state, meter) => {
    if (!meter) {
      return [];
    }
    return state.groupsOfReadings.map((group: any) => {
      return {
        ...group,
        readings: group.readings
        //readings: _getReadingRatio(group.readings, meter.registers)
      };
    });
  }
);

export const getReadingsAmount = createSelector(
  getReadingsHistoryState,
  readingsHistory.getReadingsAmount
);

const _getPinnedReadingRatio = (reading, registers) => {
  const register = registers.find(reg => reg.id === reading.registerId);
  return (register && register.ratio) ? register.ratio : 0;
};

export const getPinnedReadings = createSelector(
  getReadingsHistoryState,
  getSelectedMeter,
  (state, meter) => {
    if (!meter) {
      return [];
    }
    return state.pinnedReadings.map((reading) => {
      return {
        ...reading,
        ratio: _getPinnedReadingRatio(reading, meter.registers)
      };
    });
  }
);

export const getRegisterId = createSelector(
  getReadingsHistoryState,
  readingsHistory.getRegisterId
);

export const getTake = createSelector(
  getReadingsHistoryState,
  readingsHistory.getTake
);

export const getSkip = createSelector(
  getReadingsHistoryState,
  readingsHistory.getSkip
);

export const getSortBy = createSelector(
  getReadingsHistoryState,
  readingsHistory.getSortBy
);

export const getTimeOfUse = createSelector(
  getReadingsHistoryState,
  readingsHistory.getTimeOfUse
);

export const getStartDate = createSelector(
  getReadingsHistoryState,
  readingsHistory.getStartDate
);

export const getEndDate = createSelector(
  getReadingsHistoryState,
  readingsHistory.getEndDate
);

export const getFilterData = createSelector(
  getMeterId,
  getRegisterId,
  getTimeOfUse,
  getStartDate,
  getEndDate,
  getSortBy,
  getTake,
  getSkip,
  (meterId, registerId, timeOfUse, startDate, endDate, sortBy, take, skip) => ({
    meterId: meterId,
    registerId: registerId,
    timeOfUse: timeOfUse,
    sortBy: sortBy,
    startDate: startDate,
    endDate: endDate,
    take,
    skip
  })
);

export const getMeters = createSelector(
  _getMeters,
  getMeterId,
  (meters, meterId) => {
    if (meters && meters.length) {
      const metersMap: MeterViewModel[] = meters.map(m => {
        return {
          ...m,
          shortName: m.serialNumber ? m.serialNumber.substr(-4) : ''
        };
      });
      return {
        selectedMeter: metersMap.find(m => m.id === meterId),
        meters: metersMap.filter(m => m.id !== meterId).map(m =>
          ({id: m.id, serialNumber: m.serialNumber, shortName: m.shortName, supplyType: m.supplyType}))
      };
    } else {
      return {
        selectedMeter: null,
        meters: []
      };
    }
  }
);

const getRegTou = (regId, name, tou = null) => ({
  id: regId,
  timeOfUse: tou,
  name: name
});

export const getRegisters = createSelector(
  getMeters,
  getRegisterId,
  (meters, registerId) => {
    const meter = meters.selectedMeter;
    if (meter) {
      const register = meter.registers.find(r => r.id === registerId);
      return {
        selectedRegisterTimeOfUse: register ? getRegTou(register.id, register.name, register.timeOfUse) : null,
        registersTimeOfUses: meter.registers.reduce((acc, curr) => {
          acc.push(getRegTou(curr.id, curr.name, curr.timeOfUse));
          return acc;
        }, [])
      };
    } else {
      return {
        selectedRegisterTimeOfUse: null,
        registersTimeOfUses: []
      };
    }
  }
);
