import {Action as StoreAction} from '@ngrx/store';
import {ReadingsValidationViewModel} from '../../models';

export const REQUEST_READING_LIST = '[Building  Enter Reading] REQUEST_READING_LIST';
export const REQUEST_READING_LIST_COMPLETE = '[Building Enter Reading] REQUEST_READING_LIST_COMPLETE';

export const REQUEST_READINGS_FOR_DATE = '[Building Enter Reading] REQUEST_READINGS_FOR_DATE';
export const REQUEST_READINGS_FOR_DATE_COMPLETE = '[Building Enter Reading] REQUEST_READINGS_FOR_DATE_COMPLETE';
export const CLEAR_READINGS_FOR_DATE = '[Building Enter Reading] CLEAR_READINGS_FOR_DATE';

export const SEND_READING_LIST = '[Building Enter Reading] SEND_READING_LIST';
export const SEND_READING_LIST_COMPLETE = '[Building Enter Reading] SEND_READING_LIST_COMPLETE';

export const MARK_AS_SUBMITTED = '[Building Enter Reading] MARK_AS_SUBMITTED';
export const MARK_AS_UNSUBMITTED = '[Building Enter Reading] MARK_AS_UNSUBMITTED';

export const CHANGE_FILTER_AS_ALL_READINGS = '[Building Enter Reading] CHANGE_FILTER_AS_ALL_READINGS';
export const CHANGE_FILTER_AS_HAS_NO_READINGS = '[Building Enter Reading] CHANGE_FILTER_AS_HAS_NO_READINGS';
export const CHANGE_FILTER_AS_OF_DATE = '[Building Enter Reading] CHANGE_FILTER_AS_OF_DATE';
export const UPDATE_REGISTER_FILE = '[Building Enter Reading] UPDATE_REGISTER_FILE'
export const UPDATE_SEARCH_KEY = '[Building Enter Reading] UPDATE_SEARCH_KEY';
export const UPDATE_SEARCH_LOCATION = '[Building Enter Reading] UPDATE_SEARCH_LOCATION';

export const RESET_REGISTER_FILES = '[Building Enter Reading] RESET_REGISTER_FILES'

export class RequestReadingList implements StoreAction {
  readonly type = REQUEST_READING_LIST;

  constructor() {
  }
}

export class RequestReadingListComplete implements StoreAction {
  readonly type = REQUEST_READING_LIST_COMPLETE;

  constructor(public payload: any) {
  }
}

export class RequestReadingsForDate implements StoreAction {
  readonly type = REQUEST_READINGS_FOR_DATE;

  constructor(public payload: {
    year: number,
    month: number,
    day: number,
    readingSource: number
  }) {
  }
}

export class RequestReadingsForDateComplete implements StoreAction {
  readonly type = REQUEST_READINGS_FOR_DATE_COMPLETE;

  constructor(public payload: {
    readings: ReadingsValidationViewModel[]
  }) {
  }
}

export class SendReadingList implements StoreAction {
  readonly type = SEND_READING_LIST;

  constructor() {
  }
}

export class SendReadingListComplete implements StoreAction {
  readonly type = SEND_READING_LIST_COMPLETE;

  constructor(public payload: any) {
  }
}

export class MarkAsSubmitted implements StoreAction {
  readonly type = MARK_AS_SUBMITTED;

  constructor() {
  }
}

export class MarkAsUnsubmitted implements StoreAction {
  readonly type = MARK_AS_UNSUBMITTED;

  constructor() {
  }
}

export class ChangeFilterAsAllReadings implements StoreAction {
  readonly type = CHANGE_FILTER_AS_ALL_READINGS;

  constructor() {
  }
}

export class ChangeFilterAsHasNoReadings implements StoreAction {
  readonly type = CHANGE_FILTER_AS_HAS_NO_READINGS;

  constructor() {
  }
}

export class ChangeFilterAsOfDate implements StoreAction {
  readonly type = CHANGE_FILTER_AS_OF_DATE;

  constructor(public payload: any) {
  }
}

export class UpdateRegisterFile implements StoreAction {
  readonly type = UPDATE_REGISTER_FILE;

  constructor(public payload: any) {
  }
}

export class UpdateSearchKey implements StoreAction {
  readonly type = UPDATE_SEARCH_KEY;

  constructor(public payload: any) {
  }
}

export class UpdateSearchLocation implements StoreAction {
  readonly type = UPDATE_SEARCH_LOCATION;

  constructor(public payload: any) {
  }
}

export class ResetRegisterFiles implements StoreAction {
  readonly type = RESET_REGISTER_FILES;

  constructor() {
  }
}

export type Action = RequestReadingList | RequestReadingListComplete |
  SendReadingList | SendReadingListComplete | MarkAsSubmitted | MarkAsUnsubmitted |
  ChangeFilterAsAllReadings | ChangeFilterAsHasNoReadings | ChangeFilterAsOfDate
  | UpdateRegisterFile | ResetRegisterFiles | UpdateSearchKey | UpdateSearchLocation
  | RequestReadingsForDate
  | RequestReadingsForDateComplete;
