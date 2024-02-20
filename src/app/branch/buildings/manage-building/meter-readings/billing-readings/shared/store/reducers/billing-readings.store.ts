import {
  MeterRegisterMonthlyBasedEstimateViewModel,
  MeterRegisterYearBasedEstimateViewModel
} from './../../models/meter-register-daily-estimate.model';
import {VirtualRegisterType} from '@app/branch/buildings/manage-building/building-equipment/shared/models';
import {OptionViewModel, ReadingSource, SupplyType, TimeOfUse, UNITS_PER_PAGE} from '@models';

import {BuildingPeriodViewModel} from '../../../../../shared/models/building-period.model';
import {
  BillingReadingsFilterDetailViewModel,
  BillingReadingsFilterModel,
  ReadingSourceCheck
} from '../../models/billing-reading-filter.model';
import {MeterRegisterDailyEstimateViewModel} from '../../models/meter-register-daily-estimate.model';
import * as billingReadingsActions from '../actions/billing-readings.actions';

import {EstimatedReadingReasonViewModel} from '@app/shared/models/estimated-reading-reason';
import {
  BillingReadingChartUsagesEnum,
  MeterReadingChartViewModel
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/models';

export interface EstimationData {
  previousReading: number;
  dailyBasedEstimates: MeterRegisterDailyEstimateViewModel[];
  monthlyBasedEstimates: MeterRegisterMonthlyBasedEstimateViewModel;
  yearBasedEstimates: MeterRegisterYearBasedEstimateViewModel;
  estimatedReason: EstimatedReadingReasonViewModel;
  dialCount: number;

  periodDuration: number;
  currentBpStartDate: Date;
  currentBpEndDate: Date;
}

export enum ChartView {
  LINE,
  BAR
}

export interface IMeterReadingStats {
  activeTabId: number;
  register: MeterReading;
  averageUsage: boolean;
  chartView: ChartView;
}

export interface State {
  meterReadingDetails: Array<MeterReadingDetails>;
  meterReadingChart: Array<MeterReadingChartViewModel>;
  metersReadingStatsChart: MeterReadingChartViewModel[];
  searchKey: string;
  total: number;
  order: number;
  page: number;
  unitsPerPage: number | null;
  isShowDetails: boolean;
  chartUsage: BillingReadingChartUsagesEnum;
  isShowVirtualRegisters: boolean;
  allRegisters: OptionViewModel[];
  allNodes: OptionViewModel[];
  allUnits: OptionViewModel[];
  allLocations: OptionViewModel[];
  allTenants: OptionViewModel[];
  allReasons: OptionViewModel[];
  filters: BillingReadingsFilterModel[];
  filterDetail: BillingReadingsFilterDetailViewModel;
  buildingPeriods: BuildingPeriodViewModel[];
  selectedBuildingPeriodId: string;
  meterIdToEnterReadings: string;
  estimationData: EstimationData;
}

export interface MeterReadingDetails {
  meterDetails: MeterDetail;
  registerReadings: Array<MeterReading>;
}

export class MeterReading {
  meterId: string;
  registerId: string;
  timeOfUse: TimeOfUse;
  virtualRegisterType: VirtualRegisterType | null;
  registerName: string;
  ratio: number;
  periodEndDate: Date;
  periodDurationDays: number;
  previousReadingValue: number;
  previousReadingSource: number;
  previousReadingDate: number;
  previousReadingNotes: string;
  previousReadingCreatedByUserName: number;
  previousReadingImage: string;
  previousReadingHasImage: boolean;
  previousEstimatedReadingsCounter: number;
  isPreviousReadingConfirmed: boolean;
  previousReadingId: string;
  usage: number;
  averageUsage: number;
  estimatedReadingValue: number;
  currentReadingValue: number;
  currentReadingReasonId: string;
  currentReadingDate: Date;
  currentReadingSource: ReadingSource;
  currentReadingNotes: any;
  currentReadingCreatedByUserName: string;
  currentReadingImage: string;
  currentReadingHasImage: boolean;
  currentReadingId: string;
  currentEstimatedReadingsCounter: number;
  isCurrentReadingConfirmed: boolean;
  precedingReadingValue: string;
  precedingReadingDistanceDays: string;
  precedingReadingDate: Date;
  followingReadingValue: string;
  followingReadingDistanceDays: string;
  followingReadingDate: Date;
  usageHistory: any;
  abnormalityLevel: number;
  isEndDateReading: boolean;
  isShowDetails: boolean;
  isRollover: boolean;
}

export interface MeterDetail {
  meterId: string;
  sequence: null;
  serialNumber: string;
  location: string;
  supplyType: SupplyType;
  registers: Array<any>;
  shops: Array<string>;
  tenants: Array<string>;
  nodes: Array<string>;
  isExpanded: boolean;
  meterReadingStats: IMeterReadingStats;
}

export const initialState: State = {
  meterReadingChart: [],
  metersReadingStatsChart: [],
  meterReadingDetails: [],
  searchKey: '',
  total: UNITS_PER_PAGE[1],
  order: 1,
  page: 1,
  unitsPerPage: 30,
  isShowDetails: false,
  isShowVirtualRegisters: false,
  chartUsage: BillingReadingChartUsagesEnum.None,
  allRegisters: [],
  allNodes: [],
  allUnits: [],
  allLocations: [],
  allTenants: [],
  allReasons: [],
  filters: [],
  filterDetail: new BillingReadingsFilterDetailViewModel(),
  buildingPeriods: [],
  selectedBuildingPeriodId: null,
  meterIdToEnterReadings: null,
  estimationData: null
};

export function reducer(state = initialState, action: billingReadingsActions.Action) {
  switch (action.type) {

    case billingReadingsActions.REQUEST_BUILDING_PERIODS_LIST_COMPLETE: {
      return {
        ...state,
        buildingPeriods: action.payload,
        selectedBuildingPeriodId: action.payload.length ? action.payload[0].id : null
      };
    }

    case billingReadingsActions.REQUEST_BUILDING_BILLING_READINGS_LIST_COMPLETE: {
      let meterDetails: MeterReadingDetails[] = [...action.payload.items];

      meterDetails = meterDetails.map(mr => ({
        ...mr,
        meterDetails: {
          ...mr.meterDetails,
          meterReadingStats: {
            register: null,
            chartView: ChartView.BAR,
            averageUsage: false,
            activeTabId: BillingReadingChartUsagesEnum.CurrentPeriod
          }
        }
      }))

      return {
        ...state,
        meterReadingDetails: meterDetails,
        total: action.payload.total
      };
    }

    case billingReadingsActions.UPDATE_ORDER: {
      return {
        ...state,
        order: action.payload
      };
    }

    case billingReadingsActions.TOGGLE_REGISTER_DETAILS: {
      const meterId = action.payload.meterId;
      const registerId = action.payload.registerId;
      const updatedState = {
        ...state,
        meterReadingDetails: state.meterReadingDetails.map(mr => {
          return {
            ...mr,
            registerReadings: [...mr.registerReadings].map(r => (r.meterId === meterId && r.registerId === registerId) ? ({
              ...r,
              isShowDetails: !r.isShowDetails
            }) : {...r, isShowDetails: false})
          };

        })
      };

      const selectedMeter = updatedState.meterReadingDetails.find(mr => mr.meterDetails.meterId === meterId);
      const meterRegister = [...selectedMeter.registerReadings].find(r => r.registerId === registerId);
      let isExpanded = false;

      if (meterRegister.meterId === selectedMeter.meterDetails.meterId) {
        isExpanded = meterRegister.isShowDetails;
      }

      updatedState.meterReadingDetails.forEach(mr => {
        if (mr.meterDetails.meterId === meterId) {
          mr.meterDetails = {
            ...mr.meterDetails,
            isExpanded,
            meterReadingStats: {
              ...mr.meterDetails.meterReadingStats,
              register: meterRegister,
              chartView: ChartView.BAR,
              averageUsage: false,
              activeTabId: BillingReadingChartUsagesEnum.CurrentPeriod
            }
          };
        } else {
          mr.meterDetails = {
            ...mr.meterDetails,
            isExpanded: false
          };
        }
      });

      return updatedState;
    }

    case billingReadingsActions.UPDATE_SEARCH_KEY: {
      return {
        ...state,
        searchKey: action.payload,
        page: 1
      };
    }

    case billingReadingsActions.UPDATE_PAGE: {
      return {
        ...state,
        page: action.payload
      };
    }

    case billingReadingsActions.RESET_FILTER: {
      const filters = [...state.filters].map(f => ({...f, active: false}));

      return {
        ...state,
        filters
      };
    }

    case billingReadingsActions.CHANGE_ACTIVE_FILTER: {
      const {payload} = action;
      const filterDetail = state.filterDetail;
      const filters = state.filters.map(f => f.id === payload.id ? {
        ...f,
        active: !payload.active
      } : {...f, active: false});

      const filterIndex = filters.findIndex(f => f.id === payload.id);
      const activeFilter: BillingReadingsFilterModel = filters[filterIndex];

      const newFilterDetail = new BillingReadingsFilterDetailViewModel();
      const activeSources = activeFilter.readingSources;
      newFilterDetail.sources = [...filterDetail.sources].map(source =>
        activeSources.includes(source.readingSource) ? ({
            readingSource: source.readingSource,
            isChecked: true
          })
          : ({
            readingSource: source.readingSource,
            isChecked: false
          })
      );

      newFilterDetail.id = activeFilter.id;
      newFilterDetail.checkedSupplyType = [...activeFilter.supplyTypes];
      newFilterDetail.checkedRegisterId = activeFilter.registerId || '';
      newFilterDetail.supplyTypes = filterDetail.supplyTypes;
      newFilterDetail.checkedNodeId = activeFilter.nodeId || '';
      newFilterDetail.checkedUnitId = activeFilter.unitId || '';
      newFilterDetail.checkedLocationId = activeFilter.locationId || '';
      newFilterDetail.checkedTenantId = activeFilter.tenantId || '';
      newFilterDetail.checkedReasonId = activeFilter.reasonId || '';
      newFilterDetail.isBillingOnlyRegisters = activeFilter.billingOnly;
      newFilterDetail.readingCategory = activeFilter.readingCategory;
      newFilterDetail.abnormalityFilterData = Object.assign({}, activeFilter.abnormalityFilterData);

      return {
        ...state,
        filters,
        filterDetail: newFilterDetail
      };
    }

    case billingReadingsActions.GET_METER_READINGS_CHART_SUCCESS: {
      return {
        ...state,
        meterReadingChart: [...action.payload.charts]
      };
    }

    case billingReadingsActions.GET_METER_READINGS_STATS_CHART_SUCCESS: {
      let metersReadingStatsChart = [...state.metersReadingStatsChart];
      // Check if data is array for None chart Usages.
      if (Array.isArray(action.payload)) {
        const meterReadingDetails = state.meterReadingDetails.map(mr => ({
          ...mr,
          meterDetails: {
            ...mr.meterDetails,
            meterReadingStats: {
              register: mr.registerReadings[0],
              chartView: ChartView.BAR,
              isCurrentPeriodLoaded: true,
              averageUsage: false,
              activeTabId: BillingReadingChartUsagesEnum.CurrentPeriod
            }
          }
        }));

        return {
          ...state,
          metersReadingStatsChart: action.payload,
          meterReadingDetails
        };
      }

      const {meterId} = action.payload;

      const isMeterExist = metersReadingStatsChart.some(mr => mr.meterId === meterId);
      let meterReadingDetails = [...state.meterReadingDetails];

      if (isMeterExist) {
        const meterIdx = metersReadingStatsChart.findIndex(mr => mr.meterId === meterId);

        meterReadingDetails[meterIdx] = {
          ...meterReadingDetails[meterIdx]
        };

        metersReadingStatsChart[meterIdx] = {
          ...metersReadingStatsChart[meterIdx],
          ...action.payload
        };

      } else {
        metersReadingStatsChart = [...metersReadingStatsChart, action.payload];
      }

      return {
        ...state,
        meterReadingDetails,
        metersReadingStatsChart,
      };
    }

    case billingReadingsActions.UPDATE_FILTER_COMPLETE: {
      const filters = [...state.filters];
      const filterIndex = filters.findIndex(f => f.id === action.payload.id);

      filters[filterIndex] = {
        ...filters[filterIndex],
        ...action.payload
      };

      return {...state, filters};
    }

    case billingReadingsActions.GET_ALL_FILTERS_SUCCESS: {
      return {...state, filters: action.payload};
    }

    case billingReadingsActions.UPDATE_UNITS_PER_PAGE: {
      return {
        ...state,
        unitsPerPage: action.payload
      };
    }

    case billingReadingsActions.UPDATE_IS_SHOW_DETAILS: {
      const isShowDetails = state.isShowDetails;
      return {
        ...state,
        isShowDetails: !isShowDetails,
        meterReadingDetails: state.meterReadingDetails.map(mr => {
          return {
            ...mr,
            meterDetails: {
              ...mr.meterDetails,
              isExpanded: !isShowDetails
            }
          };
        })
      };
    }

    case billingReadingsActions.INIT_FILTER_DATA_COMPLETE: {
      return {
        ...state,
        allRegisters: action.payload.registers,
        allNodes: action.payload.nodes,
        allUnits: action.payload.units,
        allLocations: action.payload.locations,
        allTenants: action.payload.tenants,
        allReasons: action.payload.reasons
      };
    }

    case billingReadingsActions.ADD_FILTER_SUCCESS: {
      const filters = [...state.filters, action.payload];

      return {
        ...state,
        filters
      };
    }

    case billingReadingsActions.CHANGE_AVERAGE_USAGE: {
      const {meterId} = action.payload;
      const meterIdx = state.meterReadingDetails.findIndex(mr => mr.meterDetails.meterId === meterId);
      const selectedMeter = state.meterReadingDetails[meterIdx];

      let meterReadingsDetails = [...state.meterReadingDetails];

      meterReadingsDetails[meterIdx] = {
        ...selectedMeter,
        meterDetails: {
          ...selectedMeter.meterDetails,
          meterReadingStats: {
            ...selectedMeter.meterDetails.meterReadingStats,
            averageUsage: !selectedMeter.meterDetails.meterReadingStats.averageUsage,
            activeTabId: selectedMeter.meterDetails.meterReadingStats.activeTabId
          }
        }
      }

      return {
        ...state,
        meterReadingDetails: meterReadingsDetails
      };
    }

    case billingReadingsActions.CHANGE_REGISTER_STATS: {
      const {meterId, register} = action.payload;
      const meterIdx = state.meterReadingDetails.findIndex(mr => mr.meterDetails.meterId === meterId);
      const selectedMeter = state.meterReadingDetails[meterIdx];

      state.meterReadingDetails[meterIdx] = {
        ...selectedMeter,
        meterDetails: {
          ...selectedMeter.meterDetails,
          meterReadingStats: {
            ...selectedMeter.meterDetails.meterReadingStats,
            register: register
          }
        }
      }

      return {
        ...state,
        meterReadingDetails: state.meterReadingDetails
      };
    }

    case billingReadingsActions.CHANGE_CHART_VIEW: {
      const {meterId, chartView} = action.payload;
      const meterIdx = state.meterReadingDetails.findIndex(mr => mr.meterDetails.meterId === meterId);
      const selectedMeter = state.meterReadingDetails[meterIdx];

      state.meterReadingDetails[meterIdx] = {
        ...selectedMeter,
        meterDetails: {
          ...selectedMeter.meterDetails,
          meterReadingStats: {
            ...selectedMeter.meterDetails.meterReadingStats,
            chartView: chartView,
            activeTabId: selectedMeter.meterDetails.meterReadingStats.activeTabId
          }
        }
      };

      return {
        ...state,
        meterReadingDetails: state.meterReadingDetails
      };
    }

    case billingReadingsActions.CHANGE_ACTIVE_TAB: {
      const {meterId, tabId} = action.payload;
      const meterIdx = state.meterReadingDetails.findIndex(mr => mr.meterDetails.meterId === meterId);
      const selectedMeter = state.meterReadingDetails[meterIdx];
      state.meterReadingDetails[meterIdx] = {
        ...selectedMeter,
        meterDetails: {
          ...selectedMeter.meterDetails,
          meterReadingStats: {
            ...selectedMeter.meterDetails.meterReadingStats,
            activeTabId: tabId
          }
        }
      };

      return {
        ...state,
        meterReadingDetails: state.meterReadingDetails
      };
    }


    case billingReadingsActions.REMOVE_FILTER_SUCCESS: {
      const filters = [...state.filters];
      const activeFilterIndex = filters.findIndex(f => f.id === action.payload.id);
      filters.splice(activeFilterIndex, 1);

      return {
        ...state,
        filters
      };
    }

    case billingReadingsActions.UPDATE_IS_SHOW_VIRTUAL_REGISTERS: {
      const isShowVirtualRegisters = state.isShowVirtualRegisters;

      return {
        ...state,
        isShowVirtualRegisters: !isShowVirtualRegisters
      };
    }

    case billingReadingsActions.INIT_FILTER_DETAIL:
    case billingReadingsActions.CANCEL_FILTER: {
      const supplyTypes = [SupplyType.Electricity, SupplyType.Water, SupplyType.Sewerage, SupplyType.Gas, SupplyType.AdHoc];

      let sourceTypes = new Array<ReadingSourceCheck>();
      sourceTypes = [
        {readingSource: ReadingSource.ManualCapture, isChecked: false},
        {readingSource: ReadingSource.Import, isChecked: false},
        {readingSource: ReadingSource.Estimate, isChecked: false},
        {readingSource: ReadingSource.AmrImport, isChecked: false},
        {readingSource: ReadingSource.MobileApp, isChecked: false}
      ];

      const filterDetail = Object.assign(new BillingReadingsFilterDetailViewModel(),
        {supplyTypes: supplyTypes},
        {sources: sourceTypes}
      );

      return {
        ...state,
        filterDetail: filterDetail
      };
    }

    case billingReadingsActions.UPDATE_SUPPLY_TYPE: {
      const filterDetail = Object.assign({}, state.filterDetail);
      if (filterDetail.checkedSupplyType.some(sType => sType === action.payload)) {
        filterDetail.checkedSupplyType = filterDetail.checkedSupplyType.filter(st => st !== action.payload);
      } else {
        filterDetail.checkedSupplyType.push(action.payload);
      }

      return {
        ...state,
        filterDetail: filterDetail
      };
    }

    case billingReadingsActions.UPDATE_READING_SOURCE: {
      const filterDetail = Object.assign({}, state.filterDetail);
      filterDetail.sources = state.filterDetail.sources.map((item, index) => {
        if (item.readingSource !== action.payload.readingSource) {
          return item;
        } else {
          const {isChecked} = action.payload;

          return {...item, isChecked: !isChecked};
        }
      });
      return {
        ...state,
        filterDetail: filterDetail
      };
    }

    case billingReadingsActions.UPDATE_REGISTER: {
      const filterDetail = Object.assign({}, state.filterDetail);
      filterDetail.checkedRegisterId = action.payload;
      return {
        ...state,
        filterDetail: filterDetail
      };
    }

    case billingReadingsActions.UPDATE_READING_CATEGORY: {
      const filterDetail = Object.assign({}, state.filterDetail);
      filterDetail.readingCategory = action.payload;
      return {
        ...state,
        filterDetail: filterDetail
      };
    }

    case billingReadingsActions.UPDATE_IS_BILLING_ONLY_OPTION: {
      const filterDetail = Object.assign({}, state.filterDetail);
      filterDetail.isBillingOnlyRegisters = !filterDetail.isBillingOnlyRegisters;
      return {
        ...state,
        filterDetail: filterDetail
      };
    }

    case billingReadingsActions.UPDATE_NODE: {
      const filterDetail = Object.assign({}, state.filterDetail);
      filterDetail.checkedNodeId = action.payload;
      return {
        ...state,
        filterDetail: filterDetail
      };
    }

    case billingReadingsActions.UPDATE_REASON: {
      const filterDetail = Object.assign({}, state.filterDetail);
      filterDetail.checkedReasonId = action.payload;
      return {
        ...state,
        filterDetail: filterDetail
      };
    }

    case billingReadingsActions.UPDATE_UNIT: {
      const filterDetail = Object.assign({}, state.filterDetail);
      filterDetail.checkedUnitId = action.payload;
      return {
        ...state,
        filterDetail: filterDetail
      };
    }

    case billingReadingsActions.UPDATE_TENANT: {
      const filterDetail = Object.assign({}, state.filterDetail);
      filterDetail.checkedTenantId = action.payload;
      return {
        ...state,
        filterDetail: filterDetail
      };
    }

    case billingReadingsActions.UPDATE_METER_LOCATION: {
      const filterDetail = Object.assign({}, state.filterDetail);
      filterDetail.checkedLocationId = action.payload;
      return {
        ...state,
        filterDetail: filterDetail
      };
    }

    case billingReadingsActions.UPDATE_ABNORMALITY_LEVEL: {
      const filterDetail = Object.assign({}, state.filterDetail);
      filterDetail.abnormalityFilterData = action.payload;
      return {
        ...state,
        filterDetail: filterDetail
      };
    }

    case billingReadingsActions.CHANGE_CHART_USAGE: {
      return {
        ...state,
        isShowDetails: false,
        chartUsage: action.payload
      };
    }

    case billingReadingsActions.UPDATE_BUILDING_PERIOD: {

      if (action.payload === state.selectedBuildingPeriodId) {
        return state;
      }

      return {
        ...state,
        selectedBuildingPeriodId: action.payload
      };
    }

    case billingReadingsActions.UPDATE_METER_ID_TO_ENTER_READINGS: {

      return {
        ...state,
        meterIdToEnterReadings: action.payload
      };
    }

    case billingReadingsActions.READINGS_LIST_OPEN_ESTIMATION_FROM_CONTEXT_MENU: {
      return {
        ...state,
        estimationData: null
      };
    }

    case billingReadingsActions.ESTIMATION_REASONS_LOADED: {
      return {

        ...state,
        reasons: action.payload
      };
    }

    case billingReadingsActions.ESTIMATION_OPTIONS_LOADED: {
      return {
        ...state,
        estimationData: action.payload
      };
    }

    case billingReadingsActions.TOGGLE_METER_READING: {
      const meterId = action.payload.meter.meterId;
      const meterReadingDetail = state.meterReadingDetails.find(m => m.meterDetails.meterId === meterId);

      const readingDetails = state.meterReadingDetails.map(mr => {

        mr.registerReadings.forEach(r => r.isShowDetails = false);
        if (mr.meterDetails.meterId !== meterId) {
          return mr;
        }

        const [firstRegister] = meterReadingDetail.registerReadings;
        const meterStats = {
          ...mr.meterDetails.meterReadingStats,
          register: firstRegister,
          chartView: ChartView.BAR,
          averageUsage: false,
          activeTabId: BillingReadingChartUsagesEnum.CurrentPeriod
        }

        return {
          ...mr,
          meterDetails: {
            ...mr.meterDetails,
            meterReadingStats: meterStats,
            isExpanded: !mr.meterDetails.isExpanded
          }
        };
      });


      const isAllReadingsExpanded = (readingDetails.length === readingDetails.filter(item => item.meterDetails.isExpanded === true).length);

      return {
        ...state,
        isShowDetails: isAllReadingsExpanded,
        meterReadingDetails: readingDetails
      };
    }

    case billingReadingsActions.REQUEST_CONFIRM_COMPLETE: {
      const {readingId, meterId, payload} = action.payload;

      return {
        ...state,
        meterReadingDetails: state.meterReadingDetails.map(mr => {
          if (mr.meterDetails.meterId !== meterId) {
            return mr;
          }

          const meterReading = {...mr};
          meterReading.registerReadings = meterReading.registerReadings.map(rr => {
            if (rr.currentReadingId !== readingId && rr.previousReadingId !== readingId) {
              return rr;
            }

            return {
              ...rr,
              ...payload,
            };
          });

          return meterReading;
        })
      };
    }

    default:
      return state;
  }
}

export const getBuildingPeriods = (state: State) => state.buildingPeriods;
export const getMeterReadingDetails = (state: State) => state.meterReadingDetails;
export const getTotal = (state: State) => state.total;
export const getSearchKey = (state: State) => state.searchKey;
export const getOrder = (state: State) => state.order;
export const getUnitsPerPage = (state: State) => state.unitsPerPage;
export const getPage = (state: State) => state.page;
export const getIsShowDetails = (state: State) => state.isShowDetails;
export const getUsageChart = (state: State) => state.chartUsage;
export const getMeterReadingChart = (state: State) => state.meterReadingChart;
export const getMetersReadingStatsChart = (state: State) => state.metersReadingStatsChart;
export const getIsShowVirtualRegisters = (state: State) => state.isShowVirtualRegisters;
export const getFilterDetail = (state: State) => state.filterDetail;
export const getSelectedBuildingPeriodId = (state: State) => state.selectedBuildingPeriodId;
export const getAllRegisters = (state: State) => state.allRegisters;
export const getAllNodes = (state: State) => state.allNodes;
export const getAllUnits = (state: State) => state.allUnits;
export const getAllLocations = (state: State) => state.allLocations;
export const getFilters = (state: State) => state.filters;
export const getAllTenants = (state: State) => state.allTenants;
export const getAllReasons = (state: State) => state.allReasons;
export const getMeterIdToEnterReadings = (state: State) => state.meterIdToEnterReadings;
export const getEstimates = (state: State) => state.estimationData && state.estimationData;
export const getPreviousReadingForEstimates = (state: State) => state.estimationData && state.estimationData.previousReading;
export const getSelectedEstimatedReason = (state: State) => state.estimationData && state.estimationData.estimatedReason;
