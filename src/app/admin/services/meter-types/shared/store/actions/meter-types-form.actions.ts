import {Action as StoreAction} from '@ngrx/store';

export const UPDATE_METER_TYPES = '[Meter Types Form] UPDATE_METER_TYPES';
export const GET_METER_TYPES = '[Meter Types Form] GET_METER_TYPES';
export const ADD_METER_TYPE = '[Meter Types Form] ADD_METER_TYPE';
export const REMOVE_METER_TYPE = '[Meter Types Form] REMOVE_METER_TYPE';
export const REQUEST_COMPLETE = '[Meter Types Form] REQUEST_COMPLETE';

export class UpdateMeterTypes implements StoreAction {
  readonly type = UPDATE_METER_TYPES;

  constructor(public payload: any) {
  }
}

export class GetMeterTypes implements StoreAction {
  readonly type = GET_METER_TYPES;

  constructor() {
  }
}

export class AddMeterType implements StoreAction {
  readonly type = ADD_METER_TYPE;

  constructor() {
  }
}

export class RemoveMeterType implements StoreAction {
  readonly type = REMOVE_METER_TYPE;

  constructor(public payload: any) {
  }
}

export class RequestCompleted implements StoreAction {
  readonly type = REQUEST_COMPLETE;

  constructor() {
  }
}

export type Action = UpdateMeterTypes | GetMeterTypes | AddMeterType | RemoveMeterType | RequestCompleted;
