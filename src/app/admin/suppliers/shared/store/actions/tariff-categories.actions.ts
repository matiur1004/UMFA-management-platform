import {Action as StoreAction} from '@ngrx/store';
import {EquipmentAttributeViewModel, LogicalOperators, TariffCategoryRuleViewModel} from '@models';

// Add/Delete category
export const TARIFF_CATEGORY_ADD_NEW_CATEGORY = '[Tariff Categories Form] Add Supplier Category';
export const TARIFF_CATEGORY_DELETE_CATEGORY = '[Tariff Categories Form] Delete Supplier Category';

export class SupplierCategoryAdd implements StoreAction {
  readonly type = TARIFF_CATEGORY_ADD_NEW_CATEGORY;

  constructor() {
  }
}

export class SupplierCategoryDelete implements StoreAction {
  readonly type = TARIFF_CATEGORY_DELETE_CATEGORY;

  constructor(public payload: number) {
  }
}

// Work with Rules
export const TARIFF_CATEGORY_ADD_NEW_RULE = '[Tariff Categories Form] TARIFF_CATEGORY_ADD_NEW_RULE';
export const TARIFF_CATEGORY_DELETE_RULE = '[Tariff Categories Form] TARIFF_CATEGORY_DELETE_RULE';
export const TARIFF_CATEGORY_SET_RULE_LOGICAL_OPERATOR = '[Tariff Categories Form] TARIFF_CATEGORY_SET_RULE_LOGICAL_OPERATOR';
export const TARIFF_CATEGORY_CHANGE_RULE = '[Tariff Categories Form] TARIFF_CATEGORY_CHANGE_RULE';

export class SupplierCategoryAddNewRule implements StoreAction {
  readonly type = TARIFF_CATEGORY_ADD_NEW_RULE;

  constructor(public payload: { categoryId: string, groupId: string, ruleId: string }) {
  }
}

export class SupplierCategoryDeleteRule implements StoreAction {
  readonly type = TARIFF_CATEGORY_DELETE_RULE;

  constructor(public payload: { categoryId: string, groupId: string, ruleId: string }) {
  }
}

export class SupplierCategorySetRuleLogicalOperator implements StoreAction {
  readonly type = TARIFF_CATEGORY_SET_RULE_LOGICAL_OPERATOR;

  constructor(
    public payload: {
      categoryId: string,
      groupId: string,
      ruleId: string
      operator: LogicalOperators,
    }
  ) {
  }
}

export class SupplierCategoryChangeRule implements StoreAction {
  readonly type = TARIFF_CATEGORY_CHANGE_RULE;

  constructor(
    public payload: {
      categoryId: string,
      groupId: string,
      rule: TariffCategoryRuleViewModel,
    }
  ) {
  }
}

// Work with Groups
export const TARIFF_CATEGORY_ADD_NEW_GROUP = '[Tariff Categories Form] TARIFF_CATEGORY_ADD_NEW_GROUP';
export const TARIFF_CATEGORY_SET_GROUP_LOGICAL_OPERATOR = '[Tariff Categories Form] TARIFF_CATEGORY_SET_GROUP_LOGICAL_OPERATOR';

export class SupplierCategoryAddNewGroup implements StoreAction {
  readonly type = TARIFF_CATEGORY_ADD_NEW_GROUP;

  constructor(public payload: { categoryId: string, groupId: string }) {
  }
}

export class SupplierCategorySetGroupLogicalOperator implements StoreAction {
  readonly type = TARIFF_CATEGORY_SET_GROUP_LOGICAL_OPERATOR;

  constructor(
    public payload: {
      categoryId: string,
      groupId: string,
      operator: LogicalOperators,
    }
  ) {
  }
}

// GET Attributes
export const API_GET_EQUIPMENT_ATTRIBUTES = '[Supplier Categories] API_GET_EQUIPMENT_ATTRIBUTES';
export const API_GET_EQUIPMENT_ATTRIBUTES_SUCCEEDED = '[Supplier Categories] API_GET_EQUIPMENT_ATTRIBUTES_SUCCEEDED';

export class ApiGetEquipmentAttributes implements StoreAction {
  readonly type = API_GET_EQUIPMENT_ATTRIBUTES;

  constructor(public payload?: boolean) {
  }
}

export class ApiGetEquipmentAttributesSucceeded implements StoreAction {
  readonly type = API_GET_EQUIPMENT_ATTRIBUTES_SUCCEEDED;

  constructor(public payload: EquipmentAttributeViewModel[]) {
  }
}

export type Action =
  | SupplierCategoryAdd
  | SupplierCategoryDelete
  | SupplierCategoryAddNewRule
  | SupplierCategoryDeleteRule
  | SupplierCategorySetRuleLogicalOperator
  | SupplierCategoryAddNewGroup
  | SupplierCategorySetGroupLogicalOperator
  | SupplierCategoryChangeRule
  | ApiGetEquipmentAttributes
  | ApiGetEquipmentAttributesSucceeded;
