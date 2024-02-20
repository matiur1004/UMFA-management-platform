import {Action as StoreAction} from '@ngrx/store';
import {FilterAttribute} from '@app/branch/buildings/manage-building/building-equipment/shared/models/search-filter.model';

export const ATTRIBUTE_CHANGED = '[Building Bulk Equipment Attributes Step] ATTRIBUTE_CHANGED';

export const SELECT_ALL_METERS = '[Building Bulk Equipment Attributes Step] SELECT_ALL_METERS';
export const FILTER_WIZARD_EQUIPMENT = '[Building Bulk Equipment Attributes Step] FILTER_WIZARD_EQUIPMENT';

export const APPLY_BULK_VALUE = '[Building Bulk Equipment Attributes Step] APPLY_BULK_VALUE';

export const ATTRIBUTE_PHOTO_CHANGED = '[Building Bulk Equipment Attributes Step] ATTRIBUTE_PHOTO_CHANGED';

export class AttributeChanged implements StoreAction {
  readonly type = ATTRIBUTE_CHANGED;

  constructor(public payload: any) {
  }
}

export class SelectAllMeters implements StoreAction {
  readonly type = SELECT_ALL_METERS;

  constructor(public payload: any) {
  }
}


export class FilterWizardEquipment implements StoreAction {
  readonly type = FILTER_WIZARD_EQUIPMENT;

  constructor(public payload: FilterAttribute) {
  }
}

export class ApplyBulkValue implements StoreAction {
  readonly type = APPLY_BULK_VALUE;

  constructor(public payload: any) {
  }
}

export class AttributePhotoChanged implements StoreAction {
  readonly type = ATTRIBUTE_PHOTO_CHANGED;

  constructor(public payload: any) {
  }
}

export type Action =
  AttributeChanged
  | SelectAllMeters
  | ApplyBulkValue
  | AttributePhotoChanged
  | FilterWizardEquipment;
