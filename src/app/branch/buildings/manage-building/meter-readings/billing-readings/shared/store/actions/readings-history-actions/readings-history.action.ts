import {Action as StoreAction} from '@ngrx/store';
import {
  GroupedReadingsByBuildingPeriodViewModel,
  MeterViewModel,
  ReadingHistoryFilterViewModel,
  ReadingPinStatusViewModel,
  ReadingsHistoryViewModel,
  SORT_BY
} from '../../../models/readings-history.model';

export const GET_READINGS_HISTORY_LIST = '[Meter Readings Readings History] GET_READINGS_HISTORY_LIST';
export const GET_READINGS_HISTORY_LIST_COMPLETE = '[Meter Readings Readings History] GET_READINGS_HISTORY_LIST_COMPLETE';
export const GET_READINGS_HISTORY_AMOUNT = '[Meter Readings Readings History] GET_READINGS_HISTORY_AMOUNT';

export const GET_PINNED_READINGS_HISTORY = '[Meter Readings Readings History] GET_PINNED_READINGS_HISTORY';
export const GET_PINNED_READINGS_HISTORY_COMPLETE = '[Meter Readings Readings History] GET_PINNED_READINGS_HISTORY_COMPLETE';

export const INIT_FILTER = '[Meter Readings Readings History] INIT_FILTER';
export const SORT_BY_FILTER = '[Meter Readings Readings History] SORT_BY_FILTER';
export const ESTIMATED_REASONS = '[Meter Readings Readings History] ESTIMATED_REASONS';
export const DEFAULT_READINGS = '[Meter Readings Readings History] DEFAULT_READINGS';
export const GET_METERS_REQUEST = '[Meter Readings Readings History] GET_METERS_REQUEST';
export const GET_METERS_REQUEST_COMPLETE = '[Meter Readings Readings History] GET_METERS_REQUEST_COMPLETE';
export const TOGGLE_PIN_REQUEST = '[Meter Readings Readings History] TOGGLE_PIN';
export const TOGGLE_PIN_REQUEST_COMPLETE = '[Meter Readings Readings History] TOGGLE_PIN_COMPLETE';
export const SET_BILLING_REQUEST = '[Meter Readings Readings History] SET_BILLING_REQUEST';
export const SET_BILLING_REQUEST_COMPLETE = '[Meter Readings Readings History] SET_BILLING_REQUEST_COMPLETE';

export const UPDATE_METER = '[Meter Readings Readings History] UPDATE_METER';
export const UPDATE_REGISTER_TOU = '[Meter Readings Readings History] UPDATE_REGISTER_TOU';
export const UPDATE_START_DATE = '[Meter Readings Readings History] UPDATE_START_DATE';
export const UPDATE_END_DATE = '[Meter Readings Readings History] UPDATE_END_DATE';
export const UPDATE_READING_DETAILS = '[Meter Readings Readings History] UPDATE_READING_DETAILS';
export const DOWNLOAD_READING_DETAILS_FILE = '[Meter Readings Readings History] DOWNLOAD_READING_DETAILS_FILE';

export class GetReadingsHistoryList implements StoreAction {
  readonly type = GET_READINGS_HISTORY_LIST;

  constructor(public payload: { skip: number; take: number, startDate?: Date, endDate?: Date } = {
    skip: -1, take: -1,
  }) {
  }
}

export class GetReadingsHistoryListComplete implements StoreAction {
  readonly type = GET_READINGS_HISTORY_LIST_COMPLETE;

  constructor(public payload: GroupedReadingsByBuildingPeriodViewModel[]) {
  }
}

export class GetReadingsHistoryAmount implements StoreAction {
  readonly type = GET_READINGS_HISTORY_AMOUNT;

  constructor(public payload: number) {
  }
}

export class GetPinnedReadingsHistory implements StoreAction {
  readonly type = GET_PINNED_READINGS_HISTORY;

  constructor() {
  }
}

export class DefaultReadings implements StoreAction {
  readonly type = DEFAULT_READINGS;

  constructor() {
  }
}

export class SortBy implements StoreAction {
  readonly type = SORT_BY_FILTER;

  constructor(public payload: SORT_BY) {
  }
}

export class GetPinnedReadingsHistoryComplete implements StoreAction {
  readonly type = GET_PINNED_READINGS_HISTORY_COMPLETE;

  constructor(public payload: ReadingsHistoryViewModel[]) {
  }
}

export class InitFilter implements StoreAction {
  readonly type = INIT_FILTER;

  constructor(public payload: ReadingHistoryFilterViewModel) {
  }
}

export class GetMetersRequest implements StoreAction {
  readonly type = GET_METERS_REQUEST;

  constructor() {
  }
}

export class GetMetersRequestComplete implements StoreAction {
  readonly type = GET_METERS_REQUEST_COMPLETE;

  constructor(public payload: MeterViewModel[]) {
  }
}

export class TogglePinRequest implements StoreAction {
  readonly type = TOGGLE_PIN_REQUEST;

  constructor(public payload: ReadingPinStatusViewModel) {
  }
}

export class TogglePinRequestComplete implements StoreAction {
  readonly type = TOGGLE_PIN_REQUEST_COMPLETE;

  constructor(public payload: any) {
  }
}

export class SetBillingRequest implements StoreAction {
  readonly type = SET_BILLING_REQUEST;

  constructor(public payload: { readingId: string; buildingId: string, startDate: Date, endDate: Date }) {
  }
}

export class SetBillingRequestComplete implements StoreAction {
  readonly type = SET_BILLING_REQUEST_COMPLETE;

  constructor(public payload: ReadingsHistoryViewModel) {
  }
}

export class UpdateMeter implements StoreAction {
  readonly type = UPDATE_METER;

  constructor(public payload: string) {
  }
}

export class UpdateRegisterTou implements StoreAction {
  readonly type = UPDATE_REGISTER_TOU;

  constructor(public payload: any) {
  }
}

export class UpdateStartDate implements StoreAction {
  readonly type = UPDATE_START_DATE;

  constructor(public payload: Date) {
  }
}

export class UpdateEndDate implements StoreAction {
  readonly type = UPDATE_END_DATE;

  constructor(public payload: Date) {
  }
}


export class UpdateReadingDetails implements StoreAction {
  readonly type = UPDATE_READING_DETAILS;

  constructor(public payload) {
  }
}

export class DownloadReadingDetailsFile implements StoreAction {
  readonly type = DOWNLOAD_READING_DETAILS_FILE;

  constructor(public payload) {
  }
}

export type Action = GetReadingsHistoryList | GetReadingsHistoryListComplete | GetReadingsHistoryAmount |
  GetPinnedReadingsHistory | GetPinnedReadingsHistoryComplete | SortBy | DefaultReadings |
  InitFilter | GetMetersRequest | GetMetersRequestComplete |
  TogglePinRequest | TogglePinRequestComplete | UpdateMeter | SetBillingRequest | SetBillingRequestComplete |
  UpdateRegisterTou | UpdateStartDate | UpdateEndDate | UpdateReadingDetails | DownloadReadingDetailsFile;
