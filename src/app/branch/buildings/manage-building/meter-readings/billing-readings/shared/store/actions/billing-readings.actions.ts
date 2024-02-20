import {
  BillingReadingChartUsagesEnum,
  BillingReadingsFilterModel,
  MeterReadingChartViewModel
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/models';
import {EstimatedReadingReasonViewModel} from '@app/shared/models/estimated-reading-reason';
import {Action as StoreAction} from '@ngrx/store';
import {
  ChartView,
  MeterDetail,
  MeterReading,
  MeterReadingDetails
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/store/reducers/billing-readings.store';
import {PagingViewModel} from '@models';

export const REQUEST_BUILDING_PERIODS_LIST = '[Building Billing Readings] REQUEST_BUILDING_PERIODS_LIST';
export const REQUEST_BUILDING_PERIODS_LIST_COMPLETE = '[Building Billing Readings] REQUEST_BUILDING_PERIODS_LIST_COMPLETE';

export const REQUEST_BUILDING_BILLING_READINGS_LIST = '[Building Billing Readings] REQUEST_BUILDING_BILLING_READINGS_LIST';
export const REQUEST_BUILDING_BILLING_READINGS_LIST_COMPLETE = '[Building Billing Readings] REQUEST_BUILDING_BILLING_READINGS_LIST_COMPLETE';

export const UPDATE_ORDER = '[Building Billing Readings] UPDATE_ORDER';
export const UPDATE_SEARCH_KEY = '[Building Billing Readings] UPDATE_SEARCH_KEY';
export const UPDATE_UNITS_PER_PAGE = '[Building Billing Readings] UPDATE_UNITS_PER_PAGE';
export const UPDATE_PAGE = '[Building Billing Readings] UPDATE_PAGE';
export const UPDATE_IS_SHOW_DETAILS = '[Building Billing Readings] UPDATE_IS_SHOW_DETAILS';
export const TOGGLE_METER_READING = '[Building Billing Readings] TOGGLE_METER_READING';

export const INIT_FILTER_DATA = '[Building Billing Readings] INIT_FILTER_DATA';
export const INIT_FILTER_DATA_COMPLETE = '[Building Billing Readings] INIT_FILTER_DATA_COMPLETE';
export const UPDATE_FILTER = '[Building Billing Readings] UPDATE_FILTER';
export const UPDATE_FILTER_COMPLETE = '[Building Billing Readings] UPDATE_FILTER_COMPLETE';
export const INIT_FILTER_DETAIL = '[Building Billing Readings] INIT_FILTER_DETAIL';
export const GET_ALL_FILTERS = '[Building Billing Readings] GET_ALL_FILTERS';
export const ADD_FILTER = '[Building Billing Readings] ADD_FILTER';
export const ADD_FILTER_SUCCESS = '[Building Billing Readings] ADD_FILTER_SUCCESS';
export const CHANGE_ACTIVE_FILTER = '[Building Billing Readings] CHANGE_ACTIVE_FILTER';
export const CHANGE_CHART_USAGE = '[Building Billing Readings] CHANGE_CHART_USAGE';
export const REMOVE_FILTER = '[Building Billing Readings] REMOVE_FILTER';
export const REMOVE_FILTER_SUCCESS = '[Building Billing Readings] REMOVE_FILTER_SUCCESS';
export const GET_ALL_FILTERS_SUCCESS = '[Building Billing Readings] GET_ALL_FILTERS_SUCCESS';
export const RESET_FILTER = '[Building Billing Readings] RESET_FILTER';
export const CANCEL_FILTER = '[Building Billing Readings] CANCEL_FILTER';
export const CHANGE_CHART_VIEW = '[Building Billing Readings] CHANGE_CHART_VIEW';
export const CHANGE_ACTIVE_TAB = '[Building Billing Readings] CHANGE_ACTIVE_TAB';
export const CHANGE_REGISTER_STATS = '[Building Billing Readings] CHANGE_REGISTER_STATS';
export const CHANGE_AVERAGE_USAGE = '[Building Billing Readings] CHANGE_AVERAGE_USAGE';

export const GET_METER_READINGS_CHART = '[Building Billing Readings] GET_METER_READINGS_CHART';
export const GET_METER_READINGS_STATS_CHART = '[Building Billing Readings] GET_METER_READINGS_STATS_CHART';
export const GET_METER_READINGS_STATS_CHART_SUCCESS = '[Building Billing Readings] GET_METER_READINGS_STATS_CHART_SUCCESS';
export const GET_METER_READINGS_CHART_SUCCESS = '[Building Billing Readings]  GET_METER_READINGS_CHART_SUCCESS';

export const TOGGLE_REGISTER_DETAILS = '[Building Billing Readings] TOGGLE_REGISTER_DETAILS';

export const UPDATE_SUPPLY_TYPE = '[Building Billing Readings] UPDATE_SUPPLY_TYPE';
export const UPDATE_READING_SOURCE = '[Building Billing Readings] UPDATE_READING_SOURCE';
export const UPDATE_REGISTER = '[Building Billing Readings] UPDATE_REGISTER';
export const UPDATE_READING_CATEGORY = '[Building Billing Readings] UPDATE_READING_CATEGORY';
export const UPDATE_IS_BILLING_ONLY_OPTION = '[Building Billing Readings] UPDATE_IS_BILLING_ONLY_OPTION';
export const UPDATE_IS_SHOW_VIRTUAL_REGISTERS = '[Building Billing Readings] UPDATE_IS_SHOW_VIRTUAL_REGISTERS';
export const UPDATE_NODE = '[Building Billing Readings] UPDATE_NODE';
export const UPDATE_REASON = '[Building Billing Readings] UPDATE_REASON';
export const UPDATE_UNIT = '[Building Billing Readings] UPDATE_UNIT';
export const UPDATE_TENANT = '[Building Billing Readings] UPDATE_TENANT';
export const UPDATE_METER_LOCATION = '[Building Billing Readings] UPDATE_METER_LOCATION';
export const UPDATE_BUILDING_PERIOD = '[Building Billing Readings] UPDATE_BUILDING_PERIOD';
export const UPDATE_ABNORMALITY_LEVEL = '[Building Billing Readings] UPDATE_ABNORMALITY_LEVEL';

export const REQUEST_RESET_READING = '[Building Billing Readings] REQUEST_RESET_READING';
export const REQUEST_RESET_READING_COMPLETE = '[Building Billing Readings] REQUEST_RESET_READING_COMPLETE';
export const UPDATE_METER_ID_TO_ENTER_READINGS = '[Building Billing Readings] UPDATE_METER_ID_TO_ENTER_READINGS';
export const READINGS_LIST_OPEN_ESTIMATION_FROM_CONTEXT_MENU = '[Building Billing Readings] Reading List Open Estimation From Context Menu';
export const APPLY_ESTIMATION_CLICK_APPLY = '[Building Billing Readings] Apply Estimated Popup Click Apply';
export const ESTIMATION_REASONS_LOAD = '[Building Billing Readings] ESTIMATION_REASONS_LOAD';
export const ESTIMATION_OPTIONS_LOADED = '[Building Billing Readings] Estimation Options Loaded';
export const ESTIMATION_REASONS_LOADED = '[Building Billing Readings] ESTIMATION_REASONS_LOADED';

export const REQUEST_CONFIRM = '[Building Billing Readings] REQUEST_CONFIRM';
export const REQUEST_CONFIRM_COMPLETE = '[Building Billing Readings] REQUEST_CONFIRM_COMPLETE';

export const EXPORT_BUILDING_BILLING_READINGS_TO_CSV = '[Building Billing Readings] EXPORT_BUILDING_BILLING_READINGS_TO_CSV';
export const UPDATE_READING_DETAILS = '[Building Billing Readings] UPDATE_READING_DETAILS';

export class RequestBuildingPeriodsList implements StoreAction {
  readonly type = REQUEST_BUILDING_PERIODS_LIST;

  constructor() {
  }
}

export class RequestBuildingPeriodsListComplete implements StoreAction {
  readonly type = REQUEST_BUILDING_PERIODS_LIST_COMPLETE;

  constructor(public payload: any) {
  }
}

export class RequestBuildingBillingReadingsList implements StoreAction {
  readonly type = REQUEST_BUILDING_BILLING_READINGS_LIST;

  constructor(public payload?: {
    periodId?: string
  }) {
  }
}

export class ToggleRegisterDetails implements StoreAction {
  readonly type = TOGGLE_REGISTER_DETAILS;

  constructor(public payload: { meterId: string; registerId: string }) {
  }
}

export class RequestBuildingBillingReadingsListComplete implements StoreAction {
  readonly type = REQUEST_BUILDING_BILLING_READINGS_LIST_COMPLETE;

  constructor(public payload: PagingViewModel<MeterReadingDetails>) {
  }
}


export class AddFilter implements StoreAction {
  readonly type = ADD_FILTER;

  constructor(public payload: string) {
  }
}

export class GetMeterReadingsStatsChart implements StoreAction {
  readonly type = GET_METER_READINGS_STATS_CHART;

  constructor(public payload: {
    meterId: string,
    registerId?: string,
    startDate?: Date,
    endDate?: Date,
    chartView: BillingReadingChartUsagesEnum,
    buildingPeriodId?: string
  }) {
  }
}


export class AddFilterSuccess implements StoreAction {
  readonly type = ADD_FILTER_SUCCESS;

  constructor(public payload: BillingReadingsFilterModel) {
  }
}

export class GetMeterReadingsChart implements StoreAction {
  readonly type = GET_METER_READINGS_CHART;

  constructor(public payload?: { chartUsage?: BillingReadingChartUsagesEnum, isCall?: boolean }) {
  }
}

export class GetMeterReadingsChartSuccess implements StoreAction {
  readonly type = GET_METER_READINGS_CHART_SUCCESS;

  constructor(public payload: { charts: MeterReadingChartViewModel[], isShowDetails: boolean }) {
  }
}

export class ChangeRegisterStats implements StoreAction {
  readonly type = CHANGE_REGISTER_STATS;

  constructor(public payload: { meterId: string, register: MeterReading }) {
  }
}

export class ChangeRegisterAverageUsage implements StoreAction {
  readonly type = CHANGE_AVERAGE_USAGE;

  constructor(public payload: { meterId: string }) {
  }
}

export class RemoveFilter implements StoreAction {
  readonly type = REMOVE_FILTER;

  constructor(public payload: BillingReadingsFilterModel) {
  }
}

export class RemoveFilterSuccess implements StoreAction {
  readonly type = REMOVE_FILTER_SUCCESS;

  constructor(public payload: BillingReadingsFilterModel) {
  }
}

export class ChangeChartView implements StoreAction {
  readonly type = CHANGE_CHART_VIEW;

  constructor(public payload: { chartView: ChartView, meterId: string }) {
  }
}

export class ChangeActiveTab implements StoreAction {
  readonly type = CHANGE_ACTIVE_TAB;

  constructor(public payload: { tabId: number, meterId: string }) {
  }
}

export class UpdateSearchKey implements StoreAction {
  readonly type = UPDATE_SEARCH_KEY;

  constructor(public payload: any) {
  }
}

export class UpdateOrder implements StoreAction {
  readonly type = UPDATE_ORDER;

  constructor(public payload: any) {
  }
}

export class UpdateUnitsPerPage implements StoreAction {
  readonly type = UPDATE_UNITS_PER_PAGE;

  constructor(public payload: any) {
  }
}

export class UpdatePage implements StoreAction {
  readonly type = UPDATE_PAGE;

  constructor(public payload: number) {
  }
}

export class UpdateIsShowDetailsOption implements StoreAction {
  readonly type = UPDATE_IS_SHOW_DETAILS;

  constructor() {
  }
}

export class UpdateIsShowVirtualRegisters implements StoreAction {
  readonly type = UPDATE_IS_SHOW_VIRTUAL_REGISTERS;

  constructor() {
  }
}

export class InitFilterData implements StoreAction {
  readonly type = INIT_FILTER_DATA;

  constructor() {
  }
}


export class EstimationReasonsLoad implements StoreAction {
  readonly type = ESTIMATION_REASONS_LOAD;

  constructor() {
  }
}


export class InitFilterDataComplete implements StoreAction {
  readonly type = INIT_FILTER_DATA_COMPLETE;

  constructor(public payload: any) {
  }
}

export class UpdateFilter implements StoreAction {
  readonly type = UPDATE_FILTER;

  constructor(public payload: string) {
  }
}

export class InitFilterDetail implements StoreAction {
  readonly type = INIT_FILTER_DETAIL;

  constructor() {
  }
}

export class EstimationReasonsLoaded implements StoreAction {
  readonly type = ESTIMATION_REASONS_LOADED;

  constructor(public payload: EstimatedReadingReasonViewModel[]) {
  }
}

export class GetAllFilters implements StoreAction {
  readonly type = GET_ALL_FILTERS;

  constructor() {
  }
}

export class GetAllFiltersSuccess implements StoreAction {
  readonly type = GET_ALL_FILTERS_SUCCESS;

  constructor(public payload: BillingReadingsFilterModel[]) {
  }
}

export class GetMeterReadingsStatsChartSuccess implements StoreAction {
  readonly type = GET_METER_READINGS_STATS_CHART_SUCCESS;

  constructor(public payload: MeterReadingChartViewModel | MeterReadingChartViewModel[]) {
  }
}

export class UpdateFilterComplete implements StoreAction {
  readonly type = UPDATE_FILTER_COMPLETE;

  constructor(public payload: BillingReadingsFilterModel) {
  }
}

export class ResetFilter implements StoreAction {
  readonly type = RESET_FILTER;

  constructor() {
  }
}

export class UpdateSupplyType implements StoreAction {
  readonly type = UPDATE_SUPPLY_TYPE;

  constructor(public payload) {
  }
}

export class UpdateReadingSource implements StoreAction {
  readonly type = UPDATE_READING_SOURCE;

  constructor(public payload) {
  }
}


export class ChangeActiveFilter implements StoreAction {
  readonly type = CHANGE_ACTIVE_FILTER;

  constructor(public payload: BillingReadingsFilterModel) {
  }
}

export class ChangeChartUsage implements StoreAction {
  readonly type = CHANGE_CHART_USAGE;

  constructor(public payload: BillingReadingChartUsagesEnum) {
  }
}

export class UpdateRegister implements StoreAction {
  readonly type = UPDATE_REGISTER;

  constructor(public payload) {
  }
}

export class UpdateReadingCategory implements StoreAction {
  readonly type = UPDATE_READING_CATEGORY;

  constructor(public payload) {
  }
}

export class UpdateIsBillingOnlyOption implements StoreAction {
  readonly type = UPDATE_IS_BILLING_ONLY_OPTION;

  constructor() {
  }
}

export class UpdateNode implements StoreAction {
  readonly type = UPDATE_NODE;

  constructor(public payload) {
  }
}

export class UpdateReason implements StoreAction {
  readonly type = UPDATE_REASON;

  constructor(public payload: string) {
  }
}

export class UpdateUnit implements StoreAction {
  readonly type = UPDATE_UNIT;

  constructor(public payload) {
  }
}

export class UpdateTenant implements StoreAction {
  readonly type = UPDATE_TENANT;

  constructor(public payload) {
  }
}

export class UpdateMeterLocation implements StoreAction {
  readonly type = UPDATE_METER_LOCATION;

  constructor(public payload) {
  }
}

export class UpdateBuildingPeriod implements StoreAction {
  readonly type = UPDATE_BUILDING_PERIOD;

  constructor(public payload) {
  }
}

export class UpdateAbnormalityLevel implements StoreAction {
  readonly type = UPDATE_ABNORMALITY_LEVEL;

  constructor(public payload) {
  }
}

export class SendResetReading implements StoreAction {
  readonly type = REQUEST_RESET_READING;

  constructor(public payload) {
  }
}

export class SendResetReadingComplete implements StoreAction {
  readonly type = REQUEST_RESET_READING_COMPLETE;

  constructor() {
  }
}

export class UpdateMeterIdToEnterReadings implements StoreAction {
  readonly type = UPDATE_METER_ID_TO_ENTER_READINGS;

  constructor(public payload) {
  }
}

export class ReadingListOpenEstimation implements StoreAction {
  readonly type = READINGS_LIST_OPEN_ESTIMATION_FROM_CONTEXT_MENU;

  constructor(public payload) {
  }
}

export class ApplyEstimatedClickApply implements StoreAction {
  readonly type = APPLY_ESTIMATION_CLICK_APPLY;

  constructor(public payload) {
  }
}

export class EstimationOptionsLoaded implements StoreAction {
  readonly type = ESTIMATION_OPTIONS_LOADED;

  constructor(public payload) {
  }
}

export class ToggleMeterReading implements StoreAction {
  readonly type = TOGGLE_METER_READING;

  constructor(public payload: { meter: MeterDetail }) {
  }
}

export class RequestConfirm implements StoreAction {
  readonly type = REQUEST_CONFIRM;

  constructor(public payload) {
  }
}

export class RequestConfirmComplete implements StoreAction {
  readonly type = REQUEST_CONFIRM_COMPLETE;

  constructor(public payload) {
  }
}

export class ExportBuildingBillingReadingsToCsv implements StoreAction {
  readonly type = EXPORT_BUILDING_BILLING_READINGS_TO_CSV;

  constructor() {
  }
}

export class CancelFilter implements StoreAction {
  readonly type = CANCEL_FILTER;

  constructor() {
  }
}

export class UpdateReadingDetails implements StoreAction {
  readonly type = UPDATE_READING_DETAILS;

  constructor(public payload) {
  }
}

export type Action = RequestBuildingBillingReadingsList |
  RequestBuildingBillingReadingsListComplete |
  AddFilterSuccess |
  RemoveFilterSuccess |
  UpdateSearchKey |
  GetMeterReadingsStatsChartSuccess |
  UpdateOrder |
  UpdatePage |
  UpdateIsShowDetailsOption |
  UpdateUnitsPerPage |
  EstimationReasonsLoaded |
  UpdateReason |
  InitFilterData |
  InitFilterDataComplete |
  UpdateFilter |
  InitFilterDetail |
  RemoveFilter |
  ChangeActiveFilter |
  EstimationReasonsLoad |
  UpdateFilterComplete |
  ResetFilter |
  UpdateSupplyType |
  UpdateReadingSource |
  GetAllFilters |
  GetAllFiltersSuccess |
  UpdateRegister |
  UpdateReadingCategory |
  UpdateIsBillingOnlyOption |
  GetMeterReadingsChart |
  GetMeterReadingsChartSuccess |
  UpdateNode |
  UpdateUnit |
  UpdateTenant |
  UpdateMeterLocation |
  UpdateAbnormalityLevel |
  RequestBuildingPeriodsList |
  RequestBuildingPeriodsListComplete |
  AddFilter |
  UpdateBuildingPeriod |
  SendResetReading |
  SendResetReadingComplete |
  ToggleRegisterDetails |
  ChangeChartUsage |
  UpdateMeterIdToEnterReadings |
  ChangeRegisterStats |
  ReadingListOpenEstimation |
  ChangeRegisterAverageUsage |
  ChangeChartView |
  ApplyEstimatedClickApply |
  ChangeActiveTab |
  GetMeterReadingsStatsChart |
  EstimationOptionsLoaded |
  ToggleMeterReading |
  RequestConfirm |
  RequestConfirmComplete |
  ExportBuildingBillingReadingsToCsv |
  CancelFilter |
  UpdateIsShowVirtualRegisters |
  UpdateReadingDetails;
