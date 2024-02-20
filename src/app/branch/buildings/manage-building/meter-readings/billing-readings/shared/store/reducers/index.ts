import {ActionReducer, combineReducers, createFeatureSelector, createSelector, MetaReducer} from '@ngrx/store';

import * as fromBillingReading from './billing-readings.store';
import {MeterReadingDetails} from './billing-readings.store';
import * as enterReadingForm from './enter-reading-form.store';
import * as readingsHistoryState from '../state/readings-history.state';
import * as readingsHistoryReducers from './readings-history-reducers/readings-history.reducer';

import * as fromBuildingPeriods from '../../../../building-periods/shared/store/reducers/building-periods.store';
import * as fromBuildingPeriodForm from '../../../../building-periods/shared/store/reducers/building-period-form.store';

import {parseAsUTCDate} from 'app/shared/helper/date-extension';
import {getMonthYearName} from '../../../../building-periods/shared/helpers/date.helper';
import {BuildingPeriodViewModel} from '../../../../../shared/models/building-period.model';
import {OptionViewModel, RegisterType, RegisterViewModel} from '@models';
import {
  BillingReadingsFilterDetailViewModel,
  BillingReadingsFilterModel
} from '../../models/billing-reading-filter.model';
import {EnterReadingsShowFilter} from '../../models';

export interface State {
  billingReading: fromBillingReading.State;
  buildingPeriods: fromBuildingPeriods.State;
  buildingPeriodForm: fromBuildingPeriodForm.State;
  enterReadingForm: enterReadingForm.State;
  readingsHistory: readingsHistoryState.State;
}

export const reducers = combineReducers<State, any>({
  billingReading: fromBillingReading.reducer,
  buildingPeriods: fromBuildingPeriods.reducer,
  buildingPeriodForm: fromBuildingPeriodForm.reducer,
  enterReadingForm: enterReadingForm.reducer,
  readingsHistory: readingsHistoryReducers.reducer
});

