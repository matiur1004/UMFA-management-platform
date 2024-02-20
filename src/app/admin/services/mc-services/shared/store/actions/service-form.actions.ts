import {Action as StoreAction} from '@ngrx/store';

export const EDIT_SERVICE = '[Service Form] EDIT_SERVICE';
export const CREATE_SERVICE = '[Service Form] CREATE_SERVICE';
export const SEND_SERVICE_REQUEST = '[Service Form] SEND_SERVICE_REQUEST';
export const SEND_SERVICE_REQUEST_COMPLETE = '[Service Form] SEND_SERVICE_REQUEST_COMPLETE';
export const UPDATE_PARENT_ID = '[Service Form] UPDATE_PARENT_ID';
export const GET_METER_TYPES_COMPLETE = '[Service Form] GET_METER_TYPES_COMPLETE';
export const ADD_METER_TYPE = '[Service Form] ADD_METER_TYPE';
export const REMOVE_METER_TYPE = '[Service Form] REMOVE_METER_TYPE';

export class EditService implements StoreAction {
  readonly type = EDIT_SERVICE;

  constructor(public payload: any) {
  }
}

export class CreateService implements StoreAction {
  readonly type = CREATE_SERVICE;

  constructor() {
  }
}

export class SendServiceRequest implements StoreAction {
  readonly type = SEND_SERVICE_REQUEST;

  constructor() {
  }
}

export class SendServiceRequestComplete implements StoreAction {
  readonly type = SEND_SERVICE_REQUEST_COMPLETE;

  constructor() {
  }
}

export class UpdateParentId implements StoreAction {
  readonly type = UPDATE_PARENT_ID;

  constructor(public payload: any) {
  }
}

export class GetMeterTypesComplete implements StoreAction {
  readonly type = GET_METER_TYPES_COMPLETE;

  constructor(public payload: any) {
  }
}

export class AddMeterType implements StoreAction {
  readonly type = ADD_METER_TYPE;

  constructor(public payload: any) {
  }
}

export class RemoveMeterType implements StoreAction {
  readonly type = REMOVE_METER_TYPE;

  constructor(public payload: any) {
  }
}

export type Action = EditService | CreateService | SendServiceRequest | SendServiceRequestComplete | UpdateParentId
  | GetMeterTypesComplete | AddMeterType | RemoveMeterType;

