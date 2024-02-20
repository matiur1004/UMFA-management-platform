import {Action as StoreAction} from '@ngrx/store';

export const ADD_LOCATION = '[BUILDING_STEP_WIZARD] ADD_LOCATION';
export const UPDATE_LOCATION = '[BUILDING_STEP_WIZARD] UPDATE_LOCATION';
export const DELETE_LOCATION = '[BUILDING_STEP_WIZARD] DELETE_LOCATION';
export const UPDATE_LOCATION_ORDER = '[BUILDING_STEP_WIZARD] UPDATE_LOCATION_ORDER';
export const UPDATE_LOCATION_SEQUENCE_NUMBER = '[BUILDING_STEP_WIZARD] UPDATE_LOCATION_SEQUENCE_NUMBER';
export const SET_LOCATIONS_LIST = '[BUILDING_STEP_WIZARD] SET_LOCATIONS_LIST';

export class AddLocation implements StoreAction {
  readonly type = ADD_LOCATION;

  constructor(public payload: {
    name: string,
    description: any
  }) {
  }
}

export class UpdateLocation implements StoreAction {
  readonly type = UPDATE_LOCATION;

  constructor(public payload: {
    sequenceNumber: number,
    name: string,
    description: any
  }) {
  }
}

export class DeleteLocation implements StoreAction {
  readonly type = DELETE_LOCATION;

  constructor(public payload: number) {
  }
}

export class UpdateLocationOrder implements StoreAction {
  readonly type = UPDATE_LOCATION_ORDER;

  constructor(public payload: any) {
  }
}

export class UpdateLocationSequenceNumber implements StoreAction {
  readonly type = UPDATE_LOCATION_SEQUENCE_NUMBER;

  constructor(public payload: any) {
  }
}

export class SetLocationsList implements StoreAction {
  readonly type = SET_LOCATIONS_LIST;

  constructor(public payload: any) {
  }
}

export type Action = AddLocation | UpdateLocation | DeleteLocation |
  UpdateLocationOrder | UpdateLocationSequenceNumber | SetLocationsList;