export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function (state: State, action: any): State {
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<State>[] = [logger];

const _getState = createFeatureSelector<State>('meterReadings');

// #region Billing Readings Selectors

export const getBillingReadingsState = createSelector(
  _getState,
  (state: State) => state.billingReading
);


export const getMeterReadingDetails = createSelector(
  getBillingReadingsState,
  fromBillingReading.getMeterReadingDetails
);

export const getMeterReadingDetail = createSelector(
  getMeterReadingDetails,
  (metersDetails, props) => {
    const meterDetail = metersDetails.find(mr => mr.meterDetails.meterId === props.meterId);
    const register = meterDetail.registerReadings.find(r => r.registerId === props.registerId);
    return <MeterReadingDetails>{
      ...meterDetail,
      meterDetails: {
        ...meterDetail.meterDetails,
        meterReadingStats: {
          ...meterDetail.meterDetails.meterReadingStats,
          register
        }
      }
    };
  }
);

export const getBillingReadingsSearchKey = createSelector(
  getBillingReadingsState,
  fromBillingReading.getSearchKey
);

export const getBillingReadingsOrder = createSelector(
  getBillingReadingsState,
  fromBillingReading.getOrder
);

export const getBillingReadingsPage = createSelector(
  getBillingReadingsState,
  fromBillingReading.getPage
);

export const getBillingReadingsUnitsPerPage = createSelector(
  getBillingReadingsState,
  fromBillingReading.getUnitsPerPage
);

export const getTotalFilters = createSelector(
  getBillingReadingsState,
  (state: fromBillingReading.State) => state.filters && state.filters.length || 0
);

export const getUsageChart = createSelector(
  getBillingReadingsState,
  fromBillingReading.getUsageChart
);

export const getIsShowDetails = createSelector(
  getBillingReadingsState,
  fromBillingReading.getIsShowDetails
);

export const getIsShowVirtualRegisters = createSelector(
  getBillingReadingsState,
  fromBillingReading.getIsShowVirtualRegisters
);

export const getFilterDetail = createSelector(
  getBillingReadingsState,
  fromBillingReading.getFilterDetail
);

export const getBuildingPeriodsForMenu = createSelector(
  getBillingReadingsState,
  fromBillingReading.getBuildingPeriods
);

export const getLatestBuildingPeriodShortModel = createSelector(
  getBuildingPeriodsForMenu,
  (buildingPeriods: any) => {
    return buildingPeriods && buildingPeriods.length > 0 && !buildingPeriods[0].isFinalized && buildingPeriods[0];
  }
);

export const getTotal = createSelector(
  getBillingReadingsState,
  fromBillingReading.getTotal
);

export const getMeterReadingChart = createSelector(
  getBillingReadingsState,
  fromBillingReading.getMeterReadingChart
);

export const getMetersReadingStatsChart = createSelector(
  getBillingReadingsState,
  fromBillingReading.getMetersReadingStatsChart
);

export const getMeterReadingStatsChart = createSelector(
  getMetersReadingStatsChart,
  (meterReadings, props) => {
    return meterReadings.find(mr => mr.meterId === props.meterId);
  }
);

export const getPage = createSelector(
  getBillingReadingsState,
  fromBillingReading.getPage
);

export const getSelectedBuildingPeriodId = createSelector(
  getBillingReadingsState,
  fromBillingReading.getSelectedBuildingPeriodId
);

export const getSelectedBuildingPeriod = createSelector(
  getSelectedBuildingPeriodId,
  getBuildingPeriodsForMenu,
  (periodId, periods: BuildingPeriodViewModel[]) => {
    return periods.find(p => p.id === periodId);
  }
);

export const getAllRegisters = createSelector(getBillingReadingsState, fromBillingReading.getAllRegisters);
export const getAllNodes = createSelector(getBillingReadingsState, fromBillingReading.getAllNodes);
export const getAllUnits = createSelector(getBillingReadingsState, fromBillingReading.getAllUnits);
export const getAllLocations = createSelector(getBillingReadingsState, fromBillingReading.getAllLocations);
export const getFilters = createSelector(getBillingReadingsState, fromBillingReading.getFilters);
export const getAllTenants = createSelector(getBillingReadingsState, fromBillingReading.getAllTenants);
export const getAllReasons = createSelector(getBillingReadingsState, fromBillingReading.getAllReasons);

export const getSelectedRegister = createSelector(
  getFilterDetail,
  getAllRegisters,
  (filterDetails: BillingReadingsFilterDetailViewModel, registers: Array<RegisterViewModel>) => {
    return registers.find(p => p.id === filterDetails.checkedRegisterId);
  }
);

export const getAllFilters = createSelector(
  getFilters,
  (filters: BillingReadingsFilterModel[]) => {
    return filters;
  }
);

export const getActiveFilter = createSelector(
  getFilters,
  (filters: BillingReadingsFilterModel[]) => {
    return (filters || []).find(f => f.active);
  }
);

export const getSelectedNode = createSelector(
  getFilterDetail,
  getAllNodes,
  (filterDetails: BillingReadingsFilterDetailViewModel, nodes: OptionViewModel[]) => {
    return nodes.find(p => p.id === filterDetails.checkedNodeId);
  }
);

export const getSelectedReason = createSelector(
  getFilterDetail,
  getAllReasons,
  (filterDetails: BillingReadingsFilterDetailViewModel, reasons: OptionViewModel[]) => {
    return reasons && reasons.find(r => r.id === filterDetails.checkedReasonId);
  }
);

export const getSelectedLocation = createSelector(
  getFilterDetail,
  getAllLocations,
  (filterDetails: BillingReadingsFilterDetailViewModel, locations: OptionViewModel[]) => {
    return locations.find(p => p.id === filterDetails.checkedLocationId);
  }
);

export const getSelectedUnit = createSelector(
  getFilterDetail,
  getAllUnits,
  (filterDetails: BillingReadingsFilterDetailViewModel, units: OptionViewModel[]) => {
    return units.find(p => p.id === filterDetails.checkedUnitId);
  }
);

export const getSelectedTenant = createSelector(
  getFilterDetail,
  getAllTenants,
  (filterDetails: BillingReadingsFilterDetailViewModel, tenants: OptionViewModel[]) => {
    return tenants.find(p => p.id === filterDetails.checkedTenantId);
  }
);

export const getMeterIdToEnterReadings = createSelector(
  getBillingReadingsState,
  fromBillingReading.getMeterIdToEnterReadings
);

export const getEstimates = createSelector(
  getBillingReadingsState,
  fromBillingReading.getEstimates
);

export const getEstimatedReasons = createSelector(
  getBillingReadingsState,
  fromBillingReading.getAllReasons
);

export const getSelectedEstimatedReason = createSelector(
  getBillingReadingsState,
  fromBillingReading.getSelectedEstimatedReason
);

export const getPreviousReadingForEstimates = createSelector(
  getBillingReadingsState,
  fromBillingReading.getPreviousReadingForEstimates
);

export const getBillingReadingsItemsDetails = createSelector(
  getTotal,
  getBillingReadingsPage,
  getBillingReadingsUnitsPerPage,
  (totalItems, page, itemsPerPage) => {
    let text = '';

    if (itemsPerPage !== null) {
      let start = page * itemsPerPage - itemsPerPage + 1;
      // For implementing pagination need to change let end = page * itemsPerPage
      let end = page * totalItems;

      if (start > totalItems) {
        start = totalItems;
      }
      if (end > totalItems) {
        end = totalItems;
      }

      text = 'Showing ' + start + '-' + end + ' of ' + totalItems + ' meters';
    } else {
      text = 'Showing all ' + totalItems + ' meters';
    }

    return text;
  }
);

export const getConsecutiveEstimatedCounter = createSelector(
  getMeterReadingDetail,
  (meterReadingDetail: MeterReadingDetails, props) => {
    return meterReadingDetail.registerReadings
      .find(rr => rr.meterId === props.meterId && rr.registerId == props.registerId)
      .previousEstimatedReadingsCounter + 1
  }
);

export const getFilteredReasons = createSelector(
  getMeterReadingDetails,
  getAllReasons,
  (meterReadingDetails, allReasons) => {
    let resultReasons: OptionViewModel[] = [];

    meterReadingDetails.forEach(meter => {
      const filteredReasons = allReasons
        .filter(reason => meter.registerReadings
          .some(reading => reading.currentReadingReasonId === reason.id));

      resultReasons = resultReasons.concat(filteredReasons);
    });

    return [...new Set(resultReasons)];
  }
);

// #endregion

// #region Building Periods Selectors

export const getBuildingPeriodsState = createSelector(
  _getState,
  (state: any) => state.buildingPeriods
);

export const getFormState = createSelector(
  _getState,
  (state: any) => state.buildingPeriodForm
);

export const getBuildingPeriods = createSelector(
  getBuildingPeriodsState,
  fromBuildingPeriods.getBuildingPeriods
);

export const getBuildingPeriodsPage = createSelector(
  getBuildingPeriodsState,
  fromBuildingPeriods.getPage
);

export const getBuildingPeriodsPageSize = createSelector(
  getBuildingPeriodsState,
  fromBuildingPeriods.getPageSize
);

export const getBuildingPeriodsTotal = createSelector(
  getBuildingPeriodsState,
  fromBuildingPeriods.getBuildingPeriodsTotal
);

export const getBuildingPeriodReferences = createSelector(
  getBuildingPeriodsState,
  fromBuildingPeriods.getBuildingPeriodReferences
);

export const getBuildingPeriodsEditDialogMode = createSelector(
  getFormState,
  fromBuildingPeriodForm.getEditMode
);

export const getBuildingPeriodsEditModalRef = createSelector(
  getFormState,
  fromBuildingPeriodForm.getModalRef
);

export const getLatestBuildingPeriod = createSelector(
  getBuildingPeriods,
  (buildingPeriods: any) => {
    return buildingPeriods && buildingPeriods.length > 0 && !buildingPeriods[0].isFinalized && buildingPeriods[0];
  }
);

export const getPreviousBuildingPeriod = createSelector(
  getBuildingPeriods,
  (buildingPeriods: any) => {
    return buildingPeriods && buildingPeriods.length > 1 && !buildingPeriods[0].isFinalized && buildingPeriods[1];
  }
);

export const getBuildingPeriodsDictionary = createSelector(
  getBuildingPeriodReferences,
  (buildingPeriods: any) => {
    const result = buildingPeriods.reduce(function (map, p) {
      map[p.id] = p;
      return map;
    }, {});

    return result;
  }
);

export const getBuildingPeriodsWithLinked = createSelector(
  getBuildingPeriods,
  getBuildingPeriodsDictionary,
  (periods, periodsDict) => {
    return periods.map(p => {
      return {
        ...p,
        // eslint-disable-next-line no-prototype-builtins
        linkedBuildingPeriods: p.linkedBuildingPeriodIds.map(id => periodsDict.hasOwnProperty(id) ? periodsDict[id].name : id)
      };
    });
  }
);

export const getForm = createSelector(
  getFormState,
  fromBuildingPeriodForm.getFormState
);

export const getAllowedPeriodNames = createSelector(
  getForm,
  (form) => {
    const startDate = parseAsUTCDate(form.controls.startDate.value);
    const options = [];
    for (let i = -2; i <= 2; i++) {
      options.push(getMonthYearName(startDate, i));
    }
    return options;
  }
);

// #endregion

// #region Enter-reading

export const getEnterReadingState = createSelector(
  _getState,
  (state: any) => state.enterReadingForm
);

export const getEnterReadingFormState = createSelector(
  getEnterReadingState,
  enterReadingForm.getFormState
);

export const getEnterReadingFormIsSubmitted = createSelector(
  getEnterReadingState,
  enterReadingForm.getIsSubmitted
);

export const getEnterReadingSearchKey = createSelector(
  getEnterReadingState,
  enterReadingForm.getSearchKey
);

export const getEnterReadingSearchLocation = createSelector(
  getEnterReadingState,
  enterReadingForm.getSearchLocation
);

export function doRollover(currentReadingValue: number, previousReadingValue: number, dialCount: number): string {
  let dialStr = '';
  for (let i = 0; i < dialCount; i++) {
    dialStr += '9';
  }

  let dilNumber = +dialStr;

  let usage = currentReadingValue + dilNumber - previousReadingValue;

  return usage.toFixed(5);
}

export const getAbnormalityStatusAndUsage = createSelector(
  getEnterReadingFormState,
  (form) => {

    const value = form.value;


    return value.readings.reduce((acc, item) => {
      acc[item.meterId] = item.registers.reduce((rAcc, rItem) => {
        let abnormalityLevel = 0;
        let usage = null;

        if (rItem.currentReadingValue != null && !isNaN(rItem.currentReadingValue)) {
          if (rItem.registerType == RegisterType.ResetMax || rItem.registerType == RegisterType.Reset) {
            usage = rItem.currentReadingValue;
          } else if (!isNaN(rItem.previousReadingValue)) {
            if (rItem.isRollover) {
              usage = doRollover(rItem.currentReadingValue, rItem.previousReadingValue, rItem.dialCount)
            } else {
              usage = +((rItem.currentReadingValue - rItem.previousReadingValue).toFixed(5));
            }
          }
          const usageDiff = usage - rItem.averageUsage;
          abnormalityLevel = (usageDiff / rItem.averageUsage) * 100;
        }
        rItem.ratio = rItem.ratio ? rItem.ratio : 1;
        rAcc[rItem.registerTouKey] = {
          abnormalityLevel: abnormalityLevel,
          usage: usage *  rItem.ratio * rItem.registerScaleRatio,
          isRollover: rItem.isRollover
        };

        return rAcc;
      }, {});

      return acc;
    }, {});
  }
);

export const getEnterReadingFormShowFilter = createSelector(
  getEnterReadingState,
  enterReadingForm.getShowFilter
);

export const getEnterReadingFormShowFilterText = createSelector(
  getEnterReadingFormShowFilter,
  (showFilter) => {
    switch (showFilter) {
      case EnterReadingsShowFilter.HasNoReadings:
        return 'Has no readings';
      case EnterReadingsShowFilter.AllReadings:
      default:
        return 'All readings';
    }
  }
);

export const getEnterReadingFormShowFilterDate = createSelector(
  getEnterReadingState,
  enterReadingForm.getShowFilterDate
);

export const getEnterReadingRegisterFiles = createSelector(
  getEnterReadingState,
  enterReadingForm.getRegisterFiles
);

export const getReadingsForDate = createSelector(
  getEnterReadingState,
  enterReadingForm.getReadingsForDate
);

// #endregion

// #region Readings History

export const getReadingsHistoryState = createSelector(
  _getState,
  (state: any) => state.readingsHistory
);

// #endregion
