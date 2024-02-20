import {Action as StoreAction} from '@ngrx/store';

export const ATTRIBUTES_INIT = '[ATTRIBUTES Edit] ATTRIBUTES_INIT';
export const ATTRIBUTES_CREATE = '[ATTRIBUTES Edit] ATTRIBUTES_CREATE';
export const ATTRIBUTES_EDIT = '[ATTRIBUTES Edit] ATTRIBUTES_EDIT';
export const REQUEST_COMPLETE = '[ATTRIBUTES Edit] REQUEST_COMPLETE';

export const ATTRIBUTES_INIT_FOR_EDIT = '[ATTRIBUTES Edit] ATTRIBUTES_INIT_FOR_EDIT';

export const ATTRIBUTES_ADD_GROUP = '[ATTRIBUTES Edit] ATTRIBUTES_ADD_GROUP';
export const ATTRIBUTES_REMOVE_GROUP = '[ATTRIBUTES Edit] ATTRIBUTES_REMOVE_GROUP';

export const ATTRIBUTES_CHANGE_FIELD_TYPE = '[ATTRIBUTES Edit] ATTRIBUTES_CHANGE_FIELD_TYPE'

export const ATTRIBUTES_ADD_UNIT = '[ATTRIBUTES Edit] ATTRIBUTES_ADD_UNIT';
export const ATTRIBUTES_CHANGE_UNIT = '[ATTRIBUTES Edit] ATTRIBUTES_CHANGE_UNIT';
export const ATTRIBUTES_ADD_COMBO_OPTIONS = '[ATTRIBUTES Edit] ATTRIBUTES_ADD_COMBO_OPTIONS';
export const ATTRIBUTES_REMOVE_COMBO_OPTIONS = '[ATTRIBUTES Edit] ATTRIBUTES_REMOVE_COMBO_OPTIONS';

export const ATTRIBUTES_GET_OPTIONS = '[ATTRIBUTES Edit] ATTRIBUTES_GET_OPTIONS';
export const ATTRIBUTES_SET_OPTIONS = '[ATTRIBUTES Edit] ATTRIBUTES_SET_OPTIONS';

export class AttributesInit implements StoreAction {
  readonly type = ATTRIBUTES_INIT;

  constructor() {
  };
}

export class AttributesCreate implements StoreAction {
  readonly type = ATTRIBUTES_CREATE;

  constructor(public payload: any) {
  };
}

export class AttributesEdit implements StoreAction {
  readonly type = ATTRIBUTES_EDIT;

  constructor(public payload: any) {
  };
}

export class AttributesAddGroup implements StoreAction {
  readonly type = ATTRIBUTES_ADD_GROUP;

  constructor(public payload: any) {
  };
}

export class AttributesInitForEdit implements StoreAction {
  readonly type = ATTRIBUTES_INIT_FOR_EDIT;

  constructor(public payload: any) {
  };
}

export class AttributesRemoveGroup implements StoreAction {
  readonly type = ATTRIBUTES_REMOVE_GROUP;

  constructor(public payload: any) {
  };
}

export class AttributesChangeFieldType implements StoreAction {
  readonly type = ATTRIBUTES_CHANGE_FIELD_TYPE;

  constructor(public payload: any) {
  };
}

export class AttributesAddUnit implements StoreAction {
  readonly type = ATTRIBUTES_ADD_UNIT;

  constructor(public payload: any) {
  };
}

export class AttributesChangeUnit implements StoreAction {
  readonly type = ATTRIBUTES_CHANGE_UNIT;

  constructor(public payload: any) {
  };
}

export class AttributesAddComboOptions implements StoreAction {
  readonly type = ATTRIBUTES_ADD_COMBO_OPTIONS;

  constructor(public payload: any) {
  };
}

export class AttributesRemoveComboOptions implements StoreAction {
  readonly type = ATTRIBUTES_REMOVE_COMBO_OPTIONS;

  constructor(public payload: any) {
  };
}

export class AttributesGetUnits implements StoreAction {
  readonly type = ATTRIBUTES_GET_OPTIONS;

  constructor() {
  };
}

export class AttributesSetUnits implements StoreAction {
  readonly type = ATTRIBUTES_SET_OPTIONS;

  constructor(public payload: any) {
  };
}

export class RequestCompleted implements StoreAction {
  readonly type = REQUEST_COMPLETE;

  constructor() {
  }
}

export type Action =
  AttributesInit |
  AttributesCreate |
  AttributesEdit |
  AttributesAddGroup |
  AttributesRemoveGroup |
  AttributesAddUnit |
  AttributesInitForEdit |
  AttributesChangeFieldType |
  AttributesChangeUnit |
  AttributesAddComboOptions |
  AttributesRemoveComboOptions |
  AttributesGetUnits |
  RequestCompleted |
  AttributesSetUnits;
