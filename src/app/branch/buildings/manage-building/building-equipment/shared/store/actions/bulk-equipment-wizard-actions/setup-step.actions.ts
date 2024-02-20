import {Action as StoreAction} from '@ngrx/store';
import {EquipmentBulkStepActionType} from '@app/branch/buildings/manage-building/building-equipment/shared/models/bulk-action.model';

export const INIT_DATA = '[Building Bulk Equipment Setup Step] INIT_DATA';

export const EQUIPMENT_GROUP_CHANGED = '[Building Bulk Equipment Setup Step] EQUIPMENT_GROUP_CHANGED';
export const DEVICE_CHANGED = '[Building Bulk Equipment Setup Step] DEVICE_CHANGED';
export const LOCATION_CHANGED = '[Building Bulk Equipment Setup Step] LOCATION_CHANGED';
export const SUPPLIE_CHANGED = '[Building Bulk Equipment Setup Step] SUPPLIE_CHANGED';
export const LOCATION_TYPE_CHANGED = '[Building Bulk Equipment Setup Step] LOCATION_TYPE_CHANGED';

export const RESET_SETUP_STEP = '[Building Bulk Equipment Setup Step] RESET_SETUP_STEP';
export const APPLY_BULK_VALUE = '[Building Bulk Equipment Setup Step] APPLY_BULK_VALUE';

export const GET_EQUIPMENT_TEMPLATES_REQUEST_COMPLETE = '[Building Bulk Equipment Setup Step] GET_EQUIPMENT_TEMPLATES_REQUEST_COMPLETE';
export const GET_EQUIPMENT_GROUPS_REQUEST_COMPLETE = '[Building Bulk Equipment Setup Step] GET_EQUIPMENT_GROUPS_REQUEST_COMPLETE';
export const GET_LOCATIONS_REQUEST_COMPLETE = '[Building Bulk Equipment Setup Step] GET_LOCATIONS_REQUEST_COMPLETE';
export const GET_SUPPLIES_REQUEST_COMPLETE = '[Building Bulk Equipment Setup Step] GET_SUPPLIES_REQUEST_COMPLETE';

export const SELECT_ITEM = '[Building Bulk Equipment Setup Step] SELECT_ITEM';
export const SELECT_ALL_ITEM = '[Building Bulk Equipment Setup Step] SELECT_ALL_ITEM';
export const SET_DROPDOWN_DATA = '[Building Bulk Equipment Setup Step] SET_DROPDOWN_DATA';
export const ADD_NEW_ITEM = '[Building Bulk Equipment Setup Step] ADD_NEW_ITEM';
export const REMOVE_ITEM = '[Building Bulk Equipment Setup Step] REMOVE_ITEM';
export const CHANGE_IMAGE = '[Building Bulk Equipment Setup Step] CHANGE_IMAGE';

export class DeviceChange implements StoreAction {
  readonly type = DEVICE_CHANGED;

  constructor(public payload: {
    id: string,
    deviceId: string
  }) {
  }
}

export class LocationChanged implements StoreAction {
  readonly type = LOCATION_CHANGED;

  constructor(public payload: {
    id: string,
    locationId: string
  }) {
  }
}


export class ApplyBulkValue implements StoreAction {
  readonly type = APPLY_BULK_VALUE;

  constructor(public payload: { bulkAction: EquipmentBulkStepActionType, bulkValue: any }) {
  }
}

export class SupplieChanged implements StoreAction {
  readonly type = SUPPLIE_CHANGED;

  constructor(public payload: {
    id: string,
    supplyToId: string
  }) {
  }
}

export class LocationTypeChanged implements StoreAction {
  readonly type = LOCATION_TYPE_CHANGED;

  constructor(public payload: {
    id: string,
    locationType: string
  }) {
  }
}

export class EquipmentGroupChanged implements StoreAction {
  readonly type = EQUIPMENT_GROUP_CHANGED;

  constructor(public payload: {
    id: string,
    equipmentGroupId: string
  }) {
  }
}

export class SelectItem implements StoreAction {
  readonly type = SELECT_ITEM;

  constructor(public payload: { templateId: string }) {
  }
}

export class SelectAllItem implements StoreAction {
  readonly type = SELECT_ALL_ITEM;

  constructor(public payload: boolean) {
  }
}

export class ResetSetupStep implements StoreAction {
  readonly type = RESET_SETUP_STEP;

  constructor() {
  }
}

export class GetEquipmentGroupsRequestComplete implements StoreAction {
  readonly type = GET_EQUIPMENT_GROUPS_REQUEST_COMPLETE;

  constructor(public payload: any) {
  }
}

export class GetEquipmentTemplatesRequestComplete implements StoreAction {
  readonly type = GET_EQUIPMENT_TEMPLATES_REQUEST_COMPLETE;

  constructor(public payload: any) {
  }
}

export class GetLocationsRequestComplete implements StoreAction {
  readonly type = GET_LOCATIONS_REQUEST_COMPLETE;

  constructor(public payload: any) {
  }
}

export class GetSuppliesRequestComplete implements StoreAction {
  readonly type = GET_SUPPLIES_REQUEST_COMPLETE;

  constructor(public payload: any) {
  }
}

export class SetDropdownData implements StoreAction {
  readonly type = SET_DROPDOWN_DATA;

  constructor(public payload: any) {
  }
}

export class AddNewItem implements StoreAction {
  readonly type = ADD_NEW_ITEM;

  constructor(public payload: any) {
  }
}

export class RemoveItem implements StoreAction {
  readonly type = REMOVE_ITEM;

  constructor(public payload: { id?: string, selected: boolean }) {
  }
}

export class ChangeImage implements StoreAction {
  readonly type = CHANGE_IMAGE;

  constructor(public payload: { templateId: string, photo: string }) {
  }
}

export class InitData implements StoreAction {
  readonly type = INIT_DATA;

  constructor() {
  }
}

export type Action = DeviceChange | ResetSetupStep | LocationChanged | SupplieChanged |
  LocationTypeChanged | EquipmentGroupChanged | SelectAllItem | GetEquipmentGroupsRequestComplete |
  GetEquipmentTemplatesRequestComplete | GetLocationsRequestComplete | ApplyBulkValue | ChangeImage |
  GetSuppliesRequestComplete | SetDropdownData | AddNewItem | RemoveItem | InitData | SelectItem;

