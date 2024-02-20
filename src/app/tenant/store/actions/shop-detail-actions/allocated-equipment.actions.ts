import {Action as StoreAction} from '@ngrx/store';

export const GET_ALLOCATED_EQUIP_REQUEST = '[Tenant Profiles Shop Detail Allocated Equipment] GET_ALLOCATED_EQUIP_REQUEST';

export const GET_ALLOCATED_EQUIP_REQUEST_COMPLETE =
  '[Tenant Profiles Shop Detail Allocated Equipment] GET_ALLOCATED_EQUIP_REQUEST_COMPLETE';

export class GetAllocatedEquipRequest implements StoreAction {
  readonly type = GET_ALLOCATED_EQUIP_REQUEST;

  constructor() {
  }
}

export class GetAllocatedEquipRequestComplete implements StoreAction {
  readonly type = GET_ALLOCATED_EQUIP_REQUEST_COMPLETE;

  constructor(public payload: any) {
  }
}

export type Actions = GetAllocatedEquipRequest | GetAllocatedEquipRequestComplete;
