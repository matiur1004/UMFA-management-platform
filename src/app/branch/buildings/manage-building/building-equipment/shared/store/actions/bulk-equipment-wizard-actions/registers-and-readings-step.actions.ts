import {Action as StoreAction} from '@ngrx/store';
import {EquipmentTemplateViewModel} from '@app/shared/models';
import { FilterAttribute } from '../../../models/search-filter.model';

export const SELECT_ALL_METERS = '[Building Bulk Equipment Registers And Readings Step] SELECT_ALL_METERS';
export const SET_EQUIPMENT_TEMPLATES = '[Building Bulk Equipment Registers And Readings Step] SET_EQUIPMENT_TEMPLATES';

export const ADD_REGISTER = '[Building Bulk Equipment Registers And Readings Step] ADD_REGISTER';
export const REMOVE_REGISTER = '[Building Equipment Equipment Registers And Readings Step] REMOVE_REGISTER';

export const ADD_REGISTER_FILE = '[Building Bulk Equipment Registers And Readings Step] ADD_REGISTER_FILE';

export const CHANGE_REGISTER_SCALE = '[Building Bulk Equipment Registers And Readings Step] CHANGE_REGISTER_SCALE';
export const CHANGE_REGISTER_SEQUENCE = '[Building Bulk Equipment Registers And Readings Step] CHANGE_REGISTER_SEQUENCE';

export const APPLY_BULK_VALUE = '[Building Bulk Equipment Registers And Readings Step] APPLY_BULK_VALUE';
export const FILTER_WIZARD_EQUIPMENT = '[Building Bulk Equipment Registers And Readings Step] FILTER_WIZARD_EQUIPMENT';
export class SelectAllMeters implements StoreAction {
  readonly type = SELECT_ALL_METERS;

  constructor(public payload: any) {
  }
}

export class RemoveRegister implements StoreAction {
  readonly type = REMOVE_REGISTER;

  constructor(public payload: any) {
  }
}

export class AddRegister implements StoreAction {
  readonly type = ADD_REGISTER;

  constructor(public payload: any) {
  }
}

export class AddRegisterFile implements StoreAction {
  readonly type = ADD_REGISTER_FILE;

  constructor(public payload: any) {
  }
}

export class SetEquipmentTemplates implements StoreAction {
  readonly type = SET_EQUIPMENT_TEMPLATES;

  constructor(public payload: EquipmentTemplateViewModel[]) {
  }
}

export class ChangeRegisterScale implements StoreAction {
  readonly type = CHANGE_REGISTER_SCALE;

  constructor(public payload: any) {
  }
}

export class ApplyBulkValue implements StoreAction {
  readonly type = APPLY_BULK_VALUE;

  constructor(public payload: any) {
  }
}

export class ChangeRegisterSequence implements StoreAction {
  readonly type = CHANGE_REGISTER_SEQUENCE;

  constructor(public payload: { serialNumber: string, from: number, to: number }) {
  }
}

export class FilterWizardEquipment implements StoreAction {
  readonly type = FILTER_WIZARD_EQUIPMENT;

  constructor(public payload: FilterAttribute) {
  }
}

export type Action = SelectAllMeters | RemoveRegister | AddRegister |
  AddRegisterFile | SetEquipmentTemplates |
  ChangeRegisterScale | ApplyBulkValue | ChangeRegisterSequence | FilterWizardEquipment;
