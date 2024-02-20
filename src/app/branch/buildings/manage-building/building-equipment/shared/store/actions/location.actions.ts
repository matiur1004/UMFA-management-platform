import {Action as StoreAction} from '@ngrx/store';

export const REQUEST_LOCATION_LIST = '[Building Equipment Location] REQUEST_LOCATION_LIST';
export const REQUEST_LOCATION_LIST_COMPLETE = '[Building Equipment Location] REQUEST_LOCATION_LIST_COMPLETE';
export const ADD_LOCATION = '[Building Equipment Location] ADD_LOCATION';
export const UPDATE_LOCATION = '[Building Equipment Location] UPDATE_LOCATION';
export const DELETE_LOCATION = '[Building Equipment Location] DELETE_LOCATION';
export const CLONE_LOCATION = '[Building Equipment Location] CLONE_LOCATION';
export const UPDATE_ORDER = '[Building Equipment Location] UPDATE_ORDER';
export const UPDATE_SEARCH_KEY = '[Building Equipment Location] UPDATE_SEARCH_KEY';
export const UPDATE_LOCATIONS = '[Building Equipment Location] UPDATE_LOCATIONS';
export const RESET_FORM = '[Building Equipment Location] RESET_FORM';


export class RequestLocationList implements StoreAction {
  readonly type = REQUEST_LOCATION_LIST;

  constructor() {
  }
}

export class RequestLocationListComplete implements StoreAction {
  readonly type = REQUEST_LOCATION_LIST_COMPLETE;

  constructor(public payload: any) {
  }
}

export class AddLocation implements StoreAction {
  readonly type = ADD_LOCATION;

  constructor(public payload: any) {
  }
}

export class UpdateLocation implements StoreAction {
  readonly type = UPDATE_LOCATION;

  constructor(public payload: any) {
  }
}

export class DeleteLocation implements StoreAction {
  readonly type = DELETE_LOCATION;

  constructor(public payload: any) {
  }
}

export class CloneLocation implements StoreAction {
  readonly type = CLONE_LOCATION;

  constructor(public payload: any) {
  }
}

export class UpdateOrder implements StoreAction {
  readonly type = UPDATE_ORDER;

  constructor(public payload: any) {
  }
}

export class UpdateSearchKey implements StoreAction {
  readonly type = UPDATE_SEARCH_KEY;

  constructor(public payload: any) {
  }
}

export class UpdateLocations implements StoreAction {
  readonly type = UPDATE_LOCATIONS;

  constructor(public payload: any) {
  }
}

export class ResetForm implements StoreAction {
  readonly type = RESET_FORM;

  constructor() {
  }
}

export type Action = RequestLocationList | RequestLocationListComplete | AddLocation |
  UpdateLocation | DeleteLocation | CloneLocation | UpdateOrder |
  UpdateSearchKey | UpdateLocations | ResetForm;
